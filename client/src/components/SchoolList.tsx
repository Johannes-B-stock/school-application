import React from 'react';
import gql from 'graphql-tag';
import { useQuery } from 'react-apollo';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import Typography from '@material-ui/core/Typography';
import { makeStyles, createStyles, Theme } from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';
import Avatar from '@material-ui/core/Avatar';
import Divider from '@material-ui/core/Divider';
import { lightGreen, lightBlue, deepOrange, red } from '@material-ui/core/colors';
import { Link } from 'react-router-dom';
import CardActions from '@material-ui/core/CardActions';
import Button from '@material-ui/core/Button';
import { getSchools, getSchoolsVariables } from '../graphql/getSchools';
import { CircularProgress } from '@material-ui/core';

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
      transition: '0.3s',
      boxShadow: '0 6px 30px -12px rgba(0,0,0,0.3)',
      '&:hover': {
        boxShadow: '0 12px 62px -12.125px rgba(0,0,0,0.3)',
      },
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
    content: {
      textAlign: 'left',
      padding: theme.spacing(3),
      paddingBottom: '0',
    },
    actions: {
      padding: theme.spacing(3),
      paddingBottom: theme.spacing(2),
    },
    divider: {
      marginTop: `${theme.spacing(3)}px`,
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
    return (
      <Grid container justify="center" className={classes.root}>
        <CircularProgress />
      </Grid>
    );
  }
  if (error) return <span>Error! ${error.message}</span>;

  return (
    <Grid container justify="center" className={classes.root}>
      {data?.getSchools &&
        data.getSchools.map((school) => (
          <Grid key={school.id} item>
            <Card className={classes.card}>
              <CardContent className={classes.content}>
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
                  <Typography variant="caption" color="textSecondary">
                    {school.description}
                  </Typography>
                </div>

                <Divider className={classes.divider} light />
              </CardContent>
              <CardActions className={classes.actions}>
                <Button component={Link} to={'/school/' + school.id + '/apply'} color="secondary">
                  Apply
                </Button>
                {allowEdit && (
                  <Button component={Link} to={'/admin/school/' + school.id + '/edit'} color="secondary">
                    Edit
                  </Button>
                )}
              </CardActions>
            </Card>
          </Grid>
        ))}
    </Grid>
  );
}

SchoolList.defaultProps = {
  online: true,
  allowEdit: false,
};
