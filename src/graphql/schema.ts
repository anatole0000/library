import { gql } from "graphql-tag";
/**
 * GraphQL schema definitions for the library management system.
 * This schema includes types for authors, books, readers, loans, and various queries and mutations.
 */



export const typeDefs = gql`
  ###########################
  #       TYPE DEFINITIONS  #
  ###########################

  scalar Upload

  type File {
    filename: String!
    mimetype: String!
    encoding: String!
  }

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
    imageUrl: String
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

  type BookPagination {
    items: [Book!]!
    totalCount: Int!
  }

  type ReaderPagination {
    items: [Reader!]!
    totalCount: Int!
  }

  type AuthorPagination {
    items: [Author!]!
    totalCount: Int!
  }

  type LoanPagination {
    items: [Loan!]!
    totalCount: Int!
  }

  ###########################
  #        QUERY TYPE       #
  ###########################

  type Query {
    authors(skip: Int = 0, take: Int = 10): AuthorPagination!
    books(skip: Int = 0, take: Int = 10): BookPagination!
    readers(skip: Int = 0, take: Int = 10): ReaderPagination!
    loans(skip: Int = 0, take: Int = 10): LoanPagination!
    dashboardStats: DashboardStats!
    monthlyLoanStats(year: Int!): [MonthlyLoanStat!]!
    topBooks(limit: Int! = 5): [TopBook!]!
    me: Reader!
    askAI(question: String!): String
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
      imageUrl: String
      imageFile: Upload 
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
    uploadFile(file: Upload!): File!
  }
`;
