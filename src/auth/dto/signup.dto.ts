import { PartialType } from '@nestjs/mapped-types';
import { SigninDto } from './signin.dto';

export class SignupDto extends PartialType(SigninDto) {}
