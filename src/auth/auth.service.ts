// src/auth/auth.service.ts
import { Injectable, UnauthorizedException, ConflictException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import * as jwt from 'jsonwebtoken';
import { User } from '../entities/user.entity';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  // Registro de usuario
  async register(email: string, password: string, nickname: string, avatar?: string) {
    const existingUser = await this.userRepository.findOne({ where: { email } });

    if (existingUser) {
      throw new ConflictException('User already exists');
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = this.userRepository.create({
      email,
      password: hashedPassword,
      nickname,
      role: 'player', // Por defecto es jugador
    });

    await this.userRepository.save(newUser);
    console.log('User register:', newUser);

    return { message: 'User created' };
  }

  // Autenticación de usuario
  async login(email: string, password: string) {
    const user = await this.userRepository.findOne({ where: { email } });

    if (!user || !(await bcrypt.compare(password, user.password))) {
      throw new UnauthorizedException('Wrong crenedtials');
    }

    const token = this.generateToken(user);
    return { message: 'Succesful login', token };
  }

  // Generación de token JWT
  generateToken(user: User): string {
    return jwt.sign(
      { id: user.id, email: user.email, role: user.role, nickname: user.nickname },
      'SECRET_KEY',
      { expiresIn: '24h' }
    );
  }

  // Validación del token
  verifyToken(token: string): any {
    try {
      return jwt.verify(token, 'SECRET_KEY');
    } catch (error) {
      throw new UnauthorizedException('Token invalid or expired');
    }
  }
}
