/* eslint-disable @typescript-eslint/no-explicit-any */
import { User } from '../../types/User';
import Container from '@material-ui/core/Container';
import MuiAlert from '@material-ui/lab/Alert';
import React, { useState, FunctionComponent } from 'react';
import gql from 'graphql-tag';
import Button from '@material-ui/core/Button';
import { useMutation, useQuery } from 'react-apollo';
import { Typography, TextField, Grid, makeStyles, CircularProgress, withStyles } from '@material-ui/core';
import NumberFormat from 'react-number-format';
// import 'date-fns';
import DateFnsUtils from '@date-io/date-fns';
import Checkbox, { CheckboxProps } from '@material-ui/core/Checkbox';
import { MuiPickersUtilsProvider, KeyboardDatePicker } from '@material-ui/pickers';
import MenuItem from '@material-ui/core/MenuItem';
import InputAdornment from '@material-ui/core/InputAdornment';
import { updateSchool, updateSchoolVariables } from './graphql/updateSchool';
import { useParams } from 'react-router-dom';
import { getSchool, getSchoolVariables } from './graphql/getSchool';
import { InputUpdateSchool } from '../../types/globalTypes';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import { green } from '@material-ui/core/colors';
import { ApolloError } from 'apollo-client';

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

const GreenCheckbox = withStyles({
  root: {
    color: green[400],
    '&$checked': {
      color: green[600],
    },
  },
  checked: {},
})((props: CheckboxProps) => <Checkbox color="default" {...props} />);

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

const editSchoolMutation = gql`
  mutation updateSchool($input: InputUpdateSchool!) {
    updateSchool(input: $input) {
      id
      acronym
      name
      description
      startDate
      endDate
      outreachStartDate
      outreachEndDate
      miniOutreachStartDate
      miniOutreachEndDate
      currency
      applicationFee
      schoolFee
      miniOutreachFee
      outreachFee
      online
    }
  }
`;

const getSchoolQuery = gql`
  query getSchool($schoolId: Int!) {
    getSchoolInfoForApplication(schoolId: $schoolId) {
      id
      acronym
      name
      description
      startDate
      endDate
      outreachStartDate
      outreachEndDate
      miniOutreachStartDate
      miniOutreachEndDate
      currency
      applicationFee
      schoolFee
      miniOutreachFee
      outreachFee
      online
    }
  }
`;

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

