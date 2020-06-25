import { User } from '../types/User';
import MuiAlert from '@material-ui/lab/Alert';
import React, { useState, Dispatch } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import gql from 'graphql-tag';
import { useMutation } from 'react-apollo';
import LockOutlinedIcon from '@material-ui/icons/LockOutlined';
import { Typography, TextField, Button, Avatar, Container } from '@material-ui/core';
import { createAdminMutation } from '../graphql/createAdminMutation';
import { registerUserVariables } from '../graphql/registerUser';
import { InputRegisterUser } from '../types/globalTypes';

const useStyles = makeStyles((theme) => ({
  alert: {
    marginTop: theme.spacing(2),
  },
  paper: {
    marginTop: theme.spacing(8),
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
  },
  avatar: {
    margin: theme.spacing(1),
    backgroundColor: theme.palette.secondary.main,
  },
  form: {
    width: '100%', // Fix IE 11 issue.
    marginTop: theme.spacing(1),
  },
  submit: {
    margin: theme.spacing(3, 0, 2),
  },
}));

const createAdminGql = gql`
  mutation createAdminMutation($input: InputRegisterUser!) {
    createAdmin(input: $input) {
      user {
        id
        firstName
        role
        avatarFileName
      }
      token
    }
  }
`;

export function CreateAdmin({ setUser }: { setUser: Dispatch<React.SetStateAction<User | undefined>> }) {
  const classes = useStyles();
  const [errors, setErrors] = useState<string[]>([]);
  const [registerVariables, setRegisterVariables] = useState<InputRegisterUser>({} as InputRegisterUser);

  function validateForm(): boolean {
    return (
      registerVariables?.email?.length > 0 &&
      registerVariables?.password?.length > 0 &&
      registerVariables?.email?.includes('@')
    );
  }

  function setInput(event: React.ChangeEvent<HTMLInputElement>): void {
    setRegisterVariables({
      ...registerVariables,
      [event.target.name]: event.target.value,
    });
  }

  const [createAdmin] = useMutation<createAdminMutation, registerUserVariables>(createAdminGql);

  async function handleSubmit(event: React.FormEvent): Promise<void> {
    event.preventDefault();
    setErrors([]);
    try {
      const admin = await createAdmin({
        variables: {
          input: {
            email: registerVariables.email,
            password: registerVariables.password,
            firstName: registerVariables.firstName,
            lastName: registerVariables.lastName,
          },
        },
      });
      if (admin.errors) {
        setErrors((e) => [...e, ...admin.errors!.map((graphError) => graphError.message)]);
        return;
      }
      if (!admin?.data?.createAdmin || admin?.data?.createAdmin === null) {
        setErrors((e) => [...e, 'No User data arrived from server.']);
        return;
      }
      const newUser: User = {
        ...admin.data.createAdmin.user,
        token: admin.data.createAdmin.token,
      };
      localStorage.setItem('token', admin.data.createAdmin.token);
      setUser(newUser);
    } catch (e) {
      setErrors((err) => [...err, e.toString()]);
    }
  }

  return (
    <Container component="main" maxWidth="md">
      {errors &&
        errors.length > 0 &&
        errors.map((err, index) => (
          <MuiAlert key={index} className={classes.alert} elevation={6} variant="filled" severity="error">
            {err}
          </MuiAlert>
        ))}
      <div className={classes.paper}>
        <Avatar className={classes.avatar}>
          <LockOutlinedIcon />
        </Avatar>
        <Typography component="h1" variant="h5">
          Create Admin
        </Typography>
        <form className={classes.form} noValidate onSubmit={handleSubmit}>
          <TextField
            variant="outlined"
            margin="normal"
            required
            fullWidth
            id="firstName"
            label="First name"
            name="firstName"
            autoComplete="admin"
            autoFocus
            value={registerVariables.firstName}
            onChange={setInput}
          />
          <TextField
            variant="outlined"
            margin="normal"
            required
            fullWidth
            id="lastName"
            label="Last name"
            name="lastName"
            autoComplete="admin"
            autoFocus
            value={registerVariables.lastName}
            onChange={setInput}
          />
          <TextField
            variant="outlined"
            margin="normal"
            required
            fullWidth
            id="email"
            label="Email Address"
            name="email"
            value={registerVariables.email}
            onChange={setInput}
          />
          <TextField
            variant="outlined"
            margin="normal"
            required
            fullWidth
            name="password"
            label="Password"
            type="password"
            id="password"
            value={registerVariables.password}
            onChange={setInput}
          />
          <Button
            type="submit"
            fullWidth
            variant="contained"
            color="primary"
            className={classes.submit}
            disabled={!validateForm()}
          >
            Create Admin
          </Button>
        </form>
      </div>
    </Container>
  );
}
