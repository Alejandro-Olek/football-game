import { Entity, PrimaryColumn, ManyToOne, Column } from 'typeorm';
import { Match } from './match.entity';
import { User } from './user.entity';

@Entity('match_players')
export class MatchPlayer {
  @PrimaryColumn()
  matchId: number;

  @PrimaryColumn()
  userId: number;

  @ManyToOne(() => Match, (match) => match.players, { onDelete: 'CASCADE' })
  match: Match;

  @ManyToOne(() => User, (user) => user.matchPlayers, { onDelete: 'CASCADE' })
  user: User;

  @Column({ type: 'text' })
  team: 'home' | 'away';

  @Column({ type: 'text', default: 'forward' })
  position: 'goalkeeper' | 'defender' | 'midfielder' | 'forward';
}
