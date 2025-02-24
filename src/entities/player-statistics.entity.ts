import { Entity, PrimaryGeneratedColumn, ManyToOne, Column } from 'typeorm';
import { Match } from './match.entity';
import { User } from './user.entity';

@Entity('player_statistics')
export class PlayerStatistics {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => Match, { onDelete: 'CASCADE' })
  match: Match;

  @ManyToOne(() => User, { onDelete: 'CASCADE' })
  user: User;

  @Column({ default: 0 })
  goals: number;

  @Column({ default: 0 })
  assists: number;

  @Column({ default: 0 })
  minutesPlayed: number;

  @Column({ default: 0 })
  yellowCards: number;

  @Column({ default: 0 })
  redCards: number;

  @Column({ default: 0 })
  completedPasses: number;

  @Column({ default: 0 })
  shotsOnTarget: number;

  @Column({ default: 0 })
  successfulDribbles: number;

  @Column({ type: 'decimal', precision: 3, scale: 2, default: 6.00 })
  rating: number;
}
