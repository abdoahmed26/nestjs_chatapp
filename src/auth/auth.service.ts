import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { CreateUserDto, LoginUserDto } from 'src/users/dto/create-user.dto';
import { User } from '../users/entities/user.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { Request, Response } from 'express';

@Injectable()
export class AuthService {

  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    private readonly jwtService: JwtService,
  ) {}

  async login(data: LoginUserDto) {
    const user = await this.userRepository.findOne({where:{email: data.email}});
    if (!user) {
      throw new NotFoundException({status:"not found",message: 'User not found'});
    }
    const isMatch = await bcrypt.compare(data.password, user.password);
    if (!isMatch) {
      throw new BadRequestException({status:"bad request",message: 'Invalid credentials'});
    }
    const token = this.jwtService.sign({id: user.id,email: user.email}, {expiresIn:"1d"});
    return {status:"success",data:{token, user}};
  }

  async register(data: CreateUserDto,profileImage:string | undefined) {
    const user = await this.userRepository.findOne({where:{email: data.email}});
    if (user) {
      throw new BadRequestException({status:"bad request",message: 'User already exists'});
    }
    const hashedPassword = await bcrypt.hash(data.password, 10);
    const newUser = this.userRepository.create({...data,profileImage,password:hashedPassword});
    await this.userRepository.save(newUser);
    const token = this.jwtService.sign({id: newUser.id,email: newUser.email}, {expiresIn:"1d"});
    return {status:"success",data:{token}};
  }

  async googleLogin(req:Request,res:Response){
    const loginData = (req as any).user as {email:string,firstName:string,lastName:string,picture:string,accessToken:string};
    if(!loginData){
      throw new BadRequestException({status:"bad request",message:"user not found"})
    }
    let user = await this.userRepository.findOne({where:{email:loginData.email}});
    if(!user){
      const hashedPassword = await bcrypt.hash("123456789",10);
      user = this.userRepository.create({
        name: `${loginData.firstName} ${loginData.lastName}`,
        email: loginData.email,
        profileImage: loginData.picture,
        password: hashedPassword
      });
      await this.userRepository.save(user);
    }
    const payload = {id:user.id,email:user.email};
    const token = this.jwtService.sign(payload,{expiresIn:"1d"});
    return res.redirect(`${process.env.FRONTEND_URL}/login?token=${token}`);
  }
}
