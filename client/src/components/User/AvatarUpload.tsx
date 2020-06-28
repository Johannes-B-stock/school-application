import React, { useState } from 'react';
import gql from 'graphql-tag';
import { useMutation, useApolloClient } from 'react-apollo';
import { Button, Avatar, makeStyles, createStyles, Theme, useTheme, useMediaQuery } from '@material-ui/core';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import config from '../../config';
import DialogTitle from '@material-ui/core/DialogTitle';
import { uploadAvatar, uploadAvatarVariables } from './graphql/uploadAvatar';
import ImageUploader from 'react-images-upload';

const UPLOAD_AVATAR = gql`
  mutation uploadAvatar($file: Upload!) {
    avatarUpload(file: $file)
  }
`;

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    large: {
      width: theme.spacing(30),
      height: theme.spacing(30),
      fontSize: '15px',
      margin: 'auto',
    },
    dialog: {},
    dialogContent: {
      alignItems: 'center',
      justifyContent: 'center',
    },
  }),
);

export function AvatarUpload({
  open,
  setOpen,
  image,
  setImage,
}: {
  open: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
  image: string;
  setImage: React.Dispatch<React.SetStateAction<string>>;
}) {
  const theme = useTheme();
  const fullScreen = useMediaQuery(theme.breakpoints.down('sm'));
  const classes = useStyles();
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>();
  const [uploadAvatarMutation] = useMutation<uploadAvatar, uploadAvatarVariables>(UPLOAD_AVATAR);
  const apolloClient = useApolloClient();

  const handleClose = () => {
    setOpen(false);
  };

  function readURI(file: File) {
    const reader = new FileReader();
    reader.onload = function (ev) {
      setPreview(ev.target?.result?.toString());
    };
    reader.readAsDataURL(file);
  }

  const onFormSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    console.log(file);
    const result = await uploadAvatarMutation({ variables: { file: file } });
    if (result.data?.avatarUpload) {
      setImage(result.data.avatarUpload);
      apolloClient.resetStore();
    }
  };

  function onChange(files: File[]) {
    readURI(files[0]);
    setFile(files[0]);
  }

  // function onChange(event: React.ChangeEvent<HTMLInputElement>) {
  //   if (event.target.files && event.target.validity.valid) {
  //     setFile(event.target.files[0]);
  //     console.log(event.target.files[0]);
  //   }
  // }

  return (
    <Dialog
      fullScreen={fullScreen}
      fullWidth={true}
      maxWidth={'sm'}
      open={open}
      onClose={handleClose}
      className={classes.dialog}
      aria-labelledby="form-dialog-title"
    >
      <DialogTitle id="form-dialog-title">Upload Profile Picture</DialogTitle>
      <form onSubmit={onFormSubmit}>
        <DialogContent dividers className={classes.dialogContent}>
          <Avatar src={preview ? preview : config.IMAGE_URL + image} className={classes.large} />
          <ImageUploader
            withIcon={true}
            buttonText="Choose image"
            onChange={onChange}
            imgExtension={['.jpg', '.gif', '.png', '.gif']}
            maxFileSize={5242880}
            singleImage={true}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} color="secondary">
            Cancel
          </Button>
          <Button onClick={handleClose} type="submit" color="secondary">
            Upload
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
}
