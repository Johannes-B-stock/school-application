/* eslint-disable @typescript-eslint/no-explicit-any */
import { User } from '../../types/User';
import Container from '@material-ui/core/Container';
import MuiAlert from '@material-ui/lab/Alert';
import React, { useState } from 'react';
import gql from 'graphql-tag';
import Button from '@material-ui/core/Button';
import { useMutation } from 'react-apollo';
import { Typography, TextField, makeStyles } from '@material-ui/core';
import Divider from '@material-ui/core/Divider';
import {
  createQuestionCollection_createApplicationQuestionCollection as QuestionCollection,
  createQuestionCollectionVariables,
  createQuestionCollection,
} from './graphql/createQuestionCollection';
import { InputCreateApplicationQuestionCollection } from '../../types/globalTypes';

const useStyles = makeStyles((theme) => ({
  alert: {
    margin: theme.spacing(2),
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

function getCounter(x: number): 'st' | 'nd' | 'rd' | 'th' {
  const lastDigit = x > 10 ? x % 10 : x;

  if (lastDigit === 1) {
    return 'st';
  }
  if (lastDigit === 2) {
    return 'nd';
  }
  if (lastDigit === 3) {
    return 'rd';
  }
  return 'th';
}

const createQuestionCollectionMutation = gql`
  mutation createQuestionCollection($input: InputCreateApplicationQuestionCollection!) {
    createApplicationQuestionCollection(input: $input) {
      id
      name
      description
      type
      questions {
        id
        question
      }
    }
  }
`;

export function CreateQuestionCollection({ user }: { user: User | undefined }) {
  const classes = useStyles();
  const [errors, setErrors] = useState<string[]>([]);
  const [createdCollection, setCreatedCollection] = useState<QuestionCollection | undefined>();
  const [questions, setQuestions] = useState<string[]>(['']);
  const [questionsInput, setQuestionsInput] = useState<InputCreateApplicationQuestionCollection>(
    {} as InputCreateApplicationQuestionCollection,
  );

  const [newQuestionCollectionMutation] = useMutation<createQuestionCollection, createQuestionCollectionVariables>(
    createQuestionCollectionMutation,
  );

  function changeQuestion(index: number, question: string): void {
    const newQuestions = questions;
    newQuestions[index] = question;
    if (index === newQuestions.length - 1) {
      newQuestions.push('');
    }
    setQuestions(() => [...newQuestions]);
  }

  function setInput(event: React.ChangeEvent<HTMLInputElement>): void {
    setQuestionsInput({
      ...questionsInput,
      [event.target.name]: event.target.value,
    });
  }

  async function handleSubmit(event: React.FormEvent): Promise<void> {
    event.preventDefault();
    questions.pop();
    try {
      const newQuestionCollection = await newQuestionCollectionMutation({
        variables: {
          input: { ...questionsInput, questions: questions },
        },
      });

      if (newQuestionCollection && newQuestionCollection.errors && newQuestionCollection.errors.length > 0) {
        setErrors((e) => [
          ...e,
          ...newQuestionCollection.errors!.map((err) => 'test' + err.originalError?.message ?? err.message),
        ]); //'some Error']);
      }
      if (
        !newQuestionCollection?.data?.createApplicationQuestionCollection ||
        newQuestionCollection?.data?.createApplicationQuestionCollection === null
      ) {
        setErrors((e) => [...e, 'No school data arrived back from server. Creation might have been cancelled.']);
      }
      setCreatedCollection(newQuestionCollection.data?.createApplicationQuestionCollection ?? undefined);
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
      {createdCollection && (
        <MuiAlert
          key={createdCollection.id ?? 1000} // ToDo: remove the integer when id is not null anymore
          className={classes.alert}
          elevation={6}
          variant="filled"
          severity="success"
        >
          Application Question Collection created.
        </MuiAlert>
      )}
      {errors.length > 0 &&
        errors.map((err, index) => (
          <MuiAlert key={index} className={classes.alert} elevation={6} variant="filled" severity="error">
            {err}
          </MuiAlert>
        ))}
      <Typography component="h4" variant="h5">
        Create a new Question Collection
      </Typography>
      <form className={classes.form} noValidate onSubmit={handleSubmit}>
        <TextField
          key="name"
          variant="outlined"
          required
          id="name"
          label="Name of the Collection"
          name="name"
          autoFocus
          className={classes.halfTextField}
          value={questionsInput.name}
          onChange={setInput}
        />
        <TextField
          key="type"
          variant="outlined"
          required
          id="type"
          label="Type of the questions, e.g. 'DTS'"
          name="type"
          className={classes.halfTextField}
          value={questionsInput.type}
          onChange={setInput}
        />
        <TextField
          key="description"
          variant="outlined"
          multiline
          fullWidth
          id="description"
          label="Description of the school"
          name="description"
          className={classes.textField}
          value={questionsInput.description}
          onChange={setInput}
        />
        <Divider />
        <Typography variant="body1">
          Write down the questions. these are going to be asked when starting a new application.
        </Typography>
        {questions.map((q, index) => (
          <TextField
            key={index}
            variant="outlined"
            multiline
            fullWidth
            id={'question' + index}
            label={index + 1 + getCounter(index + 1) + ' question for the appliant'}
            name={'question' + index}
            className={classes.textField}
            value={questions[index]}
            onChange={(event) => changeQuestion(index, event.target.value)}
          />
        ))}

        <Button type="submit" variant="contained" color="primary" className={classes.submit}>
          Create
        </Button>
      </form>
    </Container>
  );
}
