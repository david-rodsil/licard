import React from "react";
import { useRouterContext, TitleProps, useLink, useRouterType,} from "@refinedev/core";
import { Button, useTheme } from "@mui/material";
import logoBlack from "../../assets/logo.png"
import logoWhite from "../../assets/logowhite.png"
import imagotipo from "../../assets/imagotipo.png"

export const AppIcon: React.FC<TitleProps> = ({ collapsed }) => {
    const routerType = useRouterType();
    const Link = useLink();
    const { Link: LegacyLink } = useRouterContext();

    const theme = useTheme();
    const logo = theme.palette.mode === 'dark' ? logoWhite : logoBlack;

    const ActiveLink = routerType === "legacy" ? LegacyLink : Link;

    return (
        <Button fullWidth variant="text" disableRipple>
            <ActiveLink to="/">
                {collapsed ? (
                    <img
                        src={imagotipo}
                        alt="moreliabrilla"
                        width="28px"
                        style={{ maxHeight: "38px" }}
                    />
                    ) : (
                    <img src={logo} alt="Refine" width="110px" />
                )}
            </ActiveLink>
        </Button>
    );
};