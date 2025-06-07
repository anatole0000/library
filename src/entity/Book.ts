import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, OneToMany } from "typeorm";
import { Author } from "./Author";
import { Loan } from "./Loan";

@Entity()
export class Book {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column()
  title!: string;

  @ManyToOne(() => Author, author => author.books)
  author!: Author;

  @Column({ nullable: true })
  publishedYear?: number;

  @Column()
  copiesAvailable!: number;

  @Column({ nullable: true })
  imageUrl?: string;  // URL of the book cover image

  @OneToMany(() => Loan, loan => loan.book)
  loans!: Loan[];
}
