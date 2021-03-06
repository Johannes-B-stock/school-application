import * as React from 'react';
import { IconButton, useMediaQuery } from '@material-ui/core';
import { Link, useLocation } from 'react-router-dom';
import Drawer from '@material-ui/core/Drawer';
import ChevronLeftIcon from '@material-ui/icons/ChevronLeft';
import ChevronRightIcon from '@material-ui/icons/ChevronRight';
import { createStyles, makeStyles, useTheme, Theme } from '@material-ui/core/styles';
import clsx from 'clsx';
import List from '@material-ui/core/List';
import Divider from '@material-ui/core/Divider';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import Icon from '@material-ui/core/Icon';

interface DrawerNav {
  route: string;
  items: DrawerItem[];
}

interface DrawerItem {
  icon: string;
  path: string;
  label: string;
}

const drawerItems: DrawerNav[] = [
  {
    route: '/profile',
    items: [
      {
        icon: 'home',
        path: '/profile',
        label: 'Overview',
      },
      {
        icon: 'contacts',
        path: '/profile/contact',
        label: 'Contact Information',
      },
      {
        icon: 'description',
        path: '/profile/applications',
        label: 'My Applications',
      },
      {
        icon: 'schools',
        path: '/profile/schools',
        label: 'My Schools',
      },
    ],
  },
  {
    route: '/admin',
    items: [
      {
        icon: 'home',
        path: '/admin',
        label: 'Overview',
      },
      {
        icon: 'schools',
        path: '/admin/schools',
        label: 'Schools',
      },
      {
        icon: 'description',
        path: '/admin/applications',
        label: 'Applications',
      },
    ],
  },
];

const drawerWidth = 240;

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      display: 'flex',
    },
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
    drawer: {
      width: drawerWidth,
      flexShrink: 0,
      whiteSpace: 'nowrap',
    },
    drawerOpen: {
      width: drawerWidth,
      transition: theme.transitions.create('width', {
        easing: theme.transitions.easing.sharp,
        duration: theme.transitions.duration.enteringScreen,
      }),
    },
    drawerClose: {
      transition: theme.transitions.create('width', {
        easing: theme.transitions.easing.sharp,
        duration: theme.transitions.duration.leavingScreen,
      }),
      overflowX: 'hidden',
      width: theme.spacing(6) + 1,
      [theme.breakpoints.up('sm')]: {
        width: theme.spacing(7) + 1,
      },
    },
    toolbar: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'flex-end',
      padding: theme.spacing(0, 1),
      // necessary for content to be below app bar
      ...theme.mixins.toolbar,
    },
    content: {
      flexGrow: 1,
      padding: theme.spacing(3),
    },
  }),
);

export default function NavDrawer({
  drawerOpen,
  setDrawerOpen,
}: {
  drawerOpen: boolean;
  setDrawerOpen: React.Dispatch<React.SetStateAction<boolean>>;
}): React.ReactElement {
  const location = useLocation();
  const classes = useStyles();
  const theme = useTheme();
  const smallScreen = useMediaQuery(theme.breakpoints.down('sm'));
  const currentMenu = drawerItems.find((i) => location.pathname.startsWith(i.route));

  function handleDrawerClose() {
    setDrawerOpen(false);
  }
  if (!currentMenu && !smallScreen) {
    return <span></span>;
  }

  return (
    <Drawer
      variant="permanent"
      className={clsx(classes.drawer, {
        [classes.drawerOpen]: drawerOpen,
        [classes.drawerClose]: !drawerOpen,
      })}
      classes={{
        paper: clsx({
          [classes.drawerOpen]: drawerOpen,
          [classes.drawerClose]: !drawerOpen,
        }),
      }}
    >
      <div className={classes.toolbar}>
        <IconButton onClick={handleDrawerClose}>
          {theme.direction === 'rtl' ? <ChevronRightIcon /> : <ChevronLeftIcon />}
        </IconButton>
      </div>
      <Divider />
      {smallScreen && (
        <span>
          <List component="nav" onMouseEnter={() => setDrawerOpen(true)} onMouseLeave={() => setDrawerOpen(false)}>
            <ListItem component={Link} to="/home" selected={'/home' === location.pathname} button key="home">
              <ListItemIcon>
                <Icon>home</Icon>
              </ListItemIcon>
              <ListItemText primary="Home" />
            </ListItem>
            <ListItem component={Link} to="/admin" selected={'/admin' === location.pathname} button key="admin">
              <ListItemIcon>
                <Icon>supervisor_account_icon</Icon>
              </ListItemIcon>
              <ListItemText primary="Admin" />
            </ListItem>
          </List>
          <Divider />
        </span>
      )}
      {currentMenu && (
        <List component="nav" onMouseEnter={() => setDrawerOpen(true)} onMouseLeave={() => setDrawerOpen(false)}>
          {currentMenu.items.map((item) => (
            <ListItem
              component={Link}
              to={item.path}
              selected={item.path === location.pathname}
              button
              key={item.label}
            >
              <ListItemIcon>
                <Icon>{item.icon}</Icon>
              </ListItemIcon>
              <ListItemText primary={item.label} />
            </ListItem>
          ))}
        </List>
      )}
    </Drawer>
  );
}
