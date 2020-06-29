import React, { useState } from 'react';
import gql from 'graphql-tag';
import Container from '@material-ui/core/Container';
import CssBaseline from '@material-ui/core/CssBaseline';
import TextField from '@material-ui/core/TextField';
import { createStyles, makeStyles, Theme } from '@material-ui/core/styles';
import { useQuery, useMutation } from 'react-apollo';
import MuiAlert from '@material-ui/lab/Alert';
import DateFnsUtils from '@date-io/date-fns';
import { Redirect } from 'react-router-dom';
import CircularProgress from '@material-ui/core/CircularProgress';
import { User } from '../../types/User';
import { Button } from '@material-ui/core';
import { InputUpdateUser } from '../../types/globalTypes';
import { getUserForEdit } from './graphql/getUserForEdit';
import { MuiPickersUtilsProvider, KeyboardDatePicker } from '@material-ui/pickers';
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { updateUserVariables, updateUser } from './graphql/updateUser';
import { ApolloError } from 'apollo-client';

const editUserMutation = gql`
  mutation updateUser($input: InputUpdateUser!) {
    updateUser(input: $input) {
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

const userQuery = gql`
  query getUserForEdit {
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
    submit: {
      margin: theme.spacing(3, 0, 2),
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
  }),
);

export function EditProfile({ user }: { user: User | undefined }) {
  const classes = useStyles();
  const [updateSuccessful, setUpdateSuccessful] = useState<boolean>(false);
  const [error, setError] = useState<string | undefined>();
  const { loading, data } = useQuery<getUserForEdit>(userQuery);
  const [updateUser, { loading: mutationLoading, error: mutationError }] = useMutation<updateUser, updateUserVariables>(
    editUserMutation,
  );

  const [userUpdate, setUserUpdate] = useState<InputUpdateUser>({} as InputUpdateUser);

  if (data?.getUser && !userUpdate.id) {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { avatarFileName, __typename, email, ...cleanUser } = { ...data.getUser };
    setUserUpdate(cleanUser);
  }

  function setInput(event: React.ChangeEvent<HTMLInputElement>): void {
    setUserUpdate({
      ...userUpdate,
      [event.target.id]: event.target.value,
    });
  }
  function setDateInput(property: string, value: Date | null): void {
    setUserUpdate((user) => {
      user[property] = value === null ? null : new Date(value);
      return { ...user };
    });
  }

  async function handleSubmit(event: React.FormEvent): Promise<void> {
    event.preventDefault();
    // setError(undefined);
    try {
      const { data, errors } = await updateUser({
        variables: {
          input: userUpdate,
        },
      });

      if (data?.updateUser) {
        console.log(data.updateUser);
        setUserUpdate(data.updateUser);
        setUpdateSuccessful(true);
      }
      if (errors) {
        setError(errors.map((err) => err.message).join(';'));
      }
    } catch (e) {
      console.log(e);
      if (e instanceof ApolloError) {
        const graphQlErrors = e.graphQLErrors;
        setError(graphQlErrors.map((ge) => ge.message).join(';'));
        setError(e.message);
      } else {
        setError(e.message);
      }
    }
  }

  if (!user) {
    return <Redirect to="/login"></Redirect>;
  }

  if (data?.getUser && data.getUser.id !== user?.id && user?.role !== 'ADMIN') {
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
            {error}
          </MuiAlert>
        )}
        {mutationError && (
          <MuiAlert className={classes.alert} elevation={6} variant="filled" severity="error">
            {mutationError.message}
          </MuiAlert>
        )}
        {updateSuccessful && (
          <MuiAlert
            key={userUpdate.id ?? 1000} // ToDo: remove the integer when id is not null anymore
            className={classes.alert}
            elevation={6}
            variant="filled"
            severity="success"
          >
            User was successfully updated.
          </MuiAlert>
        )}
        {loading ? (
          <CircularProgress />
        ) : (
          <form noValidate onSubmit={handleSubmit}>
            {mutationLoading && <CircularProgress />}

            <div className={classes.grid}>
              <TextField
                label="First Name"
                id="firstName"
                value={userUpdate?.firstName ?? ''}
                onChange={setInput}
                className={classes.textField}
              />
              <TextField
                label="Last Name"
                id="lastName"
                value={userUpdate?.lastName ?? ''}
                onChange={setInput}
                className={classes.textField}
              />
              <TextField
                label="Full Name"
                id="fullName"
                value={userUpdate?.fullName ?? ''}
                onChange={setInput}
                className={classes.textField}
              />

              <MuiPickersUtilsProvider utils={DateFnsUtils}>
                <KeyboardDatePicker
                  disableToolbar
                  variant="inline"
                  format="dd/MM/yyyy"
                  margin="normal"
                  id="birthday"
                  label="Birthday"
                  value={userUpdate.birthday}
                  onChange={(date: Date | null): void => setDateInput('birthday', date)}
                  KeyboardButtonProps={{
                    'aria-label': 'change date',
                  }}
                />
              </MuiPickersUtilsProvider>
              <Button type="submit" variant="contained" color="primary" className={classes.submit}>
                Update
              </Button>
            </div>
          </form>
        )}
        <CssBaseline />
      </div>
    </Container>
  );
}
