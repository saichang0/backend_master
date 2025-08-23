import { resolvers } from "./graphql/resolvers";
import { typeDefs } from "./graphql/typeDefs";
import { makeExecutableSchema } from "@graphql-tools/schema";
import express, { Request, Response } from "express";
import basicApiRoute from "./modules/basicApi/routes";
import { AppDataSource } from "./database/dbConnecct";
import userRoute from "./modules/users/routes";
import postRoutes from "./modules/posts/routes";
import { ApolloServer } from "apollo-server-express";
import dotenv from "dotenv";
dotenv.config();

const startServer = async () => {
  const app = express();
  const PORT = process.env.PORT || 3000;

  app.use(express.json());

  app.use("/", basicApiRoute);

  // User routes
  app.use("/api/users", userRoute);
  // Post routes
  app.use("/api/posts", postRoutes);

  const schema = makeExecutableSchema({
    typeDefs,
    resolvers,
  });

  const graphqlServer = new ApolloServer({
    schema,
    context: ({ req, res }) => ({ req, res }),
  });
  await graphqlServer.start();
  graphqlServer.applyMiddleware({ app: app as any, path: "/graphql" });

  AppDataSource.initialize()
    .then(() => {
      console.log("Connect database successful");

      app
        .listen(PORT, () => {
          console.log(`Server is running on http://localhost:${PORT}`);
          console.log(
            `Server Rest api is running on http://localhost:${PORT}/api`
          );
          console.log(
            `Server Graphql is running on http://localhost:${PORT}/graphql`
          );
        })
        .on("error", (err: any) => {
          console.error("Failed to start server:", err);
        });
    })
    .catch((error: Error) => {
      console.error("Error while connecting database: ", error);
    });
};

startServer();
