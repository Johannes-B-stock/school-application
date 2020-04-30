import { User } from '../types/User';
import MuiAlert from '@material-ui/lab/Alert';
import React, { Dispatch } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { gql } from 'apollo-boost';
import { useQuery } from 'react-apollo';
import { hasAdmin } from '../graphql/hasAdmin';
import { CreateSchool } from './CreateSchool';
import { Container, Typography } from '@material-ui/core';
import { CreateAdmin } from './CreateAdmin';

const useStyles = makeStyles((theme) => ({
  alert: {
    marginTop: theme.spacing(2),
  },
  submit: {
    margin: theme.spacing(3, 0, 2),
  },
  root: {
    marginTop: theme.spacing(8),
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
  },
}));

const hasAdminQuery = gql`
  query hasAdmin {
    hasAdmin
  }
`;

export function Admin({
  user,
  setUser,
}: {
  user: User | undefined;
  setUser: Dispatch<React.SetStateAction<User | undefined>>;
}) {
  const classes = useStyles();
  const errors: string[] = [];

  const { error, data } = useQuery<hasAdmin>(hasAdminQuery);
  const needsAdmin = !(data?.hasAdmin ?? true);

  if (user?.role !== 'ADMIN') {
    errors.push('Only Admins can see the admin section.');
  }
  if (!user) {
    if (error && error.graphQLErrors) {
      errors.push('GraphQL Error: ' + error.message);
      errors.push(...error.graphQLErrors!.map((e) => e.originalError!.message));
    }
    if (!needsAdmin) {
      errors.push('You have created already an admin. Please use this admin to create new admins.');
    }
  }

  if (!user && needsAdmin) {
    return (
      <Container component="main" maxWidth="md">
        <Typography component="h5" variant="h6" className={classes.root} gutterBottom>
          Since there is no admin account created yet you need to create a new admin account.
        </Typography>
        <CreateAdmin setUser={setUser} />
      </Container>
    );
  }
  return (
    <Container component="main" maxWidth="md">
      <div className={classes.root}>
        {errors && errors.length > 0 ? (
          errors.map((err, index) => (
            <MuiAlert key={index} className={classes.alert} elevation={6} variant="filled" severity="error">
              {err}
            </MuiAlert>
          ))
        ) : (
          <CreateSchool user={user} />
        )}
      </div>
    </Container>
  );
}
