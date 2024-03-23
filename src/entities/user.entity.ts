import { Exclude } from 'class-transformer';
import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: string;

  @Column({ nullable: true })
  email: string;

  @Column()
  userName: string;

  @Exclude()
  @Column()
  password: string;

  @Column({ nullable: true })
  firstName: string;

  @Column({ nullable: true })
  lastName: string;

  constructor(partial: Partial<User>) {
    Object.assign(this, partial);
  }
}
