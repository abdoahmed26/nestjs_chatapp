import { IsEmail, IsNotEmpty, MaxLength, MinLength } from "class-validator";

export class CreateUserDto {
    @IsNotEmpty({message: 'Name is required'})
    @MinLength(3,{message: 'Name must be at least 3 characters'})
    @MaxLength(20,{message: 'Name must be at most 20 characters'})
    name: string;
    @IsNotEmpty({message: 'Email is required'})
    @IsEmail({},{message: 'Email is invalid'})
    email: string;
    @IsNotEmpty({message: 'Password is required'})
    @MinLength(6,{message: 'Password must be at least 6 characters'})
    @MaxLength(20,{message: 'Password must be at most 20 characters'})
    password: string;
}

export class LoginUserDto {
    @IsNotEmpty({message: 'Email is required'})
    @IsEmail({},{message: 'Email is invalid'})
    email: string;
    @IsNotEmpty({message: 'Password is required'})
    password: string;
}