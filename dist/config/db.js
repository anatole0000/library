"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.connectDB = void 0;
const typeorm_1 = require("typeorm");
const Author_1 = require("../entity/Author");
const Book_1 = require("../entity/Book");
const Reader_1 = require("../entity/Reader");
const Loan_1 = require("../entity/Loan");
const connectDB = () => {
    return (0, typeorm_1.createConnection)({
        type: "postgres",
        host: "localhost",
        port: 5432,
        username: "postgres",
        password: "lengoc2252005",
        database: "library",
        entities: [Author_1.Author, Book_1.Book, Reader_1.Reader, Loan_1.Loan],
        synchronize: true,
        logging: false,
    });
};
exports.connectDB = connectDB;
