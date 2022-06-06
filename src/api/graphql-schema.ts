import * as path from 'path';
import { buildSchema } from 'type-graphql';
import resolvers from '../lib/resolvers';

const makeSchema = async () => {
  return await buildSchema({
    resolvers,
    emitSchemaFile: {
      path: path.join(__dirname, '../../schema.gql'),
      commentDescriptions: true
    }
  });
};

export { makeSchema };
