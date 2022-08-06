import { Body, ClassSerializerInterceptor, Controller, Delete, Get, Param, ParseUUIDPipe, Patch, Post, UseGuards, UseInterceptors } from '@nestjs/common';
import { Item } from "../entities/item.entity";
import { ItemsService } from './items.service';
import { CreateItemDto } from './dto/create-item.dto';
// items.moduleにAuthModuleをimportしてないと使えない
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { GetUser } from '../auth/decorator/get-user.decorate';
import { User } from '../entities/user.entity';
import { Role } from '../auth/decorator/role.decorator';
import { UserStatus } from '../auth/user-status.enum';
import { RolesGuard } from '../auth/guards/roles.guard';

// UseInterceptors: handlerがレスポンスを返す前にuser.entityでExcludeをつけたパスワードを除外してから最終的なレスポンスとしている
@Controller('items')
@UseInterceptors(ClassSerializerInterceptor)
export class ItemsController {
    // itemServiceを引数にとって初めて成立するclass
    // readonly 一度初期化したら書き直すことができなくする修飾子。読み取り専用。
    // constructor メソッド: classで作成されたオブジェクトの生成と初期化のための特殊なメソッドです。
    // readonly: 読みだけ、追加・編集・削除できない
    constructor(private readonly itemService: ItemsService) { }

    @Get()
    async findAll(): Promise<Item[]> {
        return await this.itemService.findAll();
    }

    // uuid形式以外のidははいってきたらレスポンスでバリデーションを返す
    @Get(':id')
    async findById(@Param('id', ParseUUIDPipe) id: string): Promise<Item> {
        return await this.itemService.findById(id);
    }

    // dtoのおかげで@Body('id') id: string,などとする必要がなくなる
    @Post()
    @Role(UserStatus.PREMIUM)
    @UseGuards(JwtAuthGuard, RolesGuard)
    async create(
        @Body() CreateItemDto: CreateItemDto,
        @GetUser() user: User,
    ): Promise<Item> {
        return await this.itemService.create(CreateItemDto, user);
    }

    @Patch(':id')
    @UseGuards(JwtAuthGuard)
    async updateStatus(
        @Param('id', ParseUUIDPipe) id: string,
        @GetUser() user: User,
    ): Promise<Item> {
        return await this.itemService.updateStatus(id, user);
    }

    @Delete(':id')
    @UseGuards(JwtAuthGuard)
    async delete(
        @Param('id', ParseUUIDPipe) id: string,
        @GetUser() user: User,
    ): Promise<void> {
        await this.itemService.delete(id, user);
    }
}
