import React from "react";
import "./App.css";
import StudentList from "./components/StudentList";
import SchoolList from "./components/SchoolList";
//use create client
import ApolloClient from "apollo-boost";
//use create provider
import { ApolloProvider } from "react-apollo";

//Accessing the address for graphql queries
const client = new ApolloClient({
  uri: "http://localhost:3000/graphql",
});

function App() {
  return (
    <ApolloProvider client={client}>
      <div className="App">
        <header className="App-header">
          <p>this is the main page</p>
        </header>
        <div className="App-Body">
          <SchoolList />
        </div>
      </div>
    </ApolloProvider>
  );
}

export default App;
