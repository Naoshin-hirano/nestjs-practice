import { Body, Controller, Delete, Get, Param, ParseUUIDPipe, Patch, Post } from '@nestjs/common';
import { Item } from "./item.model";
import { ItemsService } from './items.service';
import { CreateItemDto } from './dto/create-item.dto';

@Controller('items')
export class ItemsController {
    // itemServiceを引数にとって初めて成立するclass
    // readonly 一度初期化したら書き直すことができなくする修飾子。読み取り専用。
    // constructor メソッド: classで作成されたオブジェクトの生成と初期化のための特殊なメソッドです。
    constructor(private readonly itemService: ItemsService) { }

    @Get()
    findAll(): Item[] {
        return this.itemService.findAll();
    }

    // uuid形式以外のidははいってきたらレスポンスでバリデーションを返す
    @Get(':id')
    findById(@Param('id', ParseUUIDPipe) id: string): Item {
        return this.itemService.findById(id);
    }

    // dtoのおかげで@Body('id') id: string,などとする必要がなくなる
    @Post()
    create(@Body() CreateItemDto: CreateItemDto): CreateItemDto {
        return this.itemService.create(CreateItemDto);
    }

    @Patch(':id')
    updateStatus(@Param('id', ParseUUIDPipe) id: string): Item {
        return this.itemService.updateStatus(id);
    }

    @Delete(':id')
    delete(@Param('id', ParseUUIDPipe) id: string): void {
        this.itemService.delete(id);
    }
}
