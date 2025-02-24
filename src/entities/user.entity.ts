import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, OneToMany } from 'typeorm';
import { Match } from './match.entity';
import { MatchPlayer } from './match-player.entity';
import { PlayerStatistics } from './player-statistics.entity';
import { MatchAction } from './match-action.entity';

@Entity('users')
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  email: string;

  @Column()
  password: string;

  @Column()
  nickname: string;

  @Column({ nullable: true, type: 'text' })
  avatar?: string; // Agregar '?' permite `undefined`
  
  @Column({ default: 1 })
  level: number;

  @Column({ default: 0 })
  experience: number;

  @Column({ type: 'text', default: 'player' })
  role: 'player' | 'admin';

  @CreateDateColumn({ type: 'timestamptz' })
  createdAt: Date;

  @OneToMany(() => Match, (match) => match.creator)
  matches: Match[];

  @OneToMany(() => MatchPlayer, (matchPlayer) => matchPlayer.user)
  matchPlayers: MatchPlayer[];

  @OneToMany(() => PlayerStatistics, (stats) => stats.user)
  statistics: PlayerStatistics[];

  @OneToMany(() => MatchAction, (action) => action.user)
  actions: MatchAction[];
}
