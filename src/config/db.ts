import { createConnection } from "typeorm";
import { Author } from "../entity/Author";
import { Book } from "../entity/Book";
import { Reader } from "../entity/Reader";
import { Loan } from "../entity/Loan";

export const connectDB = () => {
  return createConnection({
    type: "postgres",
    host: process.env.DB_HOST,
    port: Number(process.env.DB_PORT),
    username: process.env.DB_USERNAME,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_DATABASE,
    entities: [Author, Book, Reader, Loan],
    synchronize: true,
    logging: false,
  });
};
