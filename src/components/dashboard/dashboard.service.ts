import { Injectable, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Match } from 'src/entities/match.entity';
import { User } from 'src/entities/user.entity';

@Injectable()
export class DashboardService {
  constructor(
    @InjectRepository(Match)
    private readonly matchRepository: Repository<Match>,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  async createMatch(
    matchData: { type: 'friendly' | 'tournament' | 'ranked'; duration: number },
    nickname: string,
  ): Promise<Match> {
    const user = await this.userRepository.findOne({ where: { nickname } });
    if (!user) {
      throw new UnauthorizedException('User not found');
    }
    const newMatch = this.matchRepository.create({
      type: matchData.type,
      duration: matchData.duration,
      status: 'pending',
      creator: user,
    });
    return await this.matchRepository.save(newMatch);
  }

  async getActiveMatches(): Promise<Match[]> {
    return await this.matchRepository.find({
      where: [{ status: 'pending' }, { status: 'in_progress' }],
      relations: ['creator'],
      order: { date: 'DESC' },
    });
  }
}