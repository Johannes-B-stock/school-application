import React, { useState, Dispatch } from "react";
import Avatar from "@material-ui/core/Avatar";
import Button from "@material-ui/core/Button";
import CssBaseline from "@material-ui/core/CssBaseline";
import TextField from "@material-ui/core/TextField";
import { Link } from "react-router-dom";
import Box from "@material-ui/core/Box";
import LockOutlinedIcon from "@material-ui/icons/LockOutlined";
import Typography from "@material-ui/core/Typography";
import { makeStyles } from "@material-ui/core/styles";
import Container from "@material-ui/core/Container";
import { gql } from "apollo-boost";
import { useMutation } from "react-apollo";
import { History } from "history";
import { User } from "../types/User";
import { registerUserVariables, registerUser } from "../graphql/registerUser";
import MuiAlert from "@material-ui/lab/Alert";

function Copyright() {
  return (
    <Typography variant="body2" color="textSecondary" align="center">
      {"Copyright © "}
      <Link color="inherit" to="https://material-ui.com/">
        Your Website
      </Link>{" "}
      {new Date().getFullYear()}
      {"."}
    </Typography>
  );
}

const useStyles = makeStyles((theme) => ({
  paper: {
    marginTop: theme.spacing(8),
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
  },
  avatar: {
    margin: theme.spacing(1),
    backgroundColor: theme.palette.secondary.main,
  },
  form: {
    width: "100%", // Fix IE 11 issue.
    marginTop: theme.spacing(1),
  },
  submit: {
    margin: theme.spacing(3, 0, 2),
  },
}));

const registerMutation = gql`
  mutation registerUser($input: InputRegisterUser!) {
    registerUser(input: $input) {
      id
      token
      firstName
      role
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
}) {
  if (user) {
    history.goBack();
  }
  const classes = useStyles();
  const [error, setError] = useState<string | undefined>(undefined);

  const [email, setEmail] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [password, setPassword] = useState("");

  function validateForm() {
    return email.length > 0 && password.length > 0 && email.includes("@");
  }

  const [registerUser] = useMutation<registerUser, registerUserVariables>(
    registerMutation
  );

  async function handleSubmit(event: React.FormEvent) {
    event.preventDefault();
    setError(undefined);
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
        setError(user.errors.join(","));
      }
      if (user?.data === undefined) {
        setError("No User data arrived from server.");
      } else {
        const newUser: User = {
          ...user.data.registerUser,
        };
        localStorage.setItem("user", JSON.stringify(newUser));
        setUser(newUser);
      }
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
      <CssBaseline />
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
            onChange={(e) => setFirstName(e.target.value)}
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
            onChange={(e) => setLastName(e.target.value)}
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
