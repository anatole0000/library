declare module 'graphql-upload' {
  import { GraphQLScalarType } from 'graphql';

  export const GraphQLUpload: GraphQLScalarType;

  export interface Upload {
    filename: string;
    mimetype: string;
    encoding: string;
    createReadStream: () => NodeJS.ReadableStream;
  }
}
