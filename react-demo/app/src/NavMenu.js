import React from 'react';

import AppBar from '@material-ui/core/AppBar';
import Drawer from '@material-ui/core/Drawer';
import MenuItem from '@material-ui/core/MenuItem';
import Link from '@material-ui/core/Link';
import Toolbar from '@material-ui/core/Toolbar';
import IconButton from '@material-ui/core/IconButton';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';

// Icons
import MenuIcon from '@material-ui/icons/Menu';

function NavMenu() {
  const [mobileView, setMobileView] = React.useState(false);

  const handleWindowResize = React.useCallback(() => {
    if (window.innerWidth < 900) {
      setMobileView(true);
    } else {
      setMobileView(false);
    }
  }, []);

  React.useEffect(() => {
    handleWindowResize(); // set view at app open
    window.addEventListener("resize", handleWindowResize);
  }, [handleWindowResize]);

  return (
    <AppBar position="static">
      { mobileView ? <DisplayMobile /> : displayDesktop() }
    </AppBar>
  );
}

const DisplayMobile = () => {
  const [drawerOpen, setDrawerOpen] = React.useState(false);

  return (
    <Toolbar>
      <IconButton edge="start" onClick={() => { setDrawerOpen(true); }}>
        <MenuIcon />
      </IconButton>
      <Drawer
      {...{
        anchor: "top",
        open: drawerOpen,
        onClose: () => setDrawerOpen(false),
      }}
      >
        <div>{getDrawerChoices()}</div>
      </Drawer>
      <Typography variant="h6">
        HackerNews Stories
      </Typography>
      <Button color="inherit">Login</Button>
    </Toolbar>
  );
};

const getDrawerChoices = () => {
  const headersData = [{ label: "google", href: "https://www.google.com" },
    { label: "facebook", href: "https://www.facebook.com" }];
  return headersData.map(({ label, href }) => {
    return (
      <Link
      {...{
        target: "_blank",
        rel: "noreferrer",
        href: href,
        color: "inherit",
        style: { textDecoration: "none" },
        key: label,
      }}
      >
      <MenuItem>{label}</MenuItem>
      </Link>
    );
  });
};

const displayDesktop = () => (
    <Toolbar>
      <Typography variant="h6">
        HackerNews Stories
      </Typography>
    </Toolbar>
);

export default NavMenu;
