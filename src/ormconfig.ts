export default {
  type: "postgres",
  host: "localhost",
  port: 5432,
  username: "postgres",
  password: "lengoc2252005",
  database: "library",
  entities: ["src/entity/**/*.ts"],
  synchronize: true, // bật để tự tạo bảng khi dev
};
