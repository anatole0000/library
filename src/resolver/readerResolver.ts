import { getRepository } from "typeorm";
import { Reader } from "../entity/Reader";

export const readerResolver = {
  Query: {
    readers: async (_: any, { skip = 0, take = 10 }: { skip?: number; take?: number }) => {
      const repo = getRepository(Reader);
      const [items, totalCount] = await repo.findAndCount({
        skip,
        take,
        order: { id: "ASC" },
      });

      return { items, totalCount };
    },
  },


  Mutation: {
    addReader: async (
      _: any,
      {
        name,
        email,
        address,
        phone,
      }: { name: string; email: string; address?: string; phone?: string }
    ) => {
      const repo = getRepository(Reader);
      const newReader = repo.create({ name, email, address, phone });
      return repo.save(newReader);
    },
  },
};
