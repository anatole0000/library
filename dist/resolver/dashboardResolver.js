"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.dashboardResolver = void 0;
const typeorm_1 = require("typeorm");
const Book_1 = require("../entity/Book");
const Author_1 = require("../entity/Author");
const Reader_1 = require("../entity/Reader");
const Loan_1 = require("../entity/Loan");
exports.dashboardResolver = {
    Query: {
        dashboardStats: async () => {
            const bookRepo = (0, typeorm_1.getRepository)(Book_1.Book);
            const authorRepo = (0, typeorm_1.getRepository)(Author_1.Author);
            const readerRepo = (0, typeorm_1.getRepository)(Reader_1.Reader);
            const loanRepo = (0, typeorm_1.getRepository)(Loan_1.Loan);
            // Tổng số sách (tính tổng copiesAvailable)
            const books = await bookRepo.find();
            const totalCopiesAvailable = books.reduce((sum, b) => sum + b.copiesAvailable, 0);
            // Tổng số tác giả
            const totalAuthors = await authorRepo.count();
            // Tổng số bạn đọc
            const totalReaders = await readerRepo.count();
            // Tổng số phiếu mượn
            const totalLoans = await loanRepo.count();
            // Phiếu mượn chưa trả
            const loansNotReturned = await loanRepo.count({ where: { returned: false } });
            return {
                totalBooks: books.length,
                totalAuthors,
                totalReaders,
                totalLoans,
                loansNotReturned,
                totalCopiesAvailable,
            };
        },
    },
};
