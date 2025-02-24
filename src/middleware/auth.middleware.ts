// src/auth/auth.middleware.ts
import { Injectable, NestMiddleware, UnauthorizedException } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import * as jwt from 'jsonwebtoken';

@Injectable()
export class AuthMiddleware implements NestMiddleware {
    
  use(req: Request, res: Response, next: NextFunction) {
    const token = req.cookies?.auth_token;
    if (!token) {
      return res.redirect('/auth/login'); // Redirige si no hay token
    }
    
    try {
      const decoded = jwt.verify(token, 'SECRET_KEY');
        (req as any).user = decoded;
      next();
    } catch (error) {
      throw new UnauthorizedException('Token inválido o expirado');
    }
  }
}