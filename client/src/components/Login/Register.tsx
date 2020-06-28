/* eslint-disable @typescript-eslint/camelcase */
import React, { useState, Dispatch } from 'react';
import Avatar from '@material-ui/core/Avatar';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import { Link } from 'react-router-dom';
import Box from '@material-ui/core/Box';
import LockOutlinedIcon from '@material-ui/icons/LockOutlined';
import Typography from '@material-ui/core/Typography';
import { makeStyles } from '@material-ui/core/styles';
import Container from '@material-ui/core/Container';
import gql from 'graphql-tag';
import { useMutation } from 'react-apollo';
import { History } from 'history';
import { User } from '../../types/User';
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { registerUserVariables, registerUser } from './graphql/registerUser';
import MuiAlert from '@material-ui/lab/Alert';

function Copyright(): React.ReactElement {
  return (
    <Typography variant="body2" color="textSecondary" align="center">
      {'Copyright © '}
      <Link color="inherit" to="https://material-ui.com/">
        Your Website
      </Link>{' '}
      {new Date().getFullYear()}
      {'.'}
    </Typography>
  );
}

const useStyles = makeStyles((theme) => ({
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

const registerMutation = gql`
  mutation registerUser($input: InputRegisterUser!) {
    registerUser(input: $input) {
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

export default function Register({
  user,
  setUser,
  history,
}: {
  user: User | undefined;
  setUser: Dispatch<React.SetStateAction<User | undefined>>;
  history: History<History.PoorMansUnknown>;
}): React.ReactElement {
  if (user) {
    history.goBack();
  }
  const classes = useStyles();
  const [error, setError] = useState<string | undefined>(undefined);

  const [email, setEmail] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [password, setPassword] = useState('');

  function validateForm(): boolean {
    return email.length > 0 && password.length > 0 && email.includes('@');
  }

  const [registerUser] = useMutation<registerUser, registerUserVariables>(registerMutation);

  async function handleSubmit(event: React.FormEvent): Promise<void> {
    event.preventDefault();
    try {
      const user = await registerUser({
        variables: {
          input: {
            email: email,
            password: password,
            firstName: firstName,
            lastName: lastName,
          },
        },
      });
      if (user.errors) {
        setError(user.errors.join(','));
        return;
      }
      if (!user?.data?.registerUser || user?.data?.registerUser === null) {
        setError('No User data arrived from server.');
        return;
      }
      const newUser: User = {
        ...user.data.registerUser.user,
        token: user.data.registerUser.token,
      };
      localStorage.setItem('token', JSON.stringify(newUser.token));
      setUser(newUser);
      setError(undefined);
    } catch (e) {
      setError(e.toString());
    }
  }

  return (
    <Container component="main" maxWidth="xs">
      {error && (
        <MuiAlert elevation={6} variant="filled" severity="warning">
          {error}
        </MuiAlert>
      )}
      <div className={classes.paper}>
        <Avatar className={classes.avatar}>
          <LockOutlinedIcon />
        </Avatar>
        <Typography component="h1" variant="h5">
          Sign up
        </Typography>
        <form className={classes.form} noValidate onSubmit={handleSubmit}>
          <TextField
            variant="outlined"
            margin="normal"
            required
            fullWidth
            id="firstName"
            label="First Name"
            name="firstName"
            autoComplete="firstName"
            autoFocus
            value={firstName}
            onChange={(e): void => setFirstName(e.target.value)}
          />
          <TextField
            variant="outlined"
            margin="normal"
            required
            fullWidth
            id="lastName"
            label="Last Name"
            name="lastName"
            autoComplete="lastName"
            value={lastName}
            onChange={(e): void => setLastName(e.target.value)}
          />
          <TextField
            variant="outlined"
            margin="normal"
            required
            fullWidth
            id="email"
            label="Email Address"
            name="email"
            autoComplete="email"
            value={email}
            onChange={(e): void => setEmail(e.target.value)}
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
            autoComplete="current-password"
            value={password}
            onChange={(e): void => setPassword(e.target.value)}
          />
          <Button
            type="submit"
            fullWidth
            variant="contained"
            color="primary"
            className={classes.submit}
            disabled={!validateForm()}
          >
            Register
          </Button>
        </form>
      </div>
      <Box mt={8}>
        <Copyright />
      </Box>
    </Container>
  );
}
