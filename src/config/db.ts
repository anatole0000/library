import { createConnection } from "typeorm";
import { Author } from "../entity/Author";
import { Book } from "../entity/Book";
import { Reader } from "../entity/Reader";
import { Loan } from "../entity/Loan";

export const connectDB = () => {
  return createConnection({
    type: "postgres",
    host: "localhost",
    port: 5432,
    username: "postgres",
    password: "lengoc2252005",
    database: "library",
    entities: [Author, Book, Reader, Loan],
    synchronize: true,
    logging: false,
  });
};
