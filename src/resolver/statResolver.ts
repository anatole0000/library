import { getRepository } from "typeorm";
import { Loan } from "../entity/Loan";
import { Book } from "../entity/Book";
import { redis } from "../utils/redisClient";  // Redis client sử dụng node-redis

export const statResolver = {
  Query: {
    monthlyLoanStats: async (_: any, { year }: { year: number }) => {
      const cacheKey = `monthlyLoanStats:${year}`;

      // Thử lấy dữ liệu từ Redis cache
      const cached = await redis.get(cacheKey);
      if (cached) {
        // Nếu có cache thì parse và trả về luôn
        return JSON.parse(cached);
      }

      // Nếu không có cache, lấy dữ liệu từ DB
      const loanRepo = getRepository(Loan);
      const loans = await loanRepo
        .createQueryBuilder("loan")
        .where("EXTRACT(YEAR FROM loan.borrowDate) = :year", { year })
        .getMany();

      const stats = Array(12).fill(0);
      loans.forEach((loan) => {
        const month = loan.borrowDate.getMonth(); // 0-based
        stats[month]++;
      });

      const result = stats.map((count, idx) => ({
        month: idx + 1,
        loansCount: count,
      }));

      // Lưu kết quả vào Redis với TTL 1 giờ (3600 giây)
      await redis.set(cacheKey, JSON.stringify(result), {
        EX: 3600,
      });

      return result;
    },

    topBooks: async (_: any, { limit }: { limit: number }) => {
      const cacheKey = `topBooks:${limit}`;

      const cached = await redis.get(cacheKey);
      if (cached) {
        return JSON.parse(cached);
      }

      const loanRepo = getRepository(Loan);

      const rawData = await loanRepo
        .createQueryBuilder("loan")
        .select("loan.bookId", "bookId")
        .addSelect("COUNT(loan.id)", "borrow_count")
        .groupBy("loan.bookId")
        .orderBy("borrow_count", "DESC")
        .limit(limit)
        .getRawMany();

      const bookRepo = getRepository(Book);
      const results = [];

      for (const row of rawData) {
        const book = await bookRepo.findOne({ where: { id: row.bookId } });
        if (book) {
          results.push({
            bookId: row.bookId,
            title: book.title,
            borrowCount: parseInt(row.borrow_count, 10),
          });
        }
      }

      await redis.set(cacheKey, JSON.stringify(results), {
        EX: 3600, // cache 1 giờ
      });

      return results;
    },
  },
};
