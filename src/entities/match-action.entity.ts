import { Entity, PrimaryGeneratedColumn, ManyToOne, Column } from 'typeorm';
import { Match } from './match.entity';
import { User } from './user.entity';

@Entity('match_actions')
export class MatchAction {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => Match, { onDelete: 'CASCADE' })
  match: Match;

  @ManyToOne(() => User, { onDelete: 'CASCADE' })
  user: User;

  @Column()
  minute: number;

  @Column({ type: 'text' })
  actionType: 'goal' | 'assist' | 'yellow_card' | 'red_card' | 'foul' | 'shot' | 'pass' | 'dribble';
}
