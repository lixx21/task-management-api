import { Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { PrismaService } from '../prisma/prisma.service';
import * as bcrypt from 'bcryptjs';


@Injectable()
export class UsersService {
  constructor(private readonly prisma: PrismaService){}

  async create(createUserDto: CreateUserDto) {
    const user = await this.prisma.users.findUnique({
      where:{
        username: createUserDto.username,
      },
    });

    if (user){
      return {
        "status": "failed",
        "message": "User already exists"
      };
    }

    const saltNumber = await bcrypt.genSalt(8);
    const hashedPassword = await bcrypt.hash(createUserDto.password,saltNumber)
    const result =  await this.prisma.users.create({
      data: {
        username: createUserDto.username,
        password: hashedPassword,
        email: createUserDto.email,
      }
    })
    return {
      "status":"success",
      "data": result
    }
  }

  async login(){
    return "login"
  }

  async findAll() {
    try{
      const result = await this.prisma.users.findMany({
        select:{
          id: true,
          email: true,
          username: true
        },
      });
      return {
        "status": "success",
        "data": result
      }
    }catch(error){
      return {
        "status": "failed",
        "message": error.message
      }
    } 
  }

  async findOne(id: number) {
    try {
      const result = await this.prisma.users.findUnique({
        select:{
          id: true,
          email: true,
          username: true
        },
        where: {id}
      });
      return {
        "status": "success",
        "data": result
      };
    }catch(error){
      return {
        "status": "failed",
        "message": error.message
      }
    }
  }

  update(id: number, updateUserDto: UpdateUserDto) {
    try{
      const result = this.prisma.users.update({
        where: {id},
        data: updateUserDto
      })
      return {
        "status": "success",
        "data": result
      };
    }catch(error){
      return{
        "status":"failed",
        "message": error.message
      }
    }
    
  }

  async remove(id: number) {
    try{
      const result = this.prisma.users.delete({
        where:{id}
      })
      return {
        "status":"success",
        "data": result
      }
    }catch(error){
      return {
        "status": "failed",
        "message": error.message
      }
    }
    
  }
}
