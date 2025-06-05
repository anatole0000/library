import { Author } from "../entity/Author";
import { getRepository } from "typeorm";

export const authorResolver = {
  Query: {
    authors: async () => {
      const authorRepo = getRepository(Author);
      return authorRepo.find({ relations: ["books"] });
    },
  },
  Author: {
    books: (parent: Author) => {
      const authorRepo = getRepository(Author);
      return authorRepo.findOne({ where: { id: parent.id }, relations: ["books"] }).then(a => a?.books || []);
    }
  }
};
