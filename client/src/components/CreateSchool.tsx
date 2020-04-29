import { User } from '../types/User';
import Container from '@material-ui/core/Container';
import MuiAlert from '@material-ui/lab/Alert';
import React, { useState } from 'react';
import { gql } from 'apollo-boost';
import Button from '@material-ui/core/Button';
import { useMutation } from 'react-apollo';
import { Typography, TextField, Grid, makeStyles } from '@material-ui/core';
import { createSchoolVariables, createSchool, createSchool_createSchool as School } from '../graphql/createSchool';
import { InputCreateSchool } from '../types/globalTypes';
// import 'date-fns';
import DateFnsUtils from '@date-io/date-fns';
import { MuiPickersUtilsProvider, KeyboardDatePicker } from '@material-ui/pickers';

const useStyles = makeStyles((theme) => ({
  alert: {
    marginTop: theme.spacing(2),
  },
  form: {
    width: '100%', // Fix IE 11 issue.
    marginTop: theme.spacing(1),
  },
  submit: {
    margin: theme.spacing(3, 0, 2),
  },
  textField: {
    marginLeft: theme.spacing(1),
    marginRight: theme.spacing(1),
    marginTop: theme.spacing(3),
    width: '100%',
  },
  halfTextField: {
    marginLeft: theme.spacing(1),
    marginRight: theme.spacing(1),
    marginTop: theme.spacing(3),
    width: '30%',
  },
}));

const createSchoolMutation = gql`
  mutation createSchool($input: InputCreateSchool!) {
    createSchool(input: $input) {
      id
      acronym
      name
      description
      startDate
      endDate
    }
  }
`;

function defaultSchoolInput(): InputCreateSchool {
  return {
    startDate: new Date(),
    endDate: new Date(),
    outreachEndDate: new Date(),
    outreachStartDate: new Date(),
    miniOutreachEndDate: new Date(),
    miniOutreachStartDate: new Date(),
  } as InputCreateSchool;
}

export function CreateSchool({ user }: { user: User | undefined }) {
  const classes = useStyles();
  const [errors, setErrors] = useState<string[]>([]);
  const [createdSchool, setCreatedSchool] = useState<School | undefined>();
  const [schoolInput, setSchoolInput] = useState<InputCreateSchool>(defaultSchoolInput());
  const [newSchoolMutation] = useMutation<createSchool, createSchoolVariables>(createSchoolMutation);

  function setInput(property: string, value: string | null): void {
    setSchoolInput((school) => {
      school[property] = value;
      return { ...school };
    });
  }

  function setDateInput(property: string, value: Date | null): void {
    setSchoolInput((school) => {
      school[property] = value === null ? null : new Date(value);
      return { ...school };
    });
  }

  async function handleSubmit(event: React.FormEvent): Promise<void> {
    event.preventDefault();
    try {
      const newSchool = await newSchoolMutation({
        variables: {
          input: schoolInput,
        },
      });

      if (newSchool && newSchool.errors && newSchool.errors.length > 0) {
        setErrors((e) => [...e, ...newSchool.errors!.map((err) => err.message)]); //'some Error']);
      }
      if (!newSchool?.data?.createSchool || newSchool?.data?.createSchool === null) {
        setErrors((e) => [...e, 'No school data arrived back from server. Creation might have been cancelled.']);
      }
      setCreatedSchool(newSchool.data?.createSchool ?? undefined);
      setErrors([]);
    } catch (e) {
      setErrors((err) => [...err, e.toString() + ': ' + e.message]);
    }
  }

  if (user?.role !== 'ADMIN' && user?.role !== 'SCHOOLADMIN') {
    setErrors((err) => [...err, 'Only School Admins can create schools.']);
    return (
      <Container component="main" maxWidth="md">
        {errors.length > 0 &&
          errors.map((err, index) => (
            <MuiAlert key={index} className={classes.alert} elevation={6} variant="filled" severity="error">
              {err}
            </MuiAlert>
          ))}
      </Container>
    );
  }
  return (
    <Container component="main" maxWidth="md">
      {createdSchool && (
        <MuiAlert
          key={createdSchool.id ?? 1000} // ToDo: remove the integer when id is not null anymore
          className={classes.alert}
          elevation={6}
          variant="filled"
          severity="success"
        >
          School {createdSchool.name} ({createdSchool.acronym}), starting at {createdSchool.startDate} was created.
        </MuiAlert>
      )}
      {errors.length > 0 &&
        errors.map((err, index) => (
          <MuiAlert key={index} className={classes.alert} elevation={6} variant="filled" severity="error">
            {err}
          </MuiAlert>
        ))}
      <Typography component="h1" variant="h5">
        Create a new School
      </Typography>
      <form className={classes.form} noValidate onSubmit={handleSubmit}>
        <TextField
          key="name"
          variant="outlined"
          required
          id="name"
          label="Name of the school"
          name="name"
          autoFocus
          className={classes.halfTextField}
          value={schoolInput.name}
          onChange={(e): void => setInput('name', e.target.value)}
        />
        <TextField
          key="acronym"
          variant="outlined"
          required
          id="acronym"
          label="Acronym of the school"
          name="acronym"
          className={classes.halfTextField}
          value={schoolInput.acronym}
          onChange={(e): void => setInput('acronym', e.target.value)}
        />
        <TextField
          key="description"
          variant="outlined"
          required
          multiline
          fullWidth
          id="description"
          label="Description of the school"
          name="description"
          className={classes.textField}
          value={schoolInput.description}
          onChange={(e): void => setInput('description', e.target.value)}
        />
        Dates:
        <MuiPickersUtilsProvider utils={DateFnsUtils}>
          <Grid container justify="space-around">
            <KeyboardDatePicker
              disableToolbar
              variant="inline"
              format="dd/MM/yyyy"
              margin="normal"
              id="start-date"
              label="School start date"
              value={schoolInput.startDate}
              onChange={(date: Date | null): void => setDateInput('startDate', date)}
              KeyboardButtonProps={{
                'aria-label': 'change date',
              }}
            />
            <KeyboardDatePicker
              disableToolbar
              variant="inline"
              format="dd/MM/yyyy"
              margin="normal"
              id="end-date"
              label="School end date"
              value={schoolInput.endDate}
              onChange={(date: Date | null): void => setDateInput('endDate', date)}
              KeyboardButtonProps={{
                'aria-label': 'change date',
              }}
            />
            <KeyboardDatePicker
              disableToolbar
              variant="inline"
              format="dd/MM/yyyy"
              margin="normal"
              id="outreach-start-date"
              label="Outreach start date"
              value={schoolInput.outreachStartDate}
              onChange={(date: Date | null): void => setDateInput('outreachStartDate', date)}
              KeyboardButtonProps={{
                'aria-label': 'change date',
              }}
            />

            <KeyboardDatePicker
              disableToolbar
              variant="inline"
              format="dd/MM/yyyy"
              margin="normal"
              id="outreach-end-date"
              label="Outreach end date"
              value={schoolInput.outreachEndDate}
              onChange={(date: Date | null): void => setDateInput('outreachEndDate', date)}
              KeyboardButtonProps={{
                'aria-label': 'change date',
              }}
            />
          </Grid>
        </MuiPickersUtilsProvider>
        <Button type="submit" variant="contained" color="primary" className={classes.submit}>
          Create
        </Button>
      </form>
    </Container>
  );
}
