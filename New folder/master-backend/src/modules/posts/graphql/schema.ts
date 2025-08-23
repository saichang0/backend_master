export const postSchema = `
type Post {
  id: ID
  title: String
  details: String
  url: String
  userId: ID
  userData: User
  created_at: DateTime
  updated_at: DateTime
}
input PostInput {
  title: String
  details: String
  url: String
}

type PostOneResponse {
  is_error: Boolean
  code: String
  message: String
  data: Post
  error: Object
}

type PostManyResponse {
  is_error: Boolean
  code: String
  message: String
  total: Int
  data: [Post]
  error: Object
}



type Query {
post(id: ID!): PostOneResponse
posts(keyword: String, page: Int, limit: Int): PostManyResponse
}

type Mutation {
createPost(data: PostInput): PostOneResponse
deletePost(id: ID!): PostOneResponse
updatePost(id: ID!, data: PostInput): PostOneResponse
}
`;
