import React, { Component } from 'react';
import { Popper, Grow, Paper, ClickAwayListener, MenuItem, MenuList } from '@material-ui/core';
import { withStyles } from '@material-ui/core/styles';
import { MenuListProps, WindowMenuBarState, MenuListPlacementEnum, MenuListItem, OpenMenuMouseEventEnum } from './type';
import { styles } from './style';

/**
 * 菜单列表组件
 */
class Menu extends Component<MenuListProps, WindowMenuBarState> {
    constructor(props: MenuListProps) {
        super(props);
        this.state = {
            open: false,
            mapOpenSubMenuList: new Map<string, boolean>(),
            anchorRef: React.createRef(),
            menuItemHasSubHoverkey: undefined
        };
    }

    /** 显示子菜单列表，延时器 */
    private openSubMenuListTimeOut: NodeJS.Timeout;

    /** 隐藏子菜单列表，延时器 */
    private closeSubMenuListTimeOut: NodeJS.Timeout;

    /** 打开子菜单延时（ms） */
    // eslint-disable-next-line no-magic-numbers
    private readonly openSubTime = 300;

    /** 关闭子菜单延时（ms） */
    // eslint-disable-next-line no-magic-numbers
    private readonly closeSubTime = 300;

    /**
     * 组件更新后会被立即调用。首次渲染不会执行此方法
     * @param prevProps 组件更新前的 props
     */
    componentDidUpdate(prevProps: MenuListProps): void {
        // 典型用法（不要忘记比较 props）：
        if (this.props.open !== prevProps.open) {
            if (this.props.open === false) {
                /** 取消含有子菜单的菜单项，hover 状态 */
                this.setState({ menuItemHasSubHoverkey: undefined });
            }
            this.setState({ open: this.props.open });
        }
    }

    /**
     * 组件从 DOM 移出前立刻掉用
     */
    componentWillUnmount(): void {
        // 清除延时操作
        clearTimeout(this.openSubMenuListTimeOut);
        clearTimeout(this.closeSubMenuListTimeOut);
    }

    /**
     * 切换菜单列表显隐
     */
    private handleToggle(): void {
        if (this.state.open) {
            this.handleClose();
        } else {
            this.handleOpen();
        }
    }

