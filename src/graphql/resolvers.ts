import { postResolvers } from "../modules/posts/graphql/resovlers";
import { userResolvers } from "../modules/users/graphql/resolvers";

export const resolvers = {
  ...userResolvers,
  ...postResolvers,
};
