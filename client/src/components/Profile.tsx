import React from 'react';
import { gql } from 'apollo-boost';
import Container from '@material-ui/core/Container';
import CssBaseline from '@material-ui/core/CssBaseline';
import TextField from '@material-ui/core/TextField';
import { createStyles, makeStyles, Theme } from '@material-ui/core/styles';
import { useQuery } from 'react-apollo';
import MuiAlert from '@material-ui/lab/Alert';
import { Redirect } from 'react-router-dom';
import CircularProgress from '@material-ui/core/CircularProgress';
import { getUser } from '../graphql/getUser';
import { User } from '../types/User';
import Typography from '@material-ui/core/Typography';

const userQuery = gql`
  query getUser {
    getUser {
      id
      firstName
      lastName
      fullName
      role
    }
  }
`;

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      marginTop: theme.spacing(8),
      display: 'flex',
      flexDirection: 'column',
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
  }),
);

export function Profile({ user }: { user: User | undefined }) {
  const classes = useStyles();

  const { loading, error, data } = useQuery<getUser>(userQuery);

  if (!user) {
    return <Redirect to="/login"></Redirect>;
  }
  if (data?.getUser?.id !== user?.id && user?.role !== 'ADMIN') {
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
          <div>
            <Typography variant="h4" gutterBottom>
              Hello {user?.firstName}!
            </Typography>
            <Typography variant="body1" gutterBottom>
              This is your profile page. Here you can edit your information.
            </Typography>
            <TextField
              label="First Name"
              id="margin-none"
              defaultValue={data?.getUser?.firstName}
              className={classes.textField}
            />
            <TextField
              label="Last Name"
              id="margin-none"
              defaultValue={data?.getUser?.lastName}
              className={classes.textField}
            />
            <TextField
              label="Full Name"
              id="margin-none"
              defaultValue={data?.getUser?.fullName}
              className={classes.textField}
            />
          </div>
        )}
        <CssBaseline />
      </div>
    </Container>
  );
}
