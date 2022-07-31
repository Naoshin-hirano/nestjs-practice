import { Body, Controller, Delete, Get, Param, ParseUUIDPipe, Patch, Post } from '@nestjs/common';
import { Item } from "../entities/item.entity";
import { ItemsService } from './items.service';
import { CreateItemDto } from './dto/create-item.dto';

@Controller('items')
export class ItemsController {
    // itemServiceを引数にとって初めて成立するclass
    // readonly 一度初期化したら書き直すことができなくする修飾子。読み取り専用。
    // constructor メソッド: classで作成されたオブジェクトの生成と初期化のための特殊なメソッドです。
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
    async create(@Body() CreateItemDto: CreateItemDto): Promise<Item> {
        return await this.itemService.create(CreateItemDto);
    }

    @Patch(':id')
    async updateStatus(@Param('id', ParseUUIDPipe) id: string): Promise<Item> {
        return await this.itemService.updateStatus(id);
    }

    @Delete(':id')
    async delete(@Param('id', ParseUUIDPipe) id: string): Promise<void> {
        await this.itemService.delete(id);
    }
}
