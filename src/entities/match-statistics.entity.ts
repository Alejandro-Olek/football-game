import { Entity, PrimaryColumn, Column, OneToOne, JoinColumn } from 'typeorm';
import { Match } from './match.entity';

@Entity('match_statistics')
export class MatchStatistics {
  @PrimaryColumn()
  matchId: number;

  @OneToOne(() => Match, { onDelete: 'CASCADE' })
  @JoinColumn()
  match: Match;

  @Column({ default: 0 })
  homeGoals: number;

  @Column({ default: 0 })
  awayGoals: number;

  @Column({ default: 0 })
  shots: number;

  @Column({ default: 0 })
  fouls: number;

  @Column({ type: 'decimal', precision: 5, scale: 2, default: 50.00 })
  possession: number;

  @Column({ default: 0 })
  completedPasses: number;

  @Column({ default: 0 })
  interceptions: number;
}
