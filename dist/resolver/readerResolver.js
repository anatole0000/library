"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.readerResolver = void 0;
const typeorm_1 = require("typeorm");
const Reader_1 = require("../entity/Reader");
exports.readerResolver = {
    Query: {
        readers: async () => {
            const repo = (0, typeorm_1.getRepository)(Reader_1.Reader);
            return repo.find();
        },
    },
    Mutation: {
        addReader: async (_, { name, email, address, phone, }) => {
            const repo = (0, typeorm_1.getRepository)(Reader_1.Reader);
            const newReader = repo.create({ name, email, address, phone });
            return repo.save(newReader);
        },
    },
};
