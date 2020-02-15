import React, { Component } from "react";
import { gql } from "apollo-boost";
import { graphql } from "react-apollo";

const getSchoolDetails = gql``;

class SchoolDetails extends Component {
  getSchoolDetails(schoolId) {
    var datas = this.props.datas;
    if (datas.loading) {
      return <div>Is loading</div>;
    } else {
    }
  }
}
