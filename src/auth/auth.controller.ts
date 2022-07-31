import { Body, Controller, Post } from '@nestjs/common';
import { User } from 'src/entities/user.entity';
import { AuthService } from './auth.service';
import { CreateUserDto } from './dto/create.user.dto';

@Controller('auth')
export class AuthController {
    constructor(private readonly authService: AuthService) { }

    // dtoのおかげで@Body('id') id: string,などとする必要がなくなる
    @Post('signup')
    async signup(@Body() createUserDto: CreateUserDto): Promise<User> {
        return await this.authService.signUp(createUserDto);
    }
}
