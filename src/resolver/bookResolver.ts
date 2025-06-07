import { getRepository } from "typeorm";
import { Book } from "../entity/Book";
import { Author } from "../entity/Author";
import { requireRole } from "../utils/authHelpers";
import cloudinary from "../utils/cloudinary";

interface FileUpload {
  filename: string;
  mimetype: string;
  encoding: string;
  createReadStream: () => NodeJS.ReadableStream;
}

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
        imageUrl,
        imageFile,
      }: {
        title: string;
        authorId: number;
        publishedYear?: number;
        copiesAvailable: number;
        imageUrl?: string;
        imageFile?: Promise<FileUpload>;
      },
      context: any
    ) => {
      requireRole(context.user, ["ADMIN"]);

      const bookRepo = getRepository(Book);
      const authorRepo = getRepository(Author);

      const author = await authorRepo.findOne({ where: { id: authorId } });
      if (!author) throw new Error("Author not found");

      let uploadedImageUrl = imageUrl; // ưu tiên url truyền trực tiếp nếu có

      if (imageFile) {
        const { createReadStream } = await imageFile;
        const stream = createReadStream();

        // Upload file lên Cloudinary
        const result: any = await new Promise((resolve, reject) => {
          const streamUpload = cloudinary.uploader.upload_stream(
            { folder: "books" },
            (error, result) => {
              if (error) reject(error);
              else resolve(result);
            }
          );
          stream.pipe(streamUpload);
        });

        uploadedImageUrl = result.secure_url;
      }

      const book = bookRepo.create({
        title,
        publishedYear,
        copiesAvailable,
        imageUrl: uploadedImageUrl,
        author,
      });

      return bookRepo.save(book);
    },
  },
};
