import React from 'react';
import { gql } from 'apollo-boost';
import { useQuery } from 'react-apollo';
// import { Card, Elevation } from "@blueprintjs/core";
import Card from '@material-ui/core/Card';
// import CardActions from "@material-ui/core/CardActions";
import CardContent from '@material-ui/core/CardContent';
import Typography from '@material-ui/core/Typography';
import { makeStyles, createStyles, Theme } from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';
import Avatar from '@material-ui/core/Avatar';
import { lightGreen, lightBlue, deepOrange, red } from '@material-ui/core/colors';
import { Link } from 'react-router-dom';
import CardActions from '@material-ui/core/CardActions';
import Button from '@material-ui/core/Button';
import { getSchools, getSchoolsVariables } from '../graphql/getSchools';

const getSchoolsQuery = gql`
  query getSchools($online: Boolean) {
    getSchools(online: $online) {
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
      width: theme.spacing(14),
      height: theme.spacing(8),
      color: theme.palette.getContrastText(lightGreen[500]),
      backgroundColor: lightGreen[500],
      fontSize: 32,
      marginLeft: 'auto',
      marginRight: 'auto',
    },
    lightGreen: {
      color: theme.palette.getContrastText(lightGreen[500]),
      backgroundColor: lightGreen[500],
    },
    blue: {
      color: theme.palette.getContrastText(lightBlue[500]),
      backgroundColor: lightBlue[500],
    },
    orange: {
      color: theme.palette.getContrastText(deepOrange[500]),
      backgroundColor: deepOrange[500],
    },
    lightOrange: {
      color: theme.palette.getContrastText(deepOrange[200]),
      backgroundColor: deepOrange[200],
    },
    red: {
      color: theme.palette.getContrastText(red[500]),
      backgroundColor: red[500],
    },
    description: {
      marginTop: 12,
    },
  }),
);

// get generated types from server to use in client

export function SchoolList({ online, allowEdit }: { online: boolean; allowEdit: boolean }) {
  const { loading, error, data } = useQuery<getSchools, getSchoolsVariables>(getSchoolsQuery, {
    variables: { online: online },
  });
  const classes = useStyles();

  function calculateAvatarColor(date: Date): string {
    const timeDifference = date.getTime() - new Date().getTime();
    const dateDifference = timeDifference / (1000 * 3600 * 24);
    if (dateDifference < 0) {
      return classes.red;
    }
    if (dateDifference * 4 < 400) {
      return classes.orange;
    }
    return classes.lightGreen;
  }

  if (loading) {
    return <div>Schools Loading</div>;
  }
  if (error) return <span>Error! ${error.message}</span>;

  return (
    <Grid container className={classes.root} spacing={1}>
      <Grid item xs={12}>
        <Grid container justify="center" spacing={1}>
          {data?.getSchools &&
            data.getSchools.map((school) => (
              <Grid key={school.id} item>
                <Card className={classes.card}>
                  <CardContent>
                    <Avatar className={`${classes.avatar} ${calculateAvatarColor(new Date(school.startDate))}`}>
                      {school.acronym}
                    </Avatar>
                    <Typography variant="h4" align="center" gutterBottom>
                      {school.name}
                    </Typography>
                    <Typography variant="subtitle1" align="center">
                      {new Date(school.startDate).toLocaleDateString()} -
                      {' ' + new Date(school.endDate).toLocaleDateString()}
                    </Typography>
                    <div className={classes.description}>
                      <Typography variant="body2" color="textSecondary" component="p">
                        {school.description}
                      </Typography>
                    </div>
                  </CardContent>
                  <CardActions>
                    <Button component={Link} to={'/school/' + school.id + '/apply'} size="small" color="primary">
                      Apply
                    </Button>
                    {allowEdit && (
                      <Button component={Link} to={'/admin/school/' + school.id + '/edit'} size="small" color="primary">
                        Edit
                      </Button>
                    )}
                  </CardActions>
                </Card>
              </Grid>
            ))}
        </Grid>
      </Grid>
    </Grid>
  );
}

SchoolList.defaultProps = {
  online: true,
  allowEdit: false,
};
