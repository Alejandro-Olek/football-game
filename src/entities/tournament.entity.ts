import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { TournamentMatch } from './tournament-match.entity';

@Entity('tournaments')
export class Tournament {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column({ type: 'date' })
  startDate: Date;

  @Column({ type: 'date' })
  endDate: Date;

  @Column({ type: 'text', default: 'pending' })
  status: 'pending' | 'in_progress' | 'finished';

  @OneToMany(() => TournamentMatch, (tournamentMatch) => tournamentMatch.tournament)
  matches: TournamentMatch[];
}
