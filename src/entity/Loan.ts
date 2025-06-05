import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from "typeorm";
import { Book } from "./Book";
import { Reader } from "./Reader";

@Entity()
export class Loan {
  @PrimaryGeneratedColumn()
  id!: number;

  @ManyToOne(() => Book, (book) => book.loans)
  book!: Book;

  @ManyToOne(() => Reader, (reader) => reader.loans)
  reader!: Reader;

  @Column()
  borrowDate!: Date;

  @Column({ nullable: true })
  returnDate?: Date;

  @Column({ default: false })
  returned!: boolean;
}
