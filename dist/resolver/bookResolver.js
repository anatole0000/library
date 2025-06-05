"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.bookResolver = void 0;
const typeorm_1 = require("typeorm");
const Book_1 = require("../entity/Book");
const Author_1 = require("../entity/Author");
exports.bookResolver = {
    Query: {
        books: async () => {
            const repo = (0, typeorm_1.getRepository)(Book_1.Book);
            return repo.find({ relations: ["author"] });
        },
    },
    Mutation: {
        addBook: async (_, { title, authorId, publishedYear, copiesAvailable, }, context // thêm context ở đây
        ) => {
            // Kiểm tra phân quyền: chỉ admin mới thêm được sách
            if (!context.state.user || context.state.user.role !== "ADMIN") {
                throw new Error("Not authorized");
            }
            const bookRepo = (0, typeorm_1.getRepository)(Book_1.Book);
            const authorRepo = (0, typeorm_1.getRepository)(Author_1.Author);
            const author = await authorRepo.findOne({ where: { id: authorId } });
            if (!author)
                throw new Error("Author not found");
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
