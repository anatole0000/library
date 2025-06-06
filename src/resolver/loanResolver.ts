import { getRepository } from "typeorm";
import { Loan } from "../entity/Loan";
import { Reader } from "../entity/Reader";
import { Book } from "../entity/Book";

export const loanResolver = {
  Query: {
    loans: async (_: any, { skip = 0, take = 10 }: { skip?: number; take?: number }) => {
      const repo = getRepository(Loan);
      const [items, totalCount] = await repo.findAndCount({
        skip,
        take,
        order: { id: "ASC" },
        relations: ["book", "reader"],
      });

      return { items, totalCount };
    },
  },

  Mutation: {
    createLoan: async (_: any, { bookId, readerId }: { bookId: number; readerId: number }) => {
      const loanRepo = getRepository(Loan);
      const bookRepo = getRepository(Book);
      const readerRepo = getRepository(Reader);

      const book = await bookRepo.findOne({ where: { id: bookId } });
      const reader = await readerRepo.findOne({ where: { id: readerId } });

      if (!book || !reader) throw new Error("Book or reader not found");

      if (book.copiesAvailable < 1) throw new Error("No available copies");

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

    returnBook: async (_: any, { loanId }: { loanId: number }) => {
      const loanRepo = getRepository(Loan);
      const bookRepo = getRepository(Book);

      const loan = await loanRepo.findOne({
        where: { id: loanId },
        relations: ["book"],
      });

      if (!loan || loan.returned) throw new Error("Invalid loan or already returned");

      loan.returned = true;
      loan.returnDate = new Date();

      // Tăng lại số sách
      loan.book.copiesAvailable += 1;
      await bookRepo.save(loan.book);

      return loanRepo.save(loan);
    },
  },
};
