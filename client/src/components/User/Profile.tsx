import React from 'react';
import gql from 'graphql-tag';
import Container from '@material-ui/core/Container';
import CssBaseline from '@material-ui/core/CssBaseline';
import TextField from '@material-ui/core/TextField';
import { createStyles, makeStyles, Theme } from '@material-ui/core/styles';
import { useQuery } from 'react-apollo';
import MuiAlert from '@material-ui/lab/Alert';
import { Redirect, Link } from 'react-router-dom';
import CircularProgress from '@material-ui/core/CircularProgress';
import { User } from '../../types/User';
import Typography from '@material-ui/core/Typography';
import { Avatar, Button } from '@material-ui/core';
import IconButton from '@material-ui/core/IconButton';
import config from '../../config';
import { AvatarUpload } from './AvatarUpload';
import { getUserForProfile } from './graphql/getUserForProfile';

const userQuery = gql`
  query getUserForProfile {
    getUser {
      id
      firstName
      lastName
      fullName
      avatarFileName
      gender
      birthday
      email
    }
  }
`;

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      marginTop: theme.spacing(8),
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'center',
      alignItems: 'center',
    },
    textField: {
      marginLeft: theme.spacing(1),
      marginRight: theme.spacing(1),
      marginTop: theme.spacing(3),
      width: '25ch',
    },
    errorMessage: {
      marginTop: theme.spacing(10),
      marginLeft: theme.spacing(1),
      marginRight: theme.spacing(1),
    },
    alert: {
      margin: theme.spacing(2),
    },
    large: {
      width: theme.spacing(20),
      height: theme.spacing(20),
      fontSize: '15px',
    },
    imageContainer: {
      '&:hover $overlay': {
        opacity: '0.5',
      },
      margin: 'auto',
    },
    grid: {
      display: 'grid',
    },
    autoMargin: {
      margin: 'auto',
    },
    overlay: {
      position: 'absolute',
      top: 0,
      bottom: 0,
      left: 0,
      right: 0,
      height: '100%',
      width: '100%',
      opacity: 0,
      transition: '.3s ease',
      backgroundColor: 'white',
    },
    editButton: {
      margin: theme.spacing(3, 0, 2),
    },
  }),
);

export function Profile({ user }: { user: User | undefined }) {
  const classes = useStyles();
  const [open, setOpen] = React.useState(false);
  const { loading, error, data } = useQuery<getUserForProfile>(userQuery);
  const [image, setImage] = React.useState(data?.getUser?.avatarFileName ?? '');

  const handleClickOpen = () => {
    setOpen(true);
  };

  if (image.length === 0 && data?.getUser?.avatarFileName) {
    setImage(data?.getUser?.avatarFileName);
  }

  if (!user) {
    return <Redirect to="/login"></Redirect>;
  }

  if (data && data.getUser && data.getUser.id !== user?.id && user?.role !== 'ADMIN') {
    return (
      <Container component="main" maxWidth="md">
        <MuiAlert className={classes.alert} elevation={6} variant="filled" severity="warning">
          You don&apos;t have the rights to see this profile. (id:{user?.id})
        </MuiAlert>
      </Container>
    );
  }
  return (
    <Container component="main" maxWidth="md">
      <div className={classes.root}>
        {error && (
          <MuiAlert className={classes.alert} elevation={6} variant="filled" severity="error">
            {error.message}
          </MuiAlert>
        )}
        {loading ? (
          <CircularProgress />
        ) : (
          <div className={classes.grid}>
            <IconButton className={classes.imageContainer} onClick={handleClickOpen}>
              <Avatar src={config.IMAGE_URL + image} className={classes.large} />
            </IconButton>
            <AvatarUpload open={open} setOpen={setOpen} image={image} setImage={setImage} />
            <br />
            <Typography variant="h4" gutterBottom className={classes.autoMargin}>
              Hello {user?.firstName}!
            </Typography>
            <br />
            <br />
            <Typography variant="body1" gutterBottom>
              This is your profile page. Here you can edit your information.
            </Typography>
            <TextField
              label="First Name"
              id="firstName"
              disabled
              defaultValue={data?.getUser?.firstName}
              className={classes.textField}
            />
            <TextField
              label="Last Name"
              id="lastName"
              disabled
              defaultValue={data?.getUser?.lastName}
              className={classes.textField}
            />
            <TextField
              label="Full Name"
              id="fullName"
              disabled
              defaultValue={data?.getUser?.fullName}
              className={classes.textField}
            />

            <TextField
              label="Birthday"
              id="birthday"
              disabled
              defaultValue={new Date(data?.getUser?.birthday).toLocaleDateString()}
              className={classes.textField}
            />

            <Button
              component={Link}
              to={'/profile/edit'}
              variant="contained"
              color="primary"
              className={classes.editButton}
            >
              Edit
            </Button>
          </div>
        )}
        <CssBaseline />
      </div>
    </Container>
  );
}
