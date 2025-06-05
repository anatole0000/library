import { getRepository } from "typeorm";
import { Reader } from "../entity/Reader";

export const readerResolver = {
  Query: {
    readers: async () => {
      const repo = getRepository(Reader);
      return repo.find();
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
