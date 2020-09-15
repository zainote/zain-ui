import _Popper from "@material-ui/core/Popper";
import _Grow from "@material-ui/core/Grow";
import _extends from "@babel/runtime/helpers/esm/extends";
import _Paper from "@material-ui/core/Paper";
import _ClickAwayListener from "@material-ui/core/ClickAwayListener";
import _MenuList from "@material-ui/core/MenuList";
import _MenuItem from "@material-ui/core/MenuItem";
import _classCallCheck from "@babel/runtime/helpers/esm/classCallCheck";
import _createClass from "@babel/runtime/helpers/esm/createClass";
import _assertThisInitialized from "@babel/runtime/helpers/esm/assertThisInitialized";
import _inherits from "@babel/runtime/helpers/esm/inherits";
import _possibleConstructorReturn from "@babel/runtime/helpers/esm/possibleConstructorReturn";
import _getPrototypeOf from "@babel/runtime/helpers/esm/getPrototypeOf";
import _defineProperty from "@babel/runtime/helpers/esm/defineProperty";

function _createSuper(Derived) { var hasNativeReflectConstruct = _isNativeReflectConstruct(); return function _createSuperInternal() { var Super = _getPrototypeOf(Derived), result; if (hasNativeReflectConstruct) { var NewTarget = _getPrototypeOf(this).constructor; result = Reflect.construct(Super, arguments, NewTarget); } else { result = Super.apply(this, arguments); } return _possibleConstructorReturn(this, result); }; }

function _isNativeReflectConstruct() { if (typeof Reflect === "undefined" || !Reflect.construct) return false; if (Reflect.construct.sham) return false; if (typeof Proxy === "function") return true; try { Date.prototype.toString.call(Reflect.construct(Date, [], function () {})); return true; } catch (e) { return false; } }

import React, { Component } from 'react';
import { withStyles } from '@material-ui/core/styles';
import { MenuListPlacementEnum, MenuListItem, OpenMenuMouseEventEnum } from './type';
import { styles } from './style';
/**
 * 菜单列表组件
 */

