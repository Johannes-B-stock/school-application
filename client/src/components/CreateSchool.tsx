/* eslint-disable @typescript-eslint/no-explicit-any */
import { User } from '../types/User';
import Container from '@material-ui/core/Container';
import MuiAlert from '@material-ui/lab/Alert';
import React, { useState, FunctionComponent } from 'react';
import { gql } from 'apollo-boost';
import Button from '@material-ui/core/Button';
import { useMutation } from 'react-apollo';
import { Typography, TextField, Grid, makeStyles } from '@material-ui/core';
import { createSchoolVariables, createSchool, createSchool_createSchool as School } from '../graphql/createSchool';
import { InputCreateSchool } from '../types/globalTypes';
import NumberFormat from 'react-number-format';
// import 'date-fns';
import DateFnsUtils from '@date-io/date-fns';
import { MuiPickersUtilsProvider, KeyboardDatePicker } from '@material-ui/pickers';
import MenuItem from '@material-ui/core/MenuItem';
import InputAdornment from '@material-ui/core/InputAdornment';

const currencies = [
  {
    value: 'USD',
    label: '$',
  },
  {
    value: 'EUR',
    label: '€',
  },
  {
    value: 'GBP',
    label: '£',
  },
  {
    value: 'JPY',
    label: '¥',
  },
];

