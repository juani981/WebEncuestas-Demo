import * as React from "react";
import Button from "@mui/material/Button";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import PopupState, {
  bindHover,
  bindMenu,
  bindToggle,
  bindTrigger,
} from "material-ui-popup-state";
import HoverMenu from "material-ui-popup-state/HoverMenu";
import HoverPopover from "material-ui-popup-state/HoverPopover";
import { Link } from "react-router-dom";
import { Hidden, Tab } from "@mui/material";
import Collapse from "@mui/material/Collapse";

export const DropDownMenu = ({ title, root, items, value, icon }) => {
  return (
    <PopupState variant="popover" popupId="demo-popup-menu">
      {(popupState) => (
        <span
          className="inline-block text-white px-3"
          style={{ width: "auto" }}>
          <Tab
            // {...bindToggle(popupState)}
            {...bindHover(popupState)}
            label={
              <Hidden mdDown>
              {title}
              </Hidden>
            }
            component={Link}
            to={root}
            icon={icon}
            iconPosition="start"
            value={value}
          />
          <HoverMenu
            {...bindMenu(popupState)}
            anchorOrigin={{
              vertical: "bottom",
              horizontal: "center",
            }}
            transformOrigin={{
              vertical: "top",
              horizontal: "center",
            }}
            sx={{
              "& .MuiMenu-list": {
                padding: 0,
              },
              "& .MuiMenuItem-root:hover": {
                backgroundColor: "rgb(30 27 75)",
                color: "rgb(203 213 225)",
                transition: "backgroundColor 0.3s ease",
              },
              mt: -1,
            }}>
            {items.map((item, index) => (
              <MenuItem
                onClick={item.onClick ? item.onClick : popupState.close}
                key={index}
                sx={{
                  margin: 0,
                  padding: 0,
                  backgroundColor: "rgb(49 46 129)",
                  color: "white",
                }}

                // sx={{
                //   p: 0,
                //   m: 0,
                //   width: "100%",
                //   display: "flex",
                //   alignItems: "center",
                // }}
              >
                <Tab label={item.label} component={Link} to={item.route} />
                {/* 
                    <div>hola</div> */}
              </MenuItem>
            ))}
          </HoverMenu>
        </span>
      )}
    </PopupState>
  );
};
