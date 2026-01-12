import { Injectable, NotFoundException } from '@nestjs/common';
import { UpdateUserDto } from './dto/update-user.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { Repository } from 'typeorm';
import { pagination } from 'src/helpers/pagination';

@Injectable()
export class UsersService {

  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  async findAll(limit:number , page:number) {
    const [users, count] = await this.userRepository.findAndCount({
      select: ['id', 'name', 'email', 'profileImage', 'createdAt', 'updatedAt'],
      skip: (page - 1) * limit,
      take: limit,
    });
    const pagin = pagination(limit,page,count);
    return {status: 'success', data: {users, pagination: pagin}};
  }

  async findOne(id: string) {
    const user = await this.userRepository.findOne({
      where: { id },
      select: ['id', 'name', 'email', 'profileImage', 'createdAt', 'updatedAt'],
    });
    if (!user) {
      throw new NotFoundException(`User with id # ${id} # not found`);
    }
    return {status: 'success', data: user};
  }

  async update(id: string, data: UpdateUserDto,profileImage:string | undefined) {
    const user = await this.userRepository.findOne({
      where: { id },
    });
    if (!user) {
      throw new NotFoundException(`User with id # ${id} # not found`);
    }
    const image = profileImage ? profileImage : user.profileImage;
    await this.userRepository.update(id, { ...data, profileImage: image });
    const updatedUser = await this.userRepository.findOne({
      where: { id },
      select: ['id', 'name', 'email', 'profileImage', 'createdAt', 'updatedAt'],
    });
    return {status: 'success', data: updatedUser};
  }

  async remove(id: string) {
    const user = await this.userRepository.findOne({
      where: { id },
    });
    if (!user) {
      throw new NotFoundException(`User with id # ${id} # not found`);
    }
    await this.userRepository.delete(id);
    return {status: 'success', message: `User with id #${id} has been removed`};
  }
}
