import React from 'react';
import { Container } from '@material-ui/core';
import MuiAlert from '@material-ui/lab/Alert';

export function NoAdminAlert() {
  return (
    <Container component="main" maxWidth="md">
      <MuiAlert elevation={6} variant="filled" severity="error">
        You have to be logged in as Admin to see this page.
      </MuiAlert>
    </Container>
  );
}
