import { Entity, ManyToOne, PrimaryColumn } from 'typeorm';
import { Tournament } from './tournament.entity';
import { Match } from './match.entity';

@Entity('tournament_matches')
export class TournamentMatch {
  @PrimaryColumn()
  tournamentId: number;

  @PrimaryColumn()
  matchId: number;

  @ManyToOne(() => Tournament, (tournament) => tournament.matches, { onDelete: 'CASCADE' })
  tournament: Tournament;

  @ManyToOne(() => Match, (match) => match.tournamentMatches, { onDelete: 'CASCADE' })
  match: Match;
}
