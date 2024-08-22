import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { PrismaModule } from 'src/prisma/prisma.module';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule, ConfigService } from '@nestjs/config';

@Module({
  imports:[
    PrismaModule,
    JwtModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: async (configService:ConfigService)=>({
        secret: configService.get<string>('JWT_SECRET_KEY'),
        signOptions: { expiresIn: "1d"},
      })
    })
  ],
  controllers: [AuthController],
  providers: [AuthService],
})
export class AuthModule {}
