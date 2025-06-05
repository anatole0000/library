import { getRepository } from "typeorm";
import { Book } from "../entity/Book";
import { Author } from "../entity/Author";
import { Reader } from "../entity/Reader";
import { Loan } from "../entity/Loan";

export const dashboardResolver = {
  Query: {
    dashboardStats: async () => {
      const bookRepo = getRepository(Book);
      const authorRepo = getRepository(Author);
      const readerRepo = getRepository(Reader);
      const loanRepo = getRepository(Loan);

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
