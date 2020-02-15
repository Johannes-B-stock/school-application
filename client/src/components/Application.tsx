import { Redirect } from "react-router-dom";
import React, { useState } from "react";
import { gql } from "apollo-boost";
import { useParams } from "react-router-dom";
import { User } from "../types/User";
import { useQuery, useMutation } from "react-apollo";
import CircularProgress from "@material-ui/core/CircularProgress";
import MuiAlert from "@material-ui/lab/Alert";
import Container from "@material-ui/core/Container";
import {
  getSchoolInfoVariables,
  getSchoolInfo,
  getSchoolInfo_getSchoolInfoForApplication_questions,
} from "../graphql/getSchoolInfo";
import TextField from "@material-ui/core/TextField";
import { createStyles, makeStyles, Theme } from "@material-ui/core/styles";
import Button from "@material-ui/core/Button";
import {
  createApplication,
  createApplicationVariables,
} from "../graphql/createApplication";
import { GraphQLError } from "graphql";
import Typography from "@material-ui/core/Typography";

// const getUserQuery = gql`
//   query getUserDetail {
//     getUser {
//       id
//       firstName
//       lastName
//       fullName
//       role
//     }
//   }
// `;

interface answer {
  questionId: number;
  question: string;
  answer: string;
}

const getSchoolQuery = gql`
  query getSchoolInfo($schoolId: Int!) {
    getSchoolInfoForApplication(schoolId: $schoolId) {
      id
      acronym
      name
      online
      description
      questions {
        id
        question
      }
    }
  }
`;

const createApplicationMutation = gql`
  mutation createApplication($input: InputCreateSchoolApplication!) {
    createSchoolApplication(input: $input) {
      id
    }
  }
`;

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      marginTop: theme.spacing(8),
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
    },

    textField: {
      marginLeft: theme.spacing(1),
      marginRight: theme.spacing(1),
      marginTop: theme.spacing(3),
      width: "150ch",
    },
    submit: {
      margin: theme.spacing(3, 1, 2),
    },
  })
);

export function Application({ user }: { user: User | undefined }) {
  const { id } = useParams();
  const classes = useStyles();

  const [formError, setFormError] = useState<string | undefined>(undefined);
  const [applicationId, setApplicationId] = useState<number | undefined>(
    undefined
  );
  let questions: getSchoolInfo_getSchoolInfoForApplication_questions[] = [];
  let loadedAnswers: answer[] = [];

  const [createApplication] = useMutation<
    createApplication,
    createApplicationVariables
  >(createApplicationMutation);

  async function handleSubmit(event: React.FormEvent) {
    event.preventDefault();
    setFormError(undefined);
    if (!inputValidated()) {
      setFormError(
        "you have to fill out all questions before you can continue"
      );
      return;
    }
    try {
      const { data, errors } = await createApplication({
        variables: {
          input: {
            schoolId: Number(id),
            userId: Number(user?.id),
            answers: [
              ...answers.map((a) => {
                return { ...a };
              }),
            ],
          },
        },
      });
      if (errors) {
        setFormError(errors.map((e: GraphQLError) => e.message).join(";"));
      }
      if (data?.createSchoolApplication?.id) {
        setApplicationId(data.createSchoolApplication.id);
      }
    } catch (err) {
      setFormError(err.message);
    }
  }

  function setAnswer(questionId: number, question: string, answer: string) {
    setAnswers((answ) => [
      ...answ.filter((a) => a.questionId !== questionId),
      { questionId, answer, question },
    ]);
  }

  const [answers, setAnswers] = useState<answer[]>(loadedAnswers);

  const { loading, error, data } = useQuery<
    getSchoolInfo,
    getSchoolInfoVariables
  >(getSchoolQuery, {
    variables: { schoolId: Number(id) },
  });

  if (data?.getSchoolInfoForApplication?.questions) {
    questions = data.getSchoolInfoForApplication.questions;
  }

  function inputValidated(): boolean {
    return (
      answers.length > 0 &&
      answers.every((a) => a.answer && a.answer.length > 0) &&
      answers.length === questions.length
    );
  }

  if (user === undefined) {
    return <Redirect to="/login" />;
  }
  return (
    <Container component="main" maxWidth="md">
      <div className={classes.root}>
        {applicationId && (
          <MuiAlert elevation={6} variant="filled" severity="success">
            Application with ID {applicationId} was created.
          </MuiAlert>
        )}
        {loading && <CircularProgress />}
        {error && (
          <MuiAlert elevation={6} variant="filled" severity="warning">
            {error.message}
          </MuiAlert>
        )}
        {formError && (
          <MuiAlert elevation={6} variant="filled" severity="error">
            {formError}
          </MuiAlert>
        )}
        <Typography component="h1" variant="h5">
          Application for {data?.getSchoolInfoForApplication?.name} (
          {data?.getSchoolInfoForApplication?.acronym})
        </Typography>
        <Typography variant="subtitle1" gutterBottom>
          Start your adventure now!
        </Typography>
        <Typography variant="body1" gutterBottom>
          Please fill out all the questions that are necessary for applying.
        </Typography>
        {questions && (
          <form noValidate onSubmit={handleSubmit}>
            {questions.map((question) => {
              return (
                question && (
                  <div>
                    <TextField
                      key={question.id.toString()}
                      id={question.id.toString()}
                      label={question.question ?? ""}
                      multiline
                      required
                      fullWidth
                      value={
                        answers.find((a) => a.questionId === question.id)
                          ?.answer
                      }
                      onChange={(e) =>
                        setAnswer(
                          question.id,
                          question.question,
                          e.target.value
                        )
                      }
                      variant="outlined"
                      className={classes.textField}
                    />
                  </div>
                )
              );
            })}

            <Button
              type="submit"
              variant="contained"
              color="primary"
              className={classes.submit}
            >
              Create Application
            </Button>
          </form>
        )}
      </div>
    </Container>
  );
}