var Menu = /*#__PURE__*/function (_Component) {
  _inherits(Menu, _Component);

  var _super = _createSuper(Menu);

  function Menu(props) {
    var _this;

    _classCallCheck(this, Menu);

    _this = _super.call(this, props);

    _defineProperty(_assertThisInitialized(_this), "openSubMenuListTimeOut", void 0);

    _defineProperty(_assertThisInitialized(_this), "closeSubMenuListTimeOut", void 0);

    _defineProperty(_assertThisInitialized(_this), "openSubTime", 300);

    _defineProperty(_assertThisInitialized(_this), "closeSubTime", 300);

    _this.state = {
      open: false,
      mapOpenSubMenuList: new Map(),
      anchorRef: /*#__PURE__*/React.createRef(),
      menuItemHasSubHoverkey: undefined
    };
    return _this;
  }
  /** 显示子菜单列表，延时器 */


  _createClass(Menu, [{
    key: "componentDidUpdate",

    /**
     * 组件更新后会被立即调用。首次渲染不会执行此方法
     * @param prevProps 组件更新前的 props
     */
    value: function componentDidUpdate(prevProps) {
      // 典型用法（不要忘记比较 props）：
      if (this.props.open !== prevProps.open) {
        if (this.props.open === false) {
          /** 取消含有子菜单的菜单项，hover 状态 */
          this.setState({
            menuItemHasSubHoverkey: undefined
          });
        }

        this.setState({
          open: this.props.open
        });
      }
    }
    /**
     * 组件从 DOM 移出前立刻掉用
     */

  }, {
    key: "componentWillUnmount",
    value: function componentWillUnmount() {
      // 清除延时操作
      clearTimeout(this.openSubMenuListTimeOut);
      clearTimeout(this.closeSubMenuListTimeOut);
    }
    /**
     * 切换菜单列表显隐
     */

  }, {
    key: "handleToggle",
    value: function handleToggle() {
      if (this.state.open) {
        this.handleClose();
      } else {
        this.handleOpen();
      }
    }
    /**
     * 鼠标按下，切换菜单列表显隐
     */

  }, {
    key: "handleToggleMouseDown",
    value: function handleToggleMouseDown() {
      // 菜单列表已显示情况下，按下菜单按钮，隐藏菜单列表
      if (this.state.open === true) {
        this.handleClose();
      }

      if (!this.props.openMenuMouseEvent || this.props.openMenuMouseEvent === OpenMenuMouseEventEnum.ON_MOUSE_DOWN) {
        this.handleToggle();
      }
    }
    /**
     * 鼠标抬起，切换菜单显隐
     */

  }, {
    key: "handleToggleMouseUp",
    value: function handleToggleMouseUp() {
      if (this.props.openMenuMouseEvent === OpenMenuMouseEventEnum.ON_MOUSE_UP) {
        this.handleToggle();
      }
    }
    /**
     * 鼠标单击，切换菜单显隐
     */

  }, {
    key: "handleToggleClick",
    value: function handleToggleClick() {
      if (this.props.openMenuMouseEvent === OpenMenuMouseEventEnum.ON_CLICK) {
        this.handleToggle();
      }
    }
    /**
     * 鼠标移入，显示菜单列表
     */

  }, {
    key: "handleOpenMouseEnter",
    value: function handleOpenMouseEnter() {
      if (this.props.openMenuMouseEvent === OpenMenuMouseEventEnum.ON_MOUSE_ENTER) {
        this.handleOpen();
      }
    }
    /**
     * 显示子菜单列表
     */

  }, {
    key: "handleOpenSubMenuList",
    value: function handleOpenSubMenuList(subMenuKey) {
      var _this2 = this;

      /** 含有子菜单的菜单项，key 为 subMenuKey 的 hover 状态设置为 hover 中 */
      this.setState({
        menuItemHasSubHoverkey: subMenuKey
      });
      clearTimeout(this.closeSubMenuListTimeOut);
      clearTimeout(this.openSubMenuListTimeOut);
      this.openSubMenuListTimeOut = setTimeout(function () {
        var newMapOpenSubMenuList = new Map([[subMenuKey, true]]);

        _this2.state.mapOpenSubMenuList.forEach(function (value, key) {
          newMapOpenSubMenuList.set(key, key === subMenuKey);
        });

        _this2.setState({
          mapOpenSubMenuList: newMapOpenSubMenuList
        });

        clearTimeout(_this2.openSubMenuListTimeOut);
      }, this.openSubTime);
    }
    /**
     * 显示父组件的子菜单列表
     */

  }, {
    key: "handleOpenParentSubMenu",
    value: function handleOpenParentSubMenu() {
      if (this.props.handleOpenParentSubMenuList) {
        this.props.handleOpenParentSubMenuList();
      }
    }
    /**
     * 关闭子菜单列表
     */

  }, {
    key: "handleCloseSubMenuList",
    value: function handleCloseSubMenuList() {
      var _this3 = this;

      /** 取消含有子菜单的菜单项，hover 状态 */
      this.setState({
        menuItemHasSubHoverkey: undefined
      });
      clearTimeout(this.openSubMenuListTimeOut);
      clearTimeout(this.closeSubMenuListTimeOut);
      this.closeSubMenuListTimeOut = setTimeout(function () {
        var newMapOpenSubMenuList = new Map();

        _this3.setState({
          mapOpenSubMenuList: newMapOpenSubMenuList
        });

        clearTimeout(_this3.closeSubMenuListTimeOut);
      }, this.closeSubTime);
    }
    /**
     * （关闭/隐藏）菜单列表
     * @param event 当前单击到的元素（ClickAwayListener 组件传递，用来排除触发显示按钮的元素，防止按钮切换显隐和关闭逻辑冲突）
     */

  }, {
    key: "handleClose",
    value: function handleClose(event) {
      var _this4 = this;

      /** 取消含有子菜单的菜单项，hover 状态 */
      this.setState({
        menuItemHasSubHoverkey: undefined
      });

      if (event && this.state.anchorRef && this.state.anchorRef.current && this.state.anchorRef.current.contains(event.target)) {
        return;
      }

      this.setState({
        open: false
      }, function () {
        if (_this4.props.onMenuListOpenClose) {
          _this4.props.onMenuListOpenClose(_this4.state.open);
        }
      });
    }
    /**
     * （打开/显示）菜单列表
     */

  }, {
    key: "handleOpen",
    value: function handleOpen() {
      var _this5 = this;

      this.setState({
        open: true
      }, function () {
        if (_this5.props.onMenuListOpenClose) {
          _this5.props.onMenuListOpenClose(_this5.state.open);
        }
      });
    }
    /**
     * 单击到菜单的每一项触发
     */

  }, {
    key: "handleMenuItem",
    value: function handleMenuItem(menuListItem) {
      var menuListItemReturn = new MenuListItem();
      menuListItemReturn = menuListItem;

      if (this.props.onClickMenuListItem) {
        this.props.onClickMenuListItem(menuListItemReturn);
      }

      this.handleClose();
    }
    /**
     * 渲染普通菜单项
     * @param item 菜单项内容
     */

  }, {
    key: "renderMenuItem",
    value: function renderMenuItem(item) {
      var _this6 = this;

      return /*#__PURE__*/React.createElement(_MenuItem, {
        key: "ZuiMenuItem-".concat(item.key),
        onMouseUp: function onMouseUp() {
          _this6.handleMenuItem(item);
        },
        onMouseEnter: function onMouseEnter() {
          _this6.handleCloseSubMenuList();
        }
      }, item.leftText && /*#__PURE__*/React.createElement("div", {
        className: "".concat(item.rightText ? this.props.classes.leftText : '')
      }, item.leftText), item.rightText && /*#__PURE__*/React.createElement("div", {
        className: this.props.classes.rightText
      }, item.rightText));
    }
    /**
     * 渲染包含子菜单的菜单项
     * @param item 菜单项内容
     */

  }, {
    key: "renderMenuSubItem",
    value: function renderMenuSubItem(item) {
      var _this7 = this;

      return /*#__PURE__*/React.createElement(Menu, {
        key: "ZuiMenuList-".concat(item.key),
        classes: this.props.classes,
        className: "".concat(this.props.classes.subList).concat(this.state.menuItemHasSubHoverkey === item.key ? " ".concat(this.props.classes.buttonHover) : ''),
        open: this.state.mapOpenSubMenuList.get(item.key) === true,
        menuListItems: item.menuListItems,
        placement: MenuListPlacementEnum.RIGHT_START,
        openMenuMouseEvent: OpenMenuMouseEventEnum.ON_MOUSE_ENTER,
        container: this.props.container ? this.props.container : this.state.anchorRef.current,
        handleOpenParentSubMenuList: function handleOpenParentSubMenuList() {
          return _this7.handleOpenSubMenuList(item.key);
        },
        onClickMenuListItem: function onClickMenuListItem(menuListItemReturn) {
          _this7.handleMenuItem(menuListItemReturn);
        }
      }, /*#__PURE__*/React.createElement(_MenuItem, {
        onMouseEnter: function onMouseEnter() {
          _this7.handleOpenSubMenuList(item.key);
        },
        onMouseLeave: function onMouseLeave() {
          _this7.handleCloseSubMenuList();
        }
      }, item.leftText && /*#__PURE__*/React.createElement("div", {
        className: "".concat(item.rightText ? this.props.classes.leftText : '')
      }, item.leftText), item.rightText && /*#__PURE__*/React.createElement("div", {
        className: this.props.classes.rightText
      }, item.rightText), /*#__PURE__*/React.createElement("div", {
        className: this.props.classes.subIcon
      }, /*#__PURE__*/React.createElement("svg", {
        width: "16",
        height: "16",
        viewBox: "0 0 16 16",
        xmlns: "http://www.w3.org/2000/svg",
        fill: "currentColor"
      }, /*#__PURE__*/React.createElement("path", {
        fillRule: "evenodd",
        clipRule: "evenodd",
        d: "M10.072 8.024L5.715 3.667l.618-.62L11 7.716v.618L6.333 13l-.618-.619 4.357-4.357z"
      })))));
    }
  }, {
    key: "render",
    value: function render() {
      var _this8 = this;

      return /*#__PURE__*/React.createElement("div", {
        className: "".concat(this.props.classes.root).concat(this.props.className ? " ".concat(this.props.className) : '')
      }, /*#__PURE__*/React.createElement("div", {
        className: "MuiZuiMenu-button",
        ref: this.state.anchorRef,
        "aria-controls": this.state.open && this.props.open !== false ? 'ZuiMenuList-grow' : undefined,
        "aria-haspopup": "true",
        onMouseDown: function onMouseDown() {
          _this8.handleToggleMouseDown();
        },
        onMouseEnter: function onMouseEnter() {
          _this8.handleOpenMouseEnter();
        },
        onClick: function onClick() {
          _this8.handleToggleClick();
        },
        onMouseUp: function onMouseUp() {
          _this8.handleToggleMouseUp();
        }
      }, this.props.children), /*#__PURE__*/React.createElement(_Popper, {
        className: this.props.classes.popper,
        open: this.state.open && this.props.open !== false,
        anchorEl: this.state.anchorRef.current,
        role: undefined,
        container: this.props.container ? this.props.container : this.state.anchorRef.current,
        placement: this.props.placement ? this.props.placement : MenuListPlacementEnum.BOTTOM_START,
        onMouseEnter: function onMouseEnter() {
          _this8.handleOpenParentSubMenu();
        }
      }, function (_ref) {
        var TransitionProps = _ref.TransitionProps,
            placement = _ref.placement;
        return /*#__PURE__*/React.createElement(_Grow, _extends({}, TransitionProps, {
          style: {
            transformOrigin: placement === 'bottom' ? 'center top' : 'center bottom'
          }
        }), /*#__PURE__*/React.createElement(_Paper, {
          className: _this8.props.classes.paper,
          square: true
        }, /*#__PURE__*/React.createElement(_ClickAwayListener, {
          mouseEvent: "onMouseDown",
          onClickAway: function onClickAway(event) {
            _this8.handleClose(event);
          }
        }, /*#__PURE__*/React.createElement(_MenuList, {
          id: "ZuiMenuList-grow",
          autoFocusItem: _this8.state.open && _this8.props.open !== false
        }, _this8.props.menuListItems && _this8.props.menuListItems.map(function (item, index) {
          if (item.splitLine) {
            return /*#__PURE__*/React.createElement("div", {
              key: "ZuiMenuList-split-".concat(index),
              className: _this8.props.classes.splitLine
            });
          }

          if (item.menuListItems) {
            return _this8.renderMenuSubItem(item);
          }

          return _this8.renderMenuItem(item);
        })))));
      }));
    }
  }]);

  return Menu;
}(Component);

export default withStyles(styles, {
  name: 'MuiZuiMenu'
})(Menu);