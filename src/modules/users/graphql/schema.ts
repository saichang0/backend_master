export const userSchema = `
type User {
id: ID
fullname: String
email: String
}

input UserInput {
fullname: String
email: String
password: String
}



type UserOneResponse {
  is_error: Boolean
  code: String
  message: String
  data: User
  error: Object
}

input UserLoginInput {
email: String
password: String
}
type UserLoginData {
user: User
token: String
}
type UserLoginResponse {
  is_error: Boolean
  code: String
  message: String
  data: UserLoginData
  error: Object
}

type UserManyResponse {
  is_error: Boolean
  code: String
  message: String
  total: Int
  data: [User]
  error: Object
}



type Query {
user(id: ID!): UserOneResponse
userProfile: UserOneResponse
users: UserManyResponse
}

type Mutation {
userRegister(data: UserInput): UserOneResponse
userLogin(data: UserLoginInput): UserLoginResponse
updateProfile(data: UserInput): UserOneResponse
deleteUser(id: ID!): UserOneResponse
}
`;
