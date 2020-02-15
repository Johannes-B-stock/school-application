import React, { Component } from "react";
import { gql } from "apollo-boost";
import { graphql, DataProps } from "react-apollo";

//book list query
const getStudentsQuery = gql`
  {
    students {
      name
      age
      id
    }
  }
`;

class StudentList extends Component<DataProps> {
  getStudents() {
    var datas = this.props.data;

    if (datas.loading) {
      return <div>Students loading</div>;
    } else {
      console.log(datas);
      return datas.students.map(student => {
        return <li key={student.id}>{student.name}</li>;
      });
    }
  }
  render() {
    console.log(this.props);
    return (
      <div>
        {/* graphql query result book list  */}
        <ul id="student-list">{this.getStudents()}</ul>
      </div>
    );
  }
}
export default graphql(getStudentsQuery)(StudentList);
