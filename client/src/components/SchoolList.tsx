import React, { Component } from "react";
import { gql } from "apollo-boost";
import { graphql } from "react-apollo";

const getSchoolsQuery = gql`
  {
    getSchools {
      name
      summary
      id
    }
  }
`;

class SchoolList extends Component {
  getSchools() {
    var datas = this.props.data;

    if (datas.loading) {
      return <div>Schools Loading</div>;
    } else {
      return datas.getSchools.map(school => {
        return <li key={school.id}>{school.name}</li>;
      });
    }
  }

  render() {
    return (
      <div>
        {/* graphql query result school list  */}
        <ul>{this.getSchools()}</ul>
      </div>
    );
  }
}

export default graphql(getSchoolsQuery)(SchoolList);
