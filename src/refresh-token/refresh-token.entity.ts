import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { User } from '../user/user.entity';

@Entity()
export class RefreshToken {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  token: string;

  @Column()
  expireIn: Date;

  @ManyToOne(() => User, (user: User) => user.refreshTokens, {
    onDelete: 'CASCADE',
  })
  user: User;
}
