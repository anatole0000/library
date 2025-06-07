import { getRepository } from "typeorm";
import { Loan } from "../entity/Loan";
import { Reader } from "../entity/Reader";
import { Book } from "../entity/Book";
import { loanStatsQueue } from "../queues/loanStatsQueue";

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

      const savedLoan = await loanRepo.save(newLoan);

      await loanStatsQueue.add("update-loan-stats", {
        type: "BORROW",
        bookId: book.id,
        bookTitle: book.title,
        borrowDate: new Date().toISOString(),
      });

      // 🔔 Emit thông báo realtime
      globalThis.io?.emit("bookBorrowed", {
        bookTitle: book.title,
        readerName: reader.name,
        time: new Date().toISOString(),
      });

      return savedLoan;
    },

    returnBook: async (_: any, { loanId }: { loanId: number }) => {
      const loanRepo = getRepository(Loan);
      const bookRepo = getRepository(Book);

      const loan = await loanRepo.findOne({
        where: { id: loanId },
        relations: ["book", "reader"],
      });

      if (!loan || loan.returned) throw new Error("Invalid loan or already returned");

      loan.returned = true;
      loan.returnDate = new Date();

      // Tăng lại số sách
      loan.book.copiesAvailable += 1;
      await bookRepo.save(loan.book);

      const updatedLoan = await loanRepo.save(loan);

      // 🔔 Emit thông báo realtime
      globalThis.io?.emit("bookReturned", {
        bookTitle: loan.book.title,
        readerName: loan.reader?.name,
        time: new Date().toISOString(),
      });

      return updatedLoan;
    },
  },
};
