"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.resolvers = void 0;
const typeorm_1 = require("typeorm");
const authorResolver_1 = require("../resolver/authorResolver");
const Author_1 = require("../entity/Author");
const readerResolver_1 = require("../resolver/readerResolver");
const loanResolver_1 = require("../resolver/loanResolver");
const bookResolver_1 = require("../resolver/bookResolver");
const dashboardResolver_1 = require("../resolver/dashboardResolver");
const statResolver_1 = require("../resolver/statResolver");
exports.resolvers = {
    Query: {
        ...authorResolver_1.authorResolver.Query,
        ...readerResolver_1.readerResolver.Query,
        ...loanResolver_1.loanResolver.Query,
        ...bookResolver_1.bookResolver.Query,
        ...dashboardResolver_1.dashboardResolver.Query,
        ...statResolver_1.statResolver.Query,
    },
    Author: {
        ...authorResolver_1.authorResolver.Author,
    },
    Mutation: {
        ...readerResolver_1.readerResolver.Mutation,
        ...loanResolver_1.loanResolver.Mutation,
        ...bookResolver_1.bookResolver.Mutation,
        addAuthor: async (_, { name, bio }) => {
            const authorRepo = (0, typeorm_1.getRepository)(Author_1.Author);
            const author = authorRepo.create({ name, bio });
            return authorRepo.save(author);
        }
    }
};
