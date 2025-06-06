import { Author } from "../entity/Author";
import { getRepository } from "typeorm";

export const authorResolver = {
  Query: {
    authors: async (_: any, { skip = 0, take = 10 }: { skip?: number; take?: number }) => {
      try {
        const repo = getRepository(Author);
        const [items, totalCount] = await repo.findAndCount({
          skip,
          take,
          order: { id: "ASC" },
        });

        console.log("items:", JSON.stringify(items, null, 2));
        console.log("Authors totalCount:", totalCount);

        return {
          items,
          totalCount,
        };
      } catch (error) {
        console.error("Error in authors resolver:", error);
        return {
          items: [],
          totalCount: 0,
        };
      }
    },
  },
  Author: {
    books: (parent: Author) => {
      const authorRepo = getRepository(Author);
      return authorRepo.findOne({ where: { id: parent.id }, relations: ["books"] }).then(a => a?.books || []);
    }
  }
};
