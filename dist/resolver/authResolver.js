"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.authResolver = void 0;
const typeorm_1 = require("typeorm");
const Reader_1 = require("../entity/Reader");
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const JWT_SECRET = "your_jwt_secret_key_here";
exports.authResolver = {
    Mutation: {
        register: async (_, { name, email, password }) => {
            try {
                const repo = (0, typeorm_1.getRepository)(Reader_1.Reader);
                const existing = await repo.findOne({ where: { email } });
                if (existing)
                    throw new Error("Email already in use");
                const hashedPassword = await bcryptjs_1.default.hash(password, 10);
                const user = repo.create({
                    name,
                    email,
                    password: hashedPassword,
                    role: Reader_1.UserRole.READER,
                });
                const savedUser = await repo.save(user);
                console.log("User saved:", savedUser);
                return savedUser;
            }
            catch (err) {
                console.error("Register error:", err);
                throw new Error("Registration failed");
            }
        },
        login: async (_, { email, password }) => {
            const repo = (0, typeorm_1.getRepository)(Reader_1.Reader);
            const user = await repo.findOne({ where: { email } });
            if (!user)
                throw new Error("User not found");
            const valid = await bcryptjs_1.default.compare(password, user.password);
            if (!valid)
                throw new Error("Incorrect password");
            const token = jsonwebtoken_1.default.sign({ userId: user.id, role: user.role }, JWT_SECRET, { expiresIn: "1d" });
            return { token, user };
        },
    },
    Query: {
        me: async (_, __, context) => {
            if (!context.user)
                throw new Error("Unauthorized");
            const repo = (0, typeorm_1.getRepository)(Reader_1.Reader);
            return repo.findOne(context.user.userId);
        },
    },
};