const useStyles = makeStyles((theme) => ({
  alert: {
    marginTop: theme.spacing(2),
  },
  form: {
    width: '100%', // Fix IE 11 issue.
    marginTop: theme.spacing(1),
  },
  formSection: {
    marginTop: theme.spacing(2),
  },
  submit: {
    margin: theme.spacing(3, 0, 2),
  },
  textField: {
    marginLeft: theme.spacing(1),
    marginRight: theme.spacing(1),
    marginTop: theme.spacing(1),
    marginBottom: theme.spacing(1),
    width: '100%',
  },
  halfTextField: {
    marginLeft: theme.spacing(1),
    marginRight: theme.spacing(1),
    marginTop: theme.spacing(3),
    width: '30%',
  },

  shortTextField: {
    marginLeft: theme.spacing(1),
    marginRight: theme.spacing(1),
    marginTop: theme.spacing(3),
    width: '20%',
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

// const getQuestionCollectionQuery = gql`
//   query getCollections {
//     getApplicationQuestionCollections {
//       id
//       name
//       description
//       type
//       questions {
//         id
//         question
//       }
//     }
//   }
// `;

// const createCollection = gql`
//   mutation createCollection($input: InputCreateApplicationQuestionCollection) {
//     createApplicationQuestionCollection(input: $input) {
//       id
//       name
//       description
//       type
//       questions {
//         id
//         question
//       }
//     }
//   }
// `;

interface NumberFormatCustomProps {
  inputRef: (instance: NumberFormat | null) => void;
  onChange: (event: { target: { name: string; value: string } }) => void;
  name: string;
}

const NumberFormatCustom: FunctionComponent<NumberFormatCustomProps> = (props: NumberFormatCustomProps) => {
  const { inputRef, onChange, ...other } = props;

  return (
    <NumberFormat
      {...other}
      getInputRef={inputRef}
      onValueChange={(values) => {
        onChange({
          target: {
            name: props.name,
            value: values.value,
          },
        });
      }}
      thousandSeparator="."
      decimalSeparator=","
      isNumericString
      prefix=""
    />
  );
};

function defaultSchoolInput(): InputCreateSchool {
  return {
    startDate: new Date(),
    endDate: new Date(),
    outreachEndDate: new Date(),
    outreachStartDate: new Date(),
    miniOutreachEndDate: new Date(),
    miniOutreachStartDate: new Date(),
    currency: 'EUR',
  } as InputCreateSchool;
}

export function CreateSchool({ user }: { user: User | undefined }) {
  const classes = useStyles();
  const [errors, setErrors] = useState<string[]>([]);
  const [createdSchool, setCreatedSchool] = useState<School | undefined>();
  const [schoolInput, setSchoolInput] = useState<InputCreateSchool>(defaultSchoolInput());
  const [newSchoolMutation] = useMutation<createSchool, createSchoolVariables>(createSchoolMutation);

  function setInput(event: React.ChangeEvent<HTMLInputElement>): void {
    setSchoolInput({
      ...schoolInput,
      [event.target.name]: event.target.value,
    });
  }

  function setNumberInput(event: React.ChangeEvent<HTMLInputElement>): void {
    setSchoolInput({
      ...schoolInput,
      [event.target.name]: Number(event.target.value),
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
        setErrors((e) => [...e, ...newSchool.errors!.map((err) => 'test' + err.originalError?.message ?? err.message)]); //'some Error']);
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
      <Typography component="h4" variant="h5">
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
          onChange={setInput}
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
          onChange={setInput}
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
          onChange={setInput}
        />
        <Typography component="h4" className={classes.formSection}>
          School Dates:
        </Typography>
        <MuiPickersUtilsProvider utils={DateFnsUtils}>
          <Grid container justify="space-around">
            <KeyboardDatePicker
              disableToolbar
              variant="inline"
              format="dd/MM/yyyy"
              name="startDate"
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
              name="endDate"
              label="School end date"
              value={schoolInput.endDate}
              onChange={(date: Date | null): void => setDateInput('endDate', date)}
              KeyboardButtonProps={{
                'aria-label': 'change date',
              }}
            />
          </Grid>

          <Typography component="h4" className={classes.formSection}>
            Outreach Dates:
          </Typography>
          <Grid container justify="space-around">
            <KeyboardDatePicker
              disableToolbar
              variant="inline"
              format="dd/MM/yyyy"
              margin="normal"
              id="outreach-start-date"
              label="Outreach start date"
              name="outreachStartDate"
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
              name="outreachEndDate"
              value={schoolInput.outreachEndDate}
              onChange={(date: Date | null): void => setDateInput('outreachEndDate', date)}
              KeyboardButtonProps={{
                'aria-label': 'change date',
              }}
            />
          </Grid>

          <Typography component="h4" className={classes.formSection}>
            Mini Outreach Dates:
          </Typography>
          <Grid container justify="space-around">
            <KeyboardDatePicker
              disableToolbar
              variant="inline"
              format="dd/MM/yyyy"
              margin="normal"
              id="miniOutreachStartDate"
              label="Mini Outreach start date"
              name="miniOutreachStartDate"
              value={schoolInput.miniOutreachStartDate}
              onChange={(date: Date | null): void => setDateInput('miniOutreachStartDate', date)}
              KeyboardButtonProps={{
                'aria-label': 'change date',
              }}
            />

            <KeyboardDatePicker
              disableToolbar
              variant="inline"
              format="dd/MM/yyyy"
              margin="normal"
              id="miniOutreachEndDate"
              label="Mini Outreach end date"
              name="miniOutreachEndDate"
              value={schoolInput.miniOutreachEndDate}
              onChange={(date: Date | null): void => setDateInput('miniOutreachEndDate', date)}
              KeyboardButtonProps={{
                'aria-label': 'change date',
              }}
            />
          </Grid>
        </MuiPickersUtilsProvider>
        <Typography component="h4" className={classes.formSection}>
          Fees:
        </Typography>

        <TextField
          id="currency"
          select
          label="Currency"
          name="currency"
          className={classes.shortTextField}
          value={schoolInput.currency}
          onChange={setInput}
          helperText="Please select your currency"
        >
          {currencies.map((option) => (
            <MenuItem key={option.value} value={option.value}>
              {option.label}
            </MenuItem>
          ))}
        </TextField>
        <Grid container justify="space-around">
          <TextField
            key="applicationFee"
            id="applicationFee"
            label="Application Fee"
            name="applicationFee"
            className={classes.shortTextField}
            value={schoolInput.applicationFee}
            onChange={setNumberInput}
            InputProps={{
              inputComponent: NumberFormatCustom as any,
              startAdornment: (
                <InputAdornment position="start">
                  {currencies.find((c) => c.value === schoolInput.currency)?.label ?? ''}
                </InputAdornment>
              ),
            }}
          />
          <TextField
            key="schoolFee"
            variant="standard"
            required
            id="schoolFee"
            label="School Fee"
            name="schoolFee"
            className={classes.shortTextField}
            value={schoolInput.schoolFee}
            onChange={setNumberInput}
            InputProps={{
              inputComponent: NumberFormatCustom as any,
              startAdornment: (
                <InputAdornment position="start">
                  {currencies.find((c) => c.value === schoolInput.currency)?.label ?? ''}
                </InputAdornment>
              ),
            }}
          />

          <TextField
            key="miniOutreachFee"
            variant="standard"
            required
            id="miniOutreachFee"
            label="Mini Outreach Fee"
            name="miniOutreachFee"
            className={classes.shortTextField}
            value={schoolInput.miniOutreachFee}
            onChange={setNumberInput}
            InputProps={{
              inputComponent: NumberFormatCustom as any,
              startAdornment: (
                <InputAdornment position="start">
                  {currencies.find((c) => c.value === schoolInput.currency)?.label ?? ''}
                </InputAdornment>
              ),
            }}
          />
          <TextField
            key="outreachFee"
            variant="standard"
            required
            id="outreachFee"
            label="Outreach Fee"
            name="outreachFee"
            className={classes.shortTextField}
            value={schoolInput.outreachFee}
            onChange={setNumberInput}
            InputProps={{
              inputComponent: NumberFormatCustom as any,
              startAdornment: (
                <InputAdornment position="start">
                  {currencies.find((c) => c.value === schoolInput.currency)?.label ?? ''}
                </InputAdornment>
              ),
            }}
          />
        </Grid>

        <Button type="submit" variant="contained" color="primary" className={classes.submit}>
          Create
        </Button>
      </form>
    </Container>
  );
}