    /**
     * 鼠标按下，切换菜单列表显隐
     */
    private handleToggleMouseDown(): void {
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
    private handleToggleMouseUp(): void {
        if (this.props.openMenuMouseEvent === OpenMenuMouseEventEnum.ON_MOUSE_UP) {
            this.handleToggle();
        }
    }

    /**
     * 鼠标单击，切换菜单显隐
     */
    private handleToggleClick(): void {
        if (this.props.openMenuMouseEvent === OpenMenuMouseEventEnum.ON_CLICK) {
            this.handleToggle();
        }
    }

    /**
     * 鼠标移入，显示菜单列表
     */
    private handleOpenMouseEnter(): void {
        if (this.props.openMenuMouseEvent === OpenMenuMouseEventEnum.ON_MOUSE_ENTER) {
            this.handleOpen();
        }
    }

    /**
     * 显示子菜单列表
     */
    private handleOpenSubMenuList(subMenuKey: string): void {
        /** 含有子菜单的菜单项，key 为 subMenuKey 的 hover 状态设置为 hover 中 */
        this.setState({ menuItemHasSubHoverkey: subMenuKey });
        clearTimeout(this.closeSubMenuListTimeOut);
        clearTimeout(this.openSubMenuListTimeOut);
        this.openSubMenuListTimeOut = setTimeout(() => {
            const newMapOpenSubMenuList = new Map([[subMenuKey, true]]);
            this.state.mapOpenSubMenuList.forEach((value: boolean, key: string) => {
                newMapOpenSubMenuList.set(key, key === subMenuKey);
            });
            this.setState({ mapOpenSubMenuList: newMapOpenSubMenuList });
            clearTimeout(this.openSubMenuListTimeOut);
        }, this.openSubTime);
    }

    /**
     * 显示父组件的子菜单列表
     */
    private handleOpenParentSubMenu(): void {
        if (this.props.handleOpenParentSubMenuList) {
            this.props.handleOpenParentSubMenuList();
        }
    }


    /**
     * 关闭子菜单列表
     */
    private handleCloseSubMenuList(): void {
        /** 取消含有子菜单的菜单项，hover 状态 */
        this.setState({ menuItemHasSubHoverkey: undefined });
        clearTimeout(this.openSubMenuListTimeOut);
        clearTimeout(this.closeSubMenuListTimeOut);
        this.closeSubMenuListTimeOut = setTimeout(() => {
            const newMapOpenSubMenuList = new Map();
            this.setState({ mapOpenSubMenuList: newMapOpenSubMenuList });
            clearTimeout(this.closeSubMenuListTimeOut);
        }, this.closeSubTime);
    }

    /**
     * （关闭/隐藏）菜单列表
     * @param event 当前单击到的元素（ClickAwayListener 组件传递，用来排除触发显示按钮的元素，防止按钮切换显隐和关闭逻辑冲突）
     */
    private handleClose(event?: React.MouseEvent<Document, MouseEvent>): void {
        /** 取消含有子菜单的菜单项，hover 状态 */
        this.setState({ menuItemHasSubHoverkey: undefined });
        if (event && this.state.anchorRef && this.state.anchorRef.current && this.state.anchorRef.current.contains(event.target as HTMLElement)) {
            return;
        }
        this.setState({ open: false }, () => {
            if (this.props.onMenuListOpenClose) {
                this.props.onMenuListOpenClose(this.state.open);
            }
        });
    }

    /**
     * （打开/显示）菜单列表
     */
    private handleOpen(): void {
        this.setState({ open: true }, () => {
            if (this.props.onMenuListOpenClose) {
                this.props.onMenuListOpenClose(this.state.open);
            }
        });
    }

    /**
     * 单击到菜单的每一项触发
     */
    private handleMenuItem(menuListItem: MenuListItem): void {
        let menuListItemReturn = new MenuListItem();
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
    private renderMenuItem(item: MenuListItem): JSX.Element {
        return (
            <MenuItem
                key={`ZuiMenuItem-${item.key}`}
                onMouseUp={() => { this.handleMenuItem(item); }}
                onMouseEnter={ () => { this.handleCloseSubMenuList(); }}
            >
                {item.leftText && <div className={`${item.rightText ? this.props.classes.leftText : ''}`}>{item.leftText}</div>}
                {item.rightText && <div className={this.props.classes.rightText}>{item.rightText}</div>}
            </MenuItem>
        );
    }

    /**
     * 渲染包含子菜单的菜单项
     * @param item 菜单项内容
     */
    private renderMenuSubItem(item: MenuListItem): JSX.Element {
        return (
            <Menu
                key={`ZuiMenuList-${item.key}`}
                classes={this.props.classes}
                className={`${this.props.classes.subList}${
                    this.state.menuItemHasSubHoverkey === item.key ? ` ${this.props.classes.buttonHover}` : ''
                }`}
                open={this.state.mapOpenSubMenuList.get(item.key) === true}
                menuListItems={item.menuListItems}
                placement={MenuListPlacementEnum.RIGHT_START}
                openMenuMouseEvent={OpenMenuMouseEventEnum.ON_MOUSE_ENTER}
                container={this.props.container ? this.props.container : this.state.anchorRef.current}
                handleOpenParentSubMenuList={() => { return this.handleOpenSubMenuList(item.key); }}
                onClickMenuListItem={(menuListItemReturn: MenuListItem) => { this.handleMenuItem(menuListItemReturn); }}
            >
                <MenuItem
                    onMouseEnter={() => { this.handleOpenSubMenuList(item.key); }}
                    onMouseLeave={ () => { this.handleCloseSubMenuList(); }}
                >
                    {item.leftText && <div className={`${item.rightText ? this.props.classes.leftText : ''}`}>{item.leftText}</div>}
                    {item.rightText && <div className={this.props.classes.rightText}>{item.rightText}</div>}
                    <div className={this.props.classes.subIcon}>
                        <svg width="16" height="16" viewBox="0 0 16 16" xmlns="http://www.w3.org/2000/svg" fill="currentColor">
                            {/* eslint-disable-next-line max-len */}
                            <path fillRule="evenodd" clipRule="evenodd" d="M10.072 8.024L5.715 3.667l.618-.62L11 7.716v.618L6.333 13l-.618-.619 4.357-4.357z"/>
                        </svg>
                    </div>
                </MenuItem>
            </Menu>
        );
    }

    public render(): JSX.Element {
        return (
            <div className={`${this.props.classes.root}${this.props.className ? ` ${this.props.className}` : ''}`}>
                <div
                    className="MuiZuiMenu-button"
                    ref={this.state.anchorRef}
                    aria-controls={(this.state.open && this.props.open !== false) ? 'ZuiMenuList-grow' : undefined}
                    aria-haspopup="true"
                    onMouseDown={() => { this.handleToggleMouseDown(); }}
                    onMouseEnter={() => { this.handleOpenMouseEnter(); }}
                    onClick={() => { this.handleToggleClick(); }}
                    onMouseUp={() => { this.handleToggleMouseUp(); }}
                >
                    {this.props.children}
                </div>
                <Popper
                    className={this.props.classes.popper}
                    open={this.state.open && this.props.open !== false}
                    anchorEl={this.state.anchorRef.current}
                    role={undefined}
                    container={this.props.container ? this.props.container : this.state.anchorRef.current}
                    placement={this.props.placement ? this.props.placement : MenuListPlacementEnum.BOTTOM_START}
                    onMouseEnter={() => { this.handleOpenParentSubMenu(); }}
                >
                    {({ TransitionProps, placement }) => {
                        return (
                            <Grow
                                {...TransitionProps}
                                style={{ transformOrigin: placement === 'bottom' ? 'center top' : 'center bottom' }}
                            >
                                <Paper style={{ visibility: 'unset' }} className={this.props.classes.paper} square>
                                    {/*
                                    * 依赖包 bug; style={{ visibility: 'unset' }}
                                    * csstype 需要支持 string;
                                    * 需要手动修改 node_modules/csstype/index.d.ts 文件: export type VisibilityProperty = Globals | "collapse" | "hidden" | "visible" | string;
                                    * 所以，这条样式卸写在组件 style 中
                                    */ }
                                    <ClickAwayListener
                                        mouseEvent="onMouseDown"
                                        onClickAway={(event: React.MouseEvent<Document, MouseEvent>) => {
                                            this.handleClose(event);
                                        }}
                                    >
                                        <MenuList
                                            id="ZuiMenuList-grow"
                                            autoFocusItem={this.state.open && this.props.open !== false}
                                        >
                                            {
                                                this.props.menuListItems &&
                                                this.props.menuListItems.map((item: MenuListItem, index: number) => {
                                                    if (item.splitLine) {
                                                        return (
                                                            <div
                                                                key={`ZuiMenuList-split-${index}`}
                                                                className={this.props.classes.splitLine}
                                                            ></div>
                                                        );
                                                    }
                                                    if (item.menuListItems) {
                                                        return this.renderMenuSubItem(item);
                                                    }
                                                    return this.renderMenuItem(item);
                                                })
                                            }
                                        </MenuList>
                                    </ClickAwayListener>
                                </Paper>
                            </Grow>
                        );
                    }}
                </Popper>
            </div>
        );
    }
}

export default withStyles(styles, { name: 'MuiZuiMenu' })(Menu);
