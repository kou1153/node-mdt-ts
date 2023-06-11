import { Entity, PrimaryGeneratedColumn, Column } from "typeorm";

@Entity()
export class MDT {
  @PrimaryGeneratedColumn()
  id: number;

  @Column("text")
  HoVaTen: string;

  @Column("text")
  TKCK: string;

  @Column("text")
  SDT: string;

  @Column("text")
  Email: string;

  @Column("text")
  MDT: string;

  @Column()
  DeletedAt: boolean;
}
