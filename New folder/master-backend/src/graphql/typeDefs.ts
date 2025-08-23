import { gql } from "apollo-server-express";
import { userSchema } from "../modules/users/graphql/schema";
import { postSchema } from "../modules/posts/graphql/schema";

export const typeDefs = gql`
  scalar Object
  scalar DateTime

  ${userSchema}
  ${postSchema}
`;
