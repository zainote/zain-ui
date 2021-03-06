import React from 'react';
import { Button } from '@material-ui/core';
import { useStyles } from './style';
import { ZuiButtonComponent, ZuiButtonProps } from './type';

const ZuiButtonInternal: React.ForwardRefRenderFunction<unknown, ZuiButtonProps> = (props, ref) => {
    const {
        /** 是否启用按钮立体效果 */
        elevation,
        variant,
        ...other
    } = props;

    const classes = useStyles();

    const buttonRef = (ref as any) || React.createRef<HTMLElement>();

    return (
        /**
         * 默认情况下，在页面中注入的 style会被插入到 <head> 元素的最后。 因此，相比其他样式表单，它们能够表现地更为具体。 如果您想要覆盖 Material-UI 的样式，请设置此属性。
         * 设置了 injectFirst 后，style 会被插入到 <head> 元素的最前面。
         * 这里不能加，只能在组件使用的时候加，统一设置 <StylesProvider injectFirst></StylesProvider>
         */
        <Button
            /**
             * className={classes.zain}
             * classes 属性可以定位到组件内部的样式，进行针对性修改
             */
            classes={{
                root: classes.root
            }}
            ref={buttonRef}
            variant={elevation ? 'contained' : variant}
            disableElevation={!elevation}
            {...other}
        ></Button>
    );
};

const ZuiButton = React.forwardRef<unknown, ZuiButtonProps>(ZuiButtonInternal) as ZuiButtonComponent;

ZuiButton.displayName = 'ZuiButton';

ZuiButton.defaultProps = {
};

export default ZuiButton;
