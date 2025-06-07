import { getRepository } from "typeorm";
import { authorResolver } from "../resolver/authorResolver";
import { Author } from "../entity/Author";
import { readerResolver } from "../resolver/readerResolver";
import { loanResolver } from "../resolver/loanResolver";
import { bookResolver } from "../resolver/bookResolver";
import { dashboardResolver } from "../resolver/dashboardResolver";
import { statResolver } from "../resolver/statResolver";
import { authResolver } from "../resolver/authResolver";
import { aiAssistantResolver } from "../resolver/aiAssistant";
import { GraphQLUpload } from "graphql-upload";


export const resolvers = {
  Upload: GraphQLUpload,

  Query: {
    ...authorResolver.Query,
    ...readerResolver.Query,
    ...loanResolver.Query,
    ...bookResolver.Query,
    ...dashboardResolver.Query,
    ...statResolver.Query,
    ...authResolver.Query,
    ...aiAssistantResolver.Query,
  },

  Mutation: {
    ...readerResolver.Mutation,
    ...loanResolver.Mutation,
    ...bookResolver.Mutation,
    ...authResolver.Mutation,
    addAuthor: async (_: any, { name, bio }: { name: string; bio?: string }) => {
      const authorRepo = getRepository(Author);
      const author = authorRepo.create({ name, bio });
      return authorRepo.save(author);
    },

    uploadFile: async (_: any, { file }: { file: any }) => {
      const { createReadStream, filename, mimetype, encoding } = await file;

      // Bạn có thể pipe sang lưu file hoặc upload Cloudinary ở đây
      const _stream = createReadStream();
      console.log(`Uploading ${filename} (${mimetype})`);

      return { filename, mimetype, encoding };
    },
  },

  Author: {
    ...authorResolver.Author,
  },

  AuthorPagination: {
    totalCount: (parent: any) =>
      typeof parent.totalCount === 'number' ? parent.totalCount : 0,
    items: (parent: any) => (Array.isArray(parent.items) ? parent.items : []),
  },
};
