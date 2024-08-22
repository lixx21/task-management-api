import { Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { PrismaService } from '../prisma/prisma.service';
import * as bcrypt from 'bcryptjs';


@Injectable()
export class UsersService {
  constructor(
      private readonly prisma: PrismaService
  ){}

  //TODO: Create User API
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

  //TODO: Get All Users API
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

  //TODO: Get One User API
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

  //TODO: Update User API
  async update(id: number, updateUserDto: UpdateUserDto) {
    try{
      if (updateUserDto.password){
        const salt = await bcrypt.genSalt(8);
        updateUserDto.password = await bcrypt.hash(updateUserDto.password, salt)
      }
      const result = await this.prisma.users.update({
        where: {id},
        data: updateUserDto
      });
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

  //TODO: Remove User API
  async remove(id: number) {
    try{
      const result = await this.prisma.users.delete({
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
