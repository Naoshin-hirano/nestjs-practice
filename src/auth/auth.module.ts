import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { JwtAuthGuard } from './guards/jwt-auth.guard';
import { RolesGuard } from './guards/roles.guard';
import { JwtStrategy } from './jwt.strategy';
import { UserRepository } from './user.repository';

@Module({
    imports: [
        // レポジトリへの接続
        TypeOrmModule.forFeature([UserRepository]),
        // JwtによるPassport使用可能になる
        PassportModule.register({ defaultStrategy: 'jwt' }),
        // Jwtへの接続
        JwtModule.register({
            secret: 'secretKey123',
            signOptions: {
                expiresIn: 3600
            },
        }),
    ],
    controllers: [AuthController],
    // @Injectable()がついているclass
    providers: [AuthService, JwtStrategy, JwtAuthGuard, RolesGuard],
    // itemでも使いたいためexportsする
    exports: [JwtStrategy, JwtAuthGuard, RolesGuard]
})
export class AuthModule { }
