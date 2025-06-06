import { getRepository } from "typeorm";
import { Reader, UserRole } from "../entity/Reader";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { RegisterInput } from "../dto/RegisterInput";
import { validate } from "class-validator";
import { sendEmail } from "../utils/email";

const JWT_SECRET = "your_jwt_secret_key_here";

export const authResolver = {
  Mutation: {
    register: async (
      _: any,
      { name, email, password }: { name: string; email: string; password: string }
    ) => {
      // Validate input using class-validator
      const input = new RegisterInput();
      input.name = name;
      input.email = email;
      input.password = password;

      const errors = await validate(input);
      if (errors.length > 0) {
        // Lấy message lỗi đầu tiên để trả về client
        const constraints = errors[0].constraints;
        const firstError = constraints ? Object.values(constraints)[0] : "Invalid input";
        throw new Error(firstError);
      }

      try {
        const repo = getRepository(Reader);
        const existing = await repo.findOne({ where: { email } });
        if (existing) throw new Error("Email already in use");

        const hashedPassword = await bcrypt.hash(password, 10);
        const user = repo.create({
          name,
          email,
          password: hashedPassword,
          role: UserRole.READER,
        });

        const savedUser = await repo.save(user);

        await sendEmail(
        email,
        "Welcome to Library App 📚",
        `<h3>Hello ${name},</h3><p>Thanks for registering at our library!</p>`
      );
        console.log("User saved:", savedUser);
        return savedUser;
      } catch (err) {
        console.error("Register error:", err);
        throw new Error("Registration failed");
      }
    },

    login: async (_: any, { email, password }: { email: string; password: string }) => {
      const repo = getRepository(Reader);
      const user = await repo.findOne({ where: { email } });
      if (!user) throw new Error("User not found");

      const valid = await bcrypt.compare(password, user.password);
      if (!valid) throw new Error("Incorrect password");

      const token = jwt.sign({ userId: user.id, role: user.role }, JWT_SECRET, { expiresIn: "1d" });
      return { token, user };
    },
  },

  Query: {
    me: async (_: any, __: any, context: any) => {
      if (!context.user) throw new Error("Unauthorized");
      const repo = getRepository(Reader);
      return repo.findOne({ where: { id: context.user.userId } });
    },
  },
};
