import { getRepository } from "typeorm";
import { Book } from "../entity/Book";
import { Author } from "../entity/Author";
import { requireRole } from "../utils/authHelpers";

export const bookResolver = {
  Query: {
    books: async (_: any, { skip = 0, take = 10 }) => {
      const repo = getRepository(Book);
      const [items, totalCount] = await repo.findAndCount({
        relations: ["author"],
        skip,
        take,
        order: { id: "ASC" },
      });

      return { items, totalCount };
    },
    

    authors: async () => {
      const repo = getRepository(Author);
      return repo.find();
    },
  },

  Mutation: {
    addBook: async (
      _: any,
      {
        title,
        authorId,
        publishedYear,
        copiesAvailable,
      }: {
        title: string;
        authorId: number;
        publishedYear?: number;
        copiesAvailable: number;
      },
      context: any
    ) => {
      // Gọi hàm kiểm tra phân quyền ở đây, trong thân hàm
      requireRole(context.user, ["ADMIN"]);

      const bookRepo = getRepository(Book);
      const authorRepo = getRepository(Author);

      const author = await authorRepo.findOne({ where: { id: authorId } });
      if (!author) throw new Error("Author not found");

      const book = bookRepo.create({
        title,
        publishedYear,
        copiesAvailable,
        author,
      });

      return bookRepo.save(book);
    },
  },
};
