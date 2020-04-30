import React, { useState } from 'react';
import './App.css';
import { SchoolList } from './components/SchoolList';
//use create client
import ApolloClient from 'apollo-boost';
//use create provider
import { ApolloProvider } from 'react-apollo';
import Navigation from './components/Navigation';
import { BrowserRouter as Router, Route, Switch, Redirect } from 'react-router-dom';
import { createMuiTheme, ThemeProvider } from '@material-ui/core/styles';
import { blueGrey } from '@material-ui/core/colors';
import { grey } from '@material-ui/core/colors';
import Login from './components/Login';
import Register from './components/Register';
import { createBrowserHistory } from 'history';
import { Profile } from './components/Profile';
import { User } from './types/User';
import { Application } from './components/Application';
// import CssBaseline from '@material-ui/core/CssBaseline';
import { Admin } from './components/Admin';

//Accessing the address for graphql queries
const client = new ApolloClient({
  uri: '/graphql',
  request: (operation) => {
    const storageUser = localStorage.getItem('user');
    const storedUser: User = storageUser === null ? undefined : JSON.parse(storageUser);
    if (storedUser) {
      operation.setContext({
        headers: {
          token: storedUser.token,
        },
      });
    }
  },
  onError: ({ graphQLErrors, operation, forward }) => {
    if (graphQLErrors) {
      for (const err of graphQLErrors) {
        // handle errors differently based on its error code
        switch (err.extensions?.code) {
          case 'UNAUTHENTICATED':
            // old token has expired throwing AuthenticationError,
            // one way to handle is to obtain a new token and
            // add it to the operation context
            const headers = operation.getContext().headers;
            operation.setContext({
              headers: {
                ...headers,
                //getNewToken(),
              },
            });
            localStorage.removeItem('user');
            // Now, pass the modified operation to the next link
            // in the chain. This effectively intercepts the old
            // failed request, and retries it with a new token
            return forward(operation);

          // handle other errors
          case 'ANOTHER_ERROR_CODE':
            break;
          // ...
          default:
            return forward(operation);
        }
      }
    }
    return forward(operation);
  },
});

function logout() {
  client.resetStore();
}

const browserHistory = createBrowserHistory();

const theme = createMuiTheme({
  palette: {
    primary: blueGrey,
    secondary: grey,
  },
});

function App() {
  const storageUser = localStorage.getItem('user');
  const storedUser: User = storageUser === null ? undefined : JSON.parse(storageUser);
  const [user, setUser] = useState<User | undefined>(storedUser);

  return (
    <ThemeProvider theme={theme}>
      <Router>
        <ApolloProvider client={client}>
          <Navigation user={user} setUser={setUser} resetStore={logout} />
          <Switch>
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
            <Route path="/profile" exact>
              <Profile user={user} />
            </Route>
            <Route path="/school/:id/apply">
              <Application user={user} />
            </Route>
            <Route path="/admin" exact>
              <Admin user={user} setUser={setUser} />
            </Route>
          </Switch>
        </ApolloProvider>
      </Router>
    </ThemeProvider>
  );
}

export default App;
