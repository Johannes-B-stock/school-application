import * as React from 'react';
import { AppBar, Toolbar, IconButton, Typography, Button } from '@material-ui/core';
import MenuItem from '@material-ui/core/MenuItem';
import Menu from '@material-ui/core/Menu';
import AccountCircle from '@material-ui/icons/AccountCircle';
import MenuIcon from '@material-ui/icons/Menu';
import { createStyles, makeStyles, Theme } from '@material-ui/core/styles';
import { useState } from 'react';
import { Link } from 'react-router-dom';
import clsx from 'clsx';
import { User } from '../types/User';
import NavDrawer from './NavDrawer';

const drawerWidth = 240;

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    appBar: {
      zIndex: theme.zIndex.drawer + 1,
      transition: theme.transitions.create(['width', 'margin'], {
        easing: theme.transitions.easing.sharp,
        duration: theme.transitions.duration.leavingScreen,
      }),
    },
    appBarShift: {
      marginLeft: drawerWidth,
      width: `calc(100% - ${drawerWidth}px)`,
      transition: theme.transitions.create(['width', 'margin'], {
        easing: theme.transitions.easing.sharp,
        duration: theme.transitions.duration.enteringScreen,
      }),
    },
    root: {
      flexGrow: 1,
    },
    menuButton: {
      marginRight: theme.spacing(2),
    },
    title: {
      flexGrow: 1,
    },
    link: {
      margin: theme.spacing(1, 1.5),
    },
    hide: {
      display: 'none',
    },
  }),
);

export default function Navigation({
  user,
  setUser,
  resetStore,
}: {
  user: User | undefined;
  setUser: React.Dispatch<React.SetStateAction<User | undefined>>;
  resetStore: () => void;
}): React.ReactElement {
  // const location = useLocation();
  const classes = useStyles();
  const loggedIn = user !== undefined;
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);
  const [openDrawer, setOpenDrawer] = useState<boolean>(false);

  const handleMenu = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleDrawerOpen = () => {
    setOpenDrawer(true);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  function logout() {
    handleClose();
    localStorage.removeItem('user');
    setUser(undefined);
    resetStore();
  }

  return (
    <div className={classes.root}>
      <AppBar
        position="fixed"
        color="primary"
        className={clsx(classes.appBar, {
          [classes.appBarShift]: openDrawer,
        })}
      >
        <Toolbar>
          <IconButton
            edge="start"
            color="inherit"
            aria-label="menu"
            onClick={handleDrawerOpen}
            className={clsx(classes.menuButton, {
              [classes.hide]: openDrawer,
            })}
          >
            <MenuIcon />
          </IconButton>
          <Typography variant="h6" className={classes.title}>
            School Application
          </Typography>
          <nav>
            <Button component={Link} to="/home" color="inherit" className={classes.link}>
              Home
            </Button>
            {user && user?.role === 'ADMIN' && (
              <Button component={Link} color="inherit" to="/admin" className={classes.link}>
                Admin
              </Button>
            )}
          </nav>

          {loggedIn ? (
            <div>
              <IconButton
                aria-label="account of current user"
                aria-controls="menu-appbar"
                aria-haspopup="true"
                onClick={handleMenu}
                color="inherit"
              >
                <AccountCircle />
              </IconButton>
              <Menu
                id="menu-appbar"
                anchorEl={anchorEl}
                anchorOrigin={{
                  vertical: 'top',
                  horizontal: 'right',
                }}
                keepMounted
                transformOrigin={{
                  vertical: 'top',
                  horizontal: 'right',
                }}
                open={open}
                onClose={handleClose}
              >
                <MenuItem component={Link} to="/profile" onClick={handleClose}>
                  Profile
                </MenuItem>
                <MenuItem onClick={handleClose}>My account</MenuItem>
                <MenuItem onClick={logout}>Logout</MenuItem>
              </Menu>
            </div>
          ) : (
            <span>
              <Button component={Link} color="inherit" to="/login">
                Login
              </Button>
              <Button component={Link} color="inherit" to="/register">
                Signup
              </Button>
            </span>
          )}
        </Toolbar>
      </AppBar>
      <NavDrawer drawerOpen={openDrawer} setDrawerOpen={setOpenDrawer} />
    </div>
  );
}

// <Navbar>
//       <Navbar.Group align={Alignment.LEFT}>
//         <Navbar.Heading>School Application</Navbar.Heading>
//         <Navbar.Divider />
//         <AnchorButton
//           href="/home"
//           className="bp3-minimal"
//           icon="home"
//           text="Home"
//         />
//         <AnchorButton
//           href="/schools"
//           className="bp3-minimal"
//           icon="document"
//           text="Schools"
//         />
//       </Navbar.Group>
//     </Navbar>
