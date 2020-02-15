import React from "react";
import { gql } from "apollo-boost";
import { useQuery } from "react-apollo";
// import { Card, Elevation } from "@blueprintjs/core";
import Card from "@material-ui/core/Card";
// import CardActions from "@material-ui/core/CardActions";
import CardContent from "@material-ui/core/CardContent";
import Typography from "@material-ui/core/Typography";
import { makeStyles, createStyles, Theme } from "@material-ui/core/styles";
import Grid from "@material-ui/core/Grid";
import Avatar from "@material-ui/core/Avatar";
import { lightGreen, lightBlue } from "@material-ui/core/colors";
import { Link } from "react-router-dom";
import CardActions from "@material-ui/core/CardActions";
import Button from "@material-ui/core/Button";

const getSchoolsQuery = gql`
  query getSchools {
    getSchools {
      id
      name
      description
      startDate
      endDate
      acronym
      schoolEmail
      outreachStartDate
      outreachEndDate
    }
  }
`;

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    card: {
      minWidth: 375,
      maxWidth: 450,
      margin: 30,
      boxShadow: theme.shadows[3],
    },
    root: {
      flexGrow: 1,
    },
    avatar: {
      width: theme.spacing(10),
      height: theme.spacing(10),
      color: theme.palette.getContrastText(lightGreen[500]),
      backgroundColor: lightGreen[500],
      fontSize: 32,
      marginLeft: "auto",
      marginRight: "auto",
    },
    lightGreen: {
      color: theme.palette.getContrastText(lightGreen[500]),
      backgroundColor: lightGreen[500],
    },
    blue: {
      color: theme.palette.getContrastText(lightBlue[500]),
      backgroundColor: lightBlue[500],
    },
    description: {
      marginTop: 12,
    },
  })
);

// get generated types from server to use in client

export function SchoolList() {
  const { loading, error, data } = useQuery(getSchoolsQuery);
  const classes = useStyles();

  if (loading) {
    return <div>Schools Loading</div>;
  }
  if (error) return <span>Error! ${error.message}</span>;

  return (
    <Grid container className={classes.root} spacing={1}>
      <Grid item xs={12}>
        <Grid container justify="center" spacing={1}>
          {data.getSchools.map(
            (school: {
              id: number;
              name: string;
              acronym: string;
              description: string;
              startDate: string;
              endDate: string;
            }) => (
              // <Card interactive={true} elevation={Elevation.TWO}>
              <Grid key={school.id} item>
                <Card className={classes.card}>
                  <CardContent>
                    <Avatar
                      className={`${classes.avatar} ${
                        school.acronym === "dts"
                          ? classes.lightGreen
                          : classes.blue
                      }`}
                    >
                      {school.acronym}
                    </Avatar>
                    <Typography variant="h4" align="center" gutterBottom>
                      {school.name}
                    </Typography>
                    <Typography variant="subtitle1" align="center">
                      {new Date(school.startDate).toLocaleDateString()} -
                      {" " + new Date(school.endDate).toLocaleDateString()}
                    </Typography>
                    <div className={classes.description}>
                      <Typography
                        variant="body2"
                        color="textSecondary"
                        component="p"
                      >
                        {school.description}
                      </Typography>
                    </div>
                  </CardContent>
                  <CardActions>
                    <Button
                      component={Link}
                      to={"/school/" + school.id + "/apply"}
                      size="small"
                      color="primary"
                    >
                      Apply
                    </Button>
                  </CardActions>
                </Card>
              </Grid>
            )
          )}
        </Grid>
      </Grid>
    </Grid>
  );
}
