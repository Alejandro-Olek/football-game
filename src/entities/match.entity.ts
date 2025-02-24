import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, OneToMany, CreateDateColumn } from 'typeorm';
import { User } from './user.entity';
import { MatchPlayer } from './match-player.entity';
import { MatchStatistics } from './match-statistics.entity';
import { MatchAction } from './match-action.entity';
import { TournamentMatch } from './tournament-match.entity';

@Entity('matches')
export class Match {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => User, (user) => user.matches, { onDelete: 'CASCADE' })
  creator: User;

  @Column({ type: 'text', default: 'friendly' })
  type: 'friendly' | 'tournament' | 'ranked';

  @Column({ type: 'text', default: 'pending' })
  status: 'pending' | 'in_progress' | 'finished';

  @Column({ default: 10 })
  duration: number;

  @CreateDateColumn({ type: 'timestamptz' })
  date: Date;

  @OneToMany(() => MatchPlayer, (matchPlayer) => matchPlayer.match)
  players: MatchPlayer[];

  @OneToMany(() => MatchStatistics, (stats) => stats.match)
  statistics: MatchStatistics[];

  @OneToMany(() => MatchAction, (action) => action.match)
  actions: MatchAction[];

  @OneToMany(() => TournamentMatch, (tournamentMatch) => tournamentMatch.match)
  tournamentMatches: TournamentMatch[];  // 💡 Agrega esta propiedad
}
