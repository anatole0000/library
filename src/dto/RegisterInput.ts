import { IsEmail, IsNotEmpty, Length } from "class-validator";

export class RegisterInput {
  @IsNotEmpty({ message: "Name is required" })
  name!: string;

  @IsEmail({}, { message: "Invalid email format" })
  email!: string;

  @Length(6, 20, { message: "Password must be between 6 and 20 characters" })
  password!: string;
}
