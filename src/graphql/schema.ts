import { gql } from "apollo-server-koa";

export const typeDefs = gql`
  ###########################
  #       TYPE DEFINITIONS  #
  ###########################

  type Author {
    id: ID!
    name: String!
    bio: String
    books: [Book!]!
  }

  type Book {
    id: ID!
    title: String!
    author: Author!
    publishedYear: Int
    copiesAvailable: Int!
  }

  type Reader {
    id: ID!
    name: String!
    email: String!
    address: String
    phone: String
    role: String!
  }

  type Loan {
    id: ID!
    book: Book!
    reader: Reader!
    borrowDate: String!
    returnDate: String
    returned: Boolean!
  }

  type DashboardStats {
    totalBooks: Int!
    totalAuthors: Int!
    totalReaders: Int!
    totalLoans: Int!          # T
    loansNotReturned: Int!    # P
    totalCopiesAvailable: Int! # T
  } 

  type MonthlyLoanStat {
    month: Int!
    loansCount: Int!
  }

  type TopBook {
    bookId: ID!
    title: String!
    borrowCount: Int!
  }

  type AuthPayload {
    token: String!
    user: Reader!
  }
  ###########################
  #        QUERY TYPE       #
  ###########################

  type Query {
    authors: [Author!]!
    books: [Book!]!
    readers: [Reader!]!
    loans: [Loan!]!
    dashboardStats: DashboardStats!
    monthlyLoanStats(year: Int!): [MonthlyLoanStat!]!
    topBooks(limit: Int! = 5): [TopBook!]!
    me: Reader!
  }

  ###########################
  #       MUTATION TYPE     #
  ###########################

  type Mutation {
    addAuthor(name: String!, bio: String): Author!
    addBook(
      title: String!
      authorId: ID!
      publishedYear: Int
      copiesAvailable: Int!
    ): Book!
    addReader(
      name: String!
      email: String!
      address: String
      phone: String
    ): Reader!
    createLoan(bookId: ID!, readerId: ID!): Loan!
    returnBook(loanId: ID!): Loan!
    register(name: String!, email: String!, password: String!): Reader!
    login(email: String!, password: String!): AuthPayload!
  }
`;
