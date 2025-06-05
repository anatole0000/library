import { getRepository } from "typeorm";
import { Loan } from "../entity/Loan";
import { Book } from "../entity/Book";

export const statResolver = {
  Query: {
    monthlyLoanStats: async (_: any, { year }: { year: number }) => {
      const loanRepo = getRepository(Loan);

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

    topBooks: async (_: any, { limit }: { limit: number }) => {
      const loanRepo = getRepository(Loan);

      const rawData = await loanRepo
        .createQueryBuilder("loan")
        .select("loan.bookId", "bookId")
        .addSelect("COUNT(loan.id)", "borrow_count")
        .groupBy("loan.bookId")
        .orderBy("borrow_count", "DESC")
        .limit(limit)
        .getRawMany();

      const bookRepo = getRepository(Book);

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