export function EditSchool({ user }: { user: User | undefined }) {
  const classes = useStyles();
  const { id } = useParams();
  const [errors, setErrors] = useState<string[]>([]);
  const [updateSchoolMutation] = useMutation<updateSchool, updateSchoolVariables>(editSchoolMutation);
  const [updateSuccessful, setUpdateSuccessful] = useState<boolean>(false);
  const { loading, error, data } = useQuery<getSchool, getSchoolVariables>(getSchoolQuery, {
    variables: { schoolId: Number(id) },
  });

  if (error) {
    setErrors((e) => [...e, error.message]);
  }

  const [schoolToUpdate, setSchoolToUpdate] = useState<InputUpdateSchool>(
    data?.getSchoolInfoForApplication ?? ({} as InputUpdateSchool),
  );

  if (data?.getSchoolInfoForApplication && !schoolToUpdate.id) {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { __typename, ...cleanSchoolToUpdate } = data?.getSchoolInfoForApplication;
    console.log(cleanSchoolToUpdate.online);

    setSchoolToUpdate({ ...cleanSchoolToUpdate });
  }

  function setInput(event: React.ChangeEvent<HTMLInputElement>): void {
    setSchoolToUpdate({
      ...schoolToUpdate,
      [event.target.name]: event.target.value,
    });
  }

  function setBoolInput(event: React.ChangeEvent<HTMLInputElement>): void {
    setSchoolToUpdate({
      ...schoolToUpdate,
      [event.target.name]: event.target.checked,
    });
  }

  function setNumberInput(event: React.ChangeEvent<HTMLInputElement>): void {
    setSchoolToUpdate({
      ...schoolToUpdate,
      [event.target.name]: Number(event.target.value),
    });
  }

  function setDateInput(property: string, value: Date | null): void {
    setSchoolToUpdate((school) => {
      school[property] = value === null ? null : new Date(value);
      return { ...school };
    });
  }
  async function handleSubmit(event: React.FormEvent): Promise<void> {
    event.preventDefault();
    setErrors([]);
    try {
      const updatedSchool = await updateSchoolMutation({
        variables: {
          input: schoolToUpdate,
        },
      });

      if (updatedSchool && updatedSchool.errors && updatedSchool.errors.length > 0) {
        setErrors((e) => [...e, ...updatedSchool.errors!.map((err) => err.originalError?.message ?? err.message)]); //'some Error']);
        setUpdateSuccessful(false);
      }
      if (!updatedSchool?.data?.updateSchool || updatedSchool?.data?.updateSchool === null) {
        setErrors((e) => [...e, 'No school data arrived back from server. Creation might have been cancelled.']);
        setUpdateSuccessful(false);
      }
      if (updatedSchool.data?.updateSchool) {
        setSchoolToUpdate(updatedSchool.data.updateSchool);
        setUpdateSuccessful(true);
      }
    } catch (e) {
      if (e instanceof ApolloError) {
        const graphQlErrors = e.graphQLErrors;
        setErrors((err) => [...err, ...graphQlErrors.map((ge) => ge.message)]);
        setErrors((err) => [...err, e.message]);
      } else {
        setErrors((err) => [...err, e.message]);
      }
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
      {updateSuccessful && schoolToUpdate && (
        <MuiAlert
          key={schoolToUpdate.id ?? 1000} // ToDo: remove the integer when id is not null anymore
          className={classes.alert}
          elevation={6}
          variant="filled"
          severity="success"
        >
          School {schoolToUpdate.name} ({schoolToUpdate.acronym}), starting at {schoolToUpdate.startDate} was
          successfully updated.
        </MuiAlert>
      )}
      {errors.length > 0 &&
        errors.map((err, index) => (
          <MuiAlert key={index} className={classes.alert} elevation={6} variant="filled" severity="error">
            {err}
          </MuiAlert>
        ))}
      <Typography component="h4" variant="h5">
        Edit School {schoolToUpdate?.name}
      </Typography>

      {loading && <CircularProgress />}
      {!loading && schoolToUpdate && (
        <form className={classes.form} noValidate onSubmit={handleSubmit}>
          <TextField
            key="name"
            variant="outlined"
            required
            id="name"
            label="Name of the school"
            name="name"
            autoFocus
            InputLabelProps={{ shrink: true }}
            className={classes.halfTextField}
            value={schoolToUpdate.name}
            onChange={setInput}
          />
          <TextField
            key="acronym"
            variant="outlined"
            required
            id="acronym"
            label="Acronym of the school"
            name="acronym"
            InputLabelProps={{ shrink: true }}
            className={classes.halfTextField}
            value={schoolToUpdate.acronym}
            onChange={setInput}
          />
          <TextField
            key="schoolEmail"
            variant="outlined"
            required
            id="schoolEmail"
            label="School Email"
            name="schoolEmail"
            InputLabelProps={{ shrink: true }}
            className={classes.halfTextField}
            value={schoolToUpdate.schoolEmail}
            onChange={setInput}
          />
          <TextField
            key="description"
            variant="outlined"
            required
            multiline
            fullWidth
            InputLabelProps={{ shrink: true }}
            id="description"
            label="Description of the school"
            name="description"
            className={classes.textField}
            value={schoolToUpdate.description}
            onChange={setInput}
          />
          <FormControlLabel
            control={
              <GreenCheckbox
                checked={schoolToUpdate.online ?? undefined}
                color="primary"
                onChange={setBoolInput}
                value={schoolToUpdate.online ? 'on' : 'off'}
                name="online"
              />
            }
            label="Show online (open applying)"
          />

          <FormControlLabel
            control={
              <Checkbox
                checked={schoolToUpdate.secondary ?? undefined}
                color="primary"
                onChange={setBoolInput}
                name="secondary"
              />
            }
            label="Secondary School?"
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
                value={schoolToUpdate.startDate}
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
                value={schoolToUpdate.endDate}
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
                value={schoolToUpdate.outreachStartDate}
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
                value={schoolToUpdate.outreachEndDate}
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
                value={schoolToUpdate.miniOutreachStartDate}
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
                value={schoolToUpdate.miniOutreachEndDate}
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
            value={schoolToUpdate.currency}
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
              value={schoolToUpdate.applicationFee}
              onChange={setNumberInput}
              InputProps={{
                inputComponent: NumberFormatCustom as any,
                startAdornment: (
                  <InputAdornment position="start">
                    {currencies.find((c) => c.value === schoolToUpdate.currency)?.label ?? ''}
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
              value={schoolToUpdate.schoolFee}
              onChange={setNumberInput}
              InputProps={{
                inputComponent: NumberFormatCustom as any,
                startAdornment: (
                  <InputAdornment position="start">
                    {currencies.find((c) => c.value === schoolToUpdate.currency)?.label ?? ''}
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
              value={schoolToUpdate.miniOutreachFee}
              onChange={setNumberInput}
              InputProps={{
                inputComponent: NumberFormatCustom as any,
                startAdornment: (
                  <InputAdornment position="start">
                    {currencies.find((c) => c.value === schoolToUpdate.currency)?.label ?? ''}
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
              value={schoolToUpdate.outreachFee}
              onChange={setNumberInput}
              InputProps={{
                inputComponent: NumberFormatCustom as any,
                startAdornment: (
                  <InputAdornment position="start">
                    {currencies.find((c) => c.value === schoolToUpdate.currency)?.label ?? ''}
                  </InputAdornment>
                ),
              }}
            />
          </Grid>

          <Button type="submit" variant="contained" color="primary" className={classes.submit}>
            Update
          </Button>
        </form>
      )}
    </Container>
  );
}
