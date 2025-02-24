// src/main.ts
import { NestFactory } from '@nestjs/core';
import { NestExpressApplication } from '@nestjs/platform-express';
import { join } from 'path';
import { AppModule } from './app.module';
import * as dotenv from 'dotenv';
import * as cookieParser from 'cookie-parser';
dotenv.config();

async function bootstrap() {

  const app = await NestFactory.create<NestExpressApplication>(AppModule);
  // Establece la carpeta donde estarán tus vistas (por ejemplo, 'views' en la raíz)
  app.setBaseViewsDir(join(__dirname, '..', 'src/views'));
  app.useStaticAssets(join(__dirname, '..', 'public'));
  app.use(cookieParser()); // Necesario para manejar cookies

  // Configura el motor de plantillas (puede ser EJS, Handlebars, etc.)
  app.setViewEngine('ejs');
  await app.listen(3000);
}
bootstrap();