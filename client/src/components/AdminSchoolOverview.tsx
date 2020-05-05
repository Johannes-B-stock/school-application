import { User } from '../types/User';
import React from 'react';
import { Container, Typography } from '@material-ui/core';
import { NoAdminAlert } from './NoAdminAlert';
import { SchoolList } from './SchoolList';

export function AdminSchoolOverview({ user }: { user: User | undefined }) {
  if (!user || (user?.role !== 'ADMIN' && user?.role !== 'SCHOOLADMIN')) {
    return <NoAdminAlert />;
  }
  return (
    <Container component="main" maxWidth="lg">
      <Typography variant="h5">All Schools that are online:</Typography>
      <SchoolList online={true} allowEdit={true} />
      <Typography variant="h5">All Schools that are not yet online:</Typography>
      <SchoolList online={false} allowEdit={true} />
    </Container>
  );
}
