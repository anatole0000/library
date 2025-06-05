import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from "typeorm";
import { Loan } from "./Loan";

export enum UserRole {
  ADMIN = "ADMIN",
  READER = "READER",
}

@Entity()
export class Reader {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column()
  name!: string;

  @Column({ unique: true })
  email!: string;

  @Column()
  password!: string;

  @Column({ nullable: true })
  phone?: string;

  @Column({ nullable: true })
  address?: string;

  @Column({ type: "enum", enum: UserRole, default: UserRole.READER })
  role!: UserRole;

  @OneToMany(() => Loan, (loan) => loan.reader)
  loans!: Loan[];
}
