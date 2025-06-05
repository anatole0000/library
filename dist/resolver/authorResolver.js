"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.authorResolver = void 0;
const Author_1 = require("../entity/Author");
const typeorm_1 = require("typeorm");
exports.authorResolver = {
    Query: {
        authors: async () => {
            const authorRepo = (0, typeorm_1.getRepository)(Author_1.Author);
            return authorRepo.find({ relations: ["books"] });
        },
    },
    Author: {
        books: (parent) => {
            const authorRepo = (0, typeorm_1.getRepository)(Author_1.Author);
            return authorRepo.findOne({ where: { id: parent.id }, relations: ["books"] }).then(a => a?.books || []);
        }
    }
};
