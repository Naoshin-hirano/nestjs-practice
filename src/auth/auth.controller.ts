import { Body, Controller, Post } from '@nestjs/common';
import { User } from '../entities/user.entity';
import { AuthService } from './auth.service';
import { CreateUserDto } from './dto/create.user.dto';
import { CredentialsDto } from './dto/credentials.dto';

@Controller('auth')
export class AuthController {
    constructor(private readonly authService: AuthService) { }

    // dtoのおかげで@Body('id') id: string,などとする必要がなくなる
    @Post('signup')
    async signup(@Body() createUserDto: CreateUserDto): Promise<User> {
        return await this.authService.signUp(createUserDto);
    }

    @Post('signin')
    async signin(
        @Body() credentialsDto: CredentialsDto,
    ): Promise<{ accessToken: string }> {
        return await this.authService.signIn(credentialsDto);
    }
}
