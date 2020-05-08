import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Avatar from '@material-ui/core/Avatar';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemAvatar from '@material-ui/core/ListItemAvatar';
import ListItemText from '@material-ui/core/ListItemText';
import DialogTitle from '@material-ui/core/DialogTitle';
import Dialog from '@material-ui/core/Dialog';
import AddIcon from '@material-ui/icons/Add';
import { blue } from '@material-ui/core/colors';
import { gql } from 'apollo-boost';
import { useQuery } from 'react-apollo';
import { CircularProgress } from '@material-ui/core';
import { getCollections } from '../graphql/getCollections';
import MuiAlert from '@material-ui/lab/Alert';
import PlaylistAddIcon from '@material-ui/icons/PlaylistAdd';

const useStyles = makeStyles((theme) => ({
  avatar: {
    backgroundColor: blue[100],
    color: blue[600],
  },
  alert: {
    margin: theme.spacing(2),
  },
}));

const getQuestionCollectionQuery = gql`
  query getCollections {
    getApplicationQuestionCollections {
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

export interface QuestionCollectionDialogProps {
  open: boolean;
  selectedValue: number;
  onClose: (value: number) => void;
}

function QuestionCollectionDialog(props: QuestionCollectionDialogProps) {
  const classes = useStyles();
  const { onClose, selectedValue, open } = props;

  const { loading, error, data } = useQuery<getCollections>(getQuestionCollectionQuery);

  const handleClose = () => {
    onClose(selectedValue);
  };

  const handleListItemClick = (value: number) => {
    onClose(value);
  };
  if (loading) {
    return <CircularProgress />;
  }
  if (error) {
    return (
      <MuiAlert key={error.name} className={classes.alert} elevation={6} variant="filled" severity="error">
        {error.message}
      </MuiAlert>
    );
  }
  return (
    <Dialog onClose={handleClose} aria-labelledby="simple-dialog-title" open={open}>
      <DialogTitle id="simple-dialog-title">Set Question Collection</DialogTitle>
      <List>
        {data &&
          data.getApplicationQuestionCollections &&
          data.getApplicationQuestionCollections.map(
            (coll) =>
              coll && (
                <ListItem button onClick={() => handleListItemClick(coll.id)} key={coll.id}>
                  <ListItemAvatar>
                    <Avatar>
                      <PlaylistAddIcon />
                    </Avatar>
                  </ListItemAvatar>
                  <ListItemText primary={coll.name} />
                </ListItem>
              ),
          )}
        <ListItem autoFocus button onClick={() => handleListItemClick(-1)}>
          <ListItemAvatar>
            <Avatar>
              <AddIcon />
            </Avatar>
          </ListItemAvatar>
          <ListItemText primary="Add new Question Collection" />
        </ListItem>
      </List>
    </Dialog>
  );
}
