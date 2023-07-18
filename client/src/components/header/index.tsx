import { DarkModeOutlined, LightModeOutlined } from "@mui/icons-material";
import {
  AppBar,
  IconButton,
  Stack,
  Toolbar,
} from "@mui/material";
import { useGetIdentity } from "@refinedev/core";
import { HamburgerMenu, RefineThemedLayoutV2HeaderProps } from "@refinedev/mui";
import React, { useContext } from "react";
import { ColorModeContext } from "../../contexts/color-mode";
import logoWhite from '../../assets/logowhite.png'

export const Header: React.FC<RefineThemedLayoutV2HeaderProps> = ({
  isSticky = true,
}) => {
  const { mode, setMode } = useContext(ColorModeContext);

  return (
    <AppBar position={isSticky ? "sticky" : "relative"} sx={{background:'linear-gradient(45deg, #0b8793 30%, #360033 90%)!important'}}>
      <Toolbar>
        <Stack direction="row" width="100%" alignItems="center">
          <HamburgerMenu />
          <Stack
            direction="row"
            width="100%"
            justifyContent="flex-end"
            alignItems="center"
            gap="16px"
          >
            <IconButton
              color="inherit"
              onClick={() => {
                setMode();
              }}
            >
              {mode === "dark" ? <LightModeOutlined /> : <DarkModeOutlined />}
            </IconButton>
            <Stack
                direction="row"
                gap="16px"
                alignItems="center"
                justifyContent="center"
              >
                <img src={logoWhite} alt='logo' className="w-24"/>
              </Stack>
          </Stack>
        </Stack>
      </Toolbar>
    </AppBar>
  );
};
