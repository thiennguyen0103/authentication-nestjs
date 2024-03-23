import {
  Injectable,
  Request,
  UnauthorizedException,
  UseGuards,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import * as bcrypt from 'bcryptjs';
import { User } from 'src/entities/user.entity';
import { Repository } from 'typeorm';
import { SignupDto } from './dto/signup.dto';
import { JwtService } from '@nestjs/jwt';
import { SigninDto } from './dto/signin.dto';
import { LocalAuthGuard } from 'src/guards/local-auth.guard';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User) private readonly userRepository: Repository<User>,
    private readonly jwtService: JwtService,
  ) {}

  @UseGuards(LocalAuthGuard)
  async signIn(signinDto: SigninDto) {
    const { userName, password } = signinDto;

    const user = await this.userRepository.findOneBy({ userName });

    if (!user) {
      throw new UnauthorizedException('Invalid username or password');
    }

    const isPasswordMatched = await bcrypt.compare(password, user.password);

    if (!isPasswordMatched) {
      throw new UnauthorizedException('Invalid username or password');
    }

    const token = this.jwtService.sign({
      sub: user.id,
      userName: user.userName,
    });

    return { token };
  }

  async signUp(signupDto: SignupDto) {
    const { userName, password } = signupDto;

    const hashPassword = await bcrypt.hash(password, 10);
    const user = this.userRepository.create({
      userName: userName,
      password: hashPassword,
    });

    await this.userRepository.save(user);

    const token = this.jwtService.sign({
      sub: user.id,
      userName: user.userName,
    });

    return { token };
  }

  async getProfile(@Request() req) {
    const user = req?.user;

    if (!user) {
      throw new UnauthorizedException('Unauthorized');
    }

    const existingUser = this.userRepository.findOneBy({
      userName: user?.userName,
    });

    if (!existingUser) {
      throw new UnauthorizedException('Unauthorized');
    }

    return existingUser;
  }

  async validateUser(userName: string, password: string) {
    const user = await this.userRepository.findOneBy({ userName });

    if (!user) {
      return null;
    }

    const isPasswordMatched = await bcrypt.compare(password, user.password);
    if (!isPasswordMatched) {
      return null;
    }

    return user;
  }
}
