/**
 * This file merges all of the schemas that belong to different parts of the shards
 */
import users from './users';
import schools from './schools';
import schoolApplications from './schoolApplication';
import { mergeRawSchemas } from '../utils/mergeRawSchemas';
import applicationQuestions from './applicationQuestions';
import address from './address';

export default mergeRawSchemas(
  users,
  schools,
  schoolApplications,
  applicationQuestions,
  address
);
