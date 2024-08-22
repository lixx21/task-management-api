import { Injectable } from '@nestjs/common';
import { LoginDto } from './dto/create-auth.dto';
import { JwtService } from '@nestjs/jwt';
import { PrismaService } from 'src/prisma/prisma.service';
import * as bcrypt from 'bcryptjs';

@Injectable()
export class AuthService {
  constructor(
    private jwtToken:  JwtService,
    private readonly prisma: PrismaService){}

  //
  async login(loginDto:LoginDto){
    const userData= await this.prisma.users.findUnique({
      where: {
        username: loginDto.username
      }
    })

    // check if username exists
    if (!userData){
      return {
        "status":"failed",
        "message": "username did not exists!"
      }
    }

    //check if password correct
    const isPasswordMatched = await bcrypt.compare(loginDto.password, userData.password)

    if (!isPasswordMatched){
      return {
        "status": "failed",
        "message": "Wrong Password"
      }
    }
    // create token
    const token = this.jwtToken.sign({
      "id": userData.id,
      "username": userData.username,
      "email": userData.email
    });

    return {
      "status": "success",
      "token": token
    }
  }
}
