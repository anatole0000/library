"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.loanResolver = void 0;
const typeorm_1 = require("typeorm");
const Loan_1 = require("../entity/Loan");
const Reader_1 = require("../entity/Reader");
const Book_1 = require("../entity/Book");
exports.loanResolver = {
    Query: {
        loans: async () => {
            const repo = (0, typeorm_1.getRepository)(Loan_1.Loan);
            return repo.find({ relations: ["book", "reader"] });
        },
    },
    Mutation: {
        createLoan: async (_, { bookId, readerId }) => {
            const loanRepo = (0, typeorm_1.getRepository)(Loan_1.Loan);
            const bookRepo = (0, typeorm_1.getRepository)(Book_1.Book);
            const readerRepo = (0, typeorm_1.getRepository)(Reader_1.Reader);
            const book = await bookRepo.findOne({ where: { id: bookId } });
            const reader = await readerRepo.findOne({ where: { id: readerId } });
            if (!book || !reader)
                throw new Error("Book or reader not found");
            if (book.copiesAvailable < 1)
                throw new Error("No available copies");
            // Giảm số sách còn lại
            book.copiesAvailable -= 1;
            await bookRepo.save(book);
            const newLoan = loanRepo.create({
                book,
                reader,
                borrowDate: new Date(),
                returned: false,
            });
            return loanRepo.save(newLoan);
        },
        returnBook: async (_, { loanId }) => {
            const loanRepo = (0, typeorm_1.getRepository)(Loan_1.Loan);
            const bookRepo = (0, typeorm_1.getRepository)(Book_1.Book);
            const loan = await loanRepo.findOne({
                where: { id: loanId },
                relations: ["book"],
            });
            if (!loan || loan.returned)
                throw new Error("Invalid loan or already returned");
            loan.returned = true;
            loan.returnDate = new Date();
            // Tăng lại số sách
            loan.book.copiesAvailable += 1;
            await bookRepo.save(loan.book);
            return loanRepo.save(loan);
        },
    },
};
