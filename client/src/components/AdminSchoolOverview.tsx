import { User } from '../types/User';
import React from 'react';
import { Container, Typography, Fab, IconButton } from '@material-ui/core';
import { NoAdminAlert } from './NoAdminAlert';
import { SchoolList } from './SchoolList';
import { Link } from 'react-router-dom';
import AddIcon from '@material-ui/icons/Add';
import Box from '@material-ui/core/Box';

export function AdminSchoolOverview({ user }: { user: User | undefined }) {
  if (!user || (user?.role !== 'ADMIN' && user?.role !== 'SCHOOLADMIN')) {
    return <NoAdminAlert />;
  }
  return (
    <Container component="main" maxWidth="lg">
      <div style={{ width: '90%' }}>
        <Box display="flex" flexDirection="row-reverse" alignItems="flex-end">
          <Box>
            <Fab color="secondary" aria-label="add" style={{ position: 'fixed' }}>
              <IconButton component={Link} to="/admin/school/create">
                <AddIcon />
              </IconButton>
            </Fab>
          </Box>
        </Box>
      </div>

      <Typography variant="h5">All Schools that are online:</Typography>
      <SchoolList online={true} allowEdit={true} />
      <Typography variant="h5">All Schools that are not yet online:</Typography>
      <SchoolList online={false} allowEdit={true} />
    </Container>
  );
}
