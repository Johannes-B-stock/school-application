import { User } from '../types/User';
import Container from '@material-ui/core/Container';
import MuiAlert from '@material-ui/lab/Alert';
import React, { useState } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { gql } from 'apollo-boost';
import { useQuery } from 'react-apollo';
import { hasAdmin } from '../graphql/hasAdmin';
import { CreateSchool } from './CreateSchool';

const useStyles = makeStyles((theme) => ({
  alert: {
    marginTop: theme.spacing(2),
  },
}));

const hasAdminQuery = gql`
  query hasAdmin {
    hasAdmin
  }
`;

export function Admin({ user }: { user: User | undefined }) {
  const classes = useStyles();
  const [errors, setErrors] = useState<string[]>([]);

  if (user?.role !== 'ADMIN') {
    setErrors((err) => [...err, 'Only Admins can see the admin section.']);
  }

  const { error, data } = useQuery<hasAdmin>(hasAdminQuery);
  if (!user) {
    if (error) {
      setErrors((err) => [...err, 'GraphQL Error: ' + error.message]);
    }
    if (data?.hasAdmin) {
      setErrors((err) => [...err, 'You have created already an admin. Please use this admin to create new admins.']);
    }
  }
  return (
    <Container component="main" maxWidth="md">
      {errors.length > 0 ? (
        errors.map((err, index) => (
          <MuiAlert key={index} className={classes.alert} elevation={6} variant="filled" severity="error">
            {err}
          </MuiAlert>
        ))
      ) : (
        <div>
          Here comes the Admin page...
          <br />
          <CreateSchool user={user} />
        </div>
      )}
    </Container>
  );
}
