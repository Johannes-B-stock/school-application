import React, { useState, Dispatch } from 'react';
import Avatar from '@material-ui/core/Avatar';
import Button from '@material-ui/core/Button';
import CssBaseline from '@material-ui/core/CssBaseline';
import TextField from '@material-ui/core/TextField';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Checkbox from '@material-ui/core/Checkbox';
import { Link } from 'react-router-dom';
import Grid from '@material-ui/core/Grid';
import Box from '@material-ui/core/Box';
import LockOutlinedIcon from '@material-ui/icons/LockOutlined';
import Typography from '@material-ui/core/Typography';
import { makeStyles } from '@material-ui/core/styles';
import Container from '@material-ui/core/Container';
import gql from 'graphql-tag';
import { useMutation } from 'react-apollo';
import { History } from 'history';
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { loginUser, loginUserVariables } from '../graphql/loginUser';
import MuiAlert from '@material-ui/lab/Alert';
import { User } from '../types/User';

function Copyright() {
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
  alert: {
    marginTop: theme.spacing(2),
  },
}));

const loginMutation = gql`
  mutation loginUser($input: InputLogin!) {
    loginUser(input: $input) {
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

export default function Login({
  user,
  setUser,
  history,
}: {
  user: User | undefined;
  setUser: Dispatch<React.SetStateAction<User | undefined>>;
  history: History<History.PoorMansUnknown>;
}) {
  if (user) {
    history.goBack();
  }
  const classes = useStyles();
  const [error, setError] = useState<string | undefined>(undefined);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  function validateForm() {
    return email.length > 0 && password.length > 0;
  }

  const [loginUser] = useMutation<loginUser, loginUserVariables>(loginMutation);

  async function handleSubmit(event: React.FormEvent) {
    event.preventDefault();
    try {
      const user = await loginUser({
        variables: { input: { email: email, password: password } },
      });
      if (user.errors) {
        setError(user.errors.join(','));
      }
      if (!user?.data?.loginUser || user?.data?.loginUser === null) {
        setError('no user data arrived from server.');
      } else {
        const newUser: User = {
          ...user.data.loginUser.user,
          token: user.data.loginUser.token,
        };
        localStorage.setItem('token', newUser.token);
        setUser(newUser);
      }
    } catch (e) {
      setError(e.toString());
    }
  }

  return (
    <Container component="main" maxWidth="xs">
      {error && (
        <MuiAlert className={classes.alert} elevation={6} variant="filled" severity="warning">
          {error}
        </MuiAlert>
      )}
      <CssBaseline />
      <div className={classes.paper}>
        <Avatar className={classes.avatar}>
          <LockOutlinedIcon />
        </Avatar>
        <Typography component="h1" variant="h5">
          Sign in
        </Typography>
        <form className={classes.form} noValidate onSubmit={handleSubmit}>
          <TextField
            variant="outlined"
            margin="normal"
            required
            fullWidth
            id="email"
            label="Email Address"
            name="email"
            autoComplete="email"
            autoFocus
            value={email}
            onChange={(e) => setEmail(e.target.value)}
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
            onChange={(e) => setPassword(e.target.value)}
          />
          <FormControlLabel control={<Checkbox value="remember" color="primary" />} label="Remember me" />
          <Button
            type="submit"
            fullWidth
            variant="contained"
            color="primary"
            className={classes.submit}
            disabled={!validateForm()}
          >
            Sign In
          </Button>
          <Grid container>
            <Grid item xs>
              <Link to="#">Forgot password?</Link>
            </Grid>
            <Grid item>
              <Link to="/register">{"Don't have an account? Sign Up"}</Link>
            </Grid>
          </Grid>
        </form>
      </div>
      <Box mt={8}>
        <Copyright />
      </Box>
    </Container>
  );
}
