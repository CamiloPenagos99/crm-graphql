import { gql } from "apollo-server-express";

export const typeDefs = gql`
  type Query {
    hello: String,
    cursos(input: String!): [Course]
  },

  type Course {
    title: String
    topic: String
    year: Int
  }

  input CourseFilterInput {
    topic: String
  }
`;

