import React, { useState } from 'react';
import './App.css';
import { SchoolList } from './components/SchoolList';
import { ApolloProvider } from 'react-apollo';
import Navigation from './components/Navigation';
import { BrowserRouter as Router, Route, Switch, Redirect } from 'react-router-dom';
import { createMuiTheme, ThemeProvider, makeStyles, createStyles, Theme } from '@material-ui/core/styles';
import { grey, blueGrey } from '@material-ui/core/colors';
import Login from './components/Login';
import Register from './components/Register';
import { createBrowserHistory } from 'history';
import { Profile } from './components/Profile';
import { User } from './types/User';
import { Application } from './components/Application';
// import CssBaseline from '@material-ui/core/CssBaseline';
import { Admin } from './components/Admin';
import { EditSchool } from './components/EditSchool';
import { CreateSchool } from './components/CreateSchool';
import { AdminSchoolOverview } from './components/AdminSchoolOverview';
import { CreateQuestionCollection } from './components/CreateQuestionCollection';
import { getStoredUser } from './auth';
import { ApolloClient } from 'apollo-client';
import { createApolloClient } from './ApolloClient';

function logout(client: ApolloClient<unknown>) {
  client.resetStore();
}

const browserHistory = createBrowserHistory();

const theme = createMuiTheme({
  palette: {
    primary: grey,
    secondary: blueGrey,
  },
});

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      marginTop: theme.spacing(10),
    },
    rootWithDrawer: {
      marginLeft: theme.spacing(7),
    },
  }),
);

function App() {
  const classes = useStyles();
  const storedUser: User | undefined = getStoredUser();
  const client = createApolloClient();

  const [user, setUser] = useState<User | undefined>(storedUser);
  return (
    <ThemeProvider theme={theme}>
      <link rel="stylesheet" href="https://fonts.googleapis.com/icon?family=Material+Icons" />
      <Router>
        <ApolloProvider client={client}>
          <Navigation user={user} setUser={setUser} resetStore={() => logout(client)} />
          <Switch>
            <React.Fragment>
              <div className={classes.root}>
                <Redirect exact={true} from="/" to="/home"></Redirect>
                <Route exact={true} path="/home">
                  <SchoolList />
                </Route>
                <Route exact={true} path="/schools">
                  <SchoolList />
                </Route>
                <Route path="/login" exact>
                  <Login user={user} setUser={setUser} history={browserHistory} />
                </Route>
                <Route path="/register" exact>
                  <Register user={user} setUser={setUser} history={browserHistory} />
                </Route>
                <div className={classes.rootWithDrawer}>
                  <Route path="/profile" exact>
                    <Profile user={user} />
                  </Route>
                  <Route path="/admin/schools" exact>
                    <AdminSchoolOverview user={user} />
                  </Route>
                  <Route path="/admin/school/:id/edit">
                    <EditSchool user={user} />
                  </Route>
                  <Route path="/admin/school/create">
                    <CreateSchool user={user} />
                  </Route>
                  <Route path="/admin/question-collection/create">
                    <CreateQuestionCollection user={user} />
                  </Route>
                  <Route path="/school/:id/apply">
                    <Application user={user} />
                  </Route>
                  <Route path="/admin" exact>
                    <Admin user={user} setUser={setUser} />
                  </Route>
                </div>
              </div>
            </React.Fragment>
          </Switch>
        </ApolloProvider>
      </Router>
    </ThemeProvider>
  );
}

export default App;
