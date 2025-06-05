"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.statResolver = void 0;
const typeorm_1 = require("typeorm");
const Loan_1 = require("../entity/Loan");
const Book_1 = require("../entity/Book");
exports.statResolver = {
    Query: {
        monthlyLoanStats: async (_, { year }) => {
            const loanRepo = (0, typeorm_1.getRepository)(Loan_1.Loan);
            // Lấy tất cả các phiếu mượn trong năm
            const loans = await loanRepo
                .createQueryBuilder("loan")
                .where("EXTRACT(YEAR FROM loan.borrowDate) = :year", { year })
                .getMany();
            // Đếm số phiếu mượn theo tháng
            const stats = Array(12).fill(0);
            loans.forEach((loan) => {
                const month = loan.borrowDate.getMonth(); // 0-based
                stats[month]++;
            });
            // Trả về mảng { month: 1-12, loansCount }
            return stats.map((count, idx) => ({
                month: idx + 1,
                loansCount: count,
            }));
        },
        topBooks: async (_, { limit }) => {
            const loanRepo = (0, typeorm_1.getRepository)(Loan_1.Loan);
            const rawData = await loanRepo
                .createQueryBuilder("loan")
                .select("loan.bookId", "bookId")
                .addSelect("COUNT(loan.id)", "borrow_count")
                .groupBy("loan.bookId")
                .orderBy("borrow_count", "DESC")
                .limit(limit)
                .getRawMany();
            const bookRepo = (0, typeorm_1.getRepository)(Book_1.Book);
            // Lấy thông tin sách theo bookId
            const results = [];
            for (const row of rawData) {
                const book = await bookRepo.findOne({ where: { id: row.bookId } });
                if (book) {
                    results.push({
                        bookId: row.bookId,
                        title: book.title,
                        borrowCount: parseInt(row.borrow_count, 10),
                    });
                }
            }
            return results;
        },
    },
};
