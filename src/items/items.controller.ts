import { Body, Controller, Delete, Get, Param, Patch, Post } from '@nestjs/common';
import { ItemStatus } from './item-status.enum';
import { Item } from "./item.model";
import { ItemsService } from './items.service';

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

    @Get(':id')
    findById(@Param('id') id: string): Item {
        return this.itemService.findById(id);
    }

    @Post()
    create(
        @Body('id') id: string,
        @Body('name') name: string,
        @Body('price') price: number,
        @Body('description') description: string,
    ): Item {
        const item: Item = {
            id,
            name,
            price,
            description,
            status: ItemStatus.ON_SALE,
        };

        return this.itemService.create(item);
    }

    @Patch(':id')
    updateStatus(@Param('id') id: string): Item {
        return this.itemService.updateStatus(id);
    }

    @Delete(':id')
    delete(@Param('id') id: string): void {
        this.itemService.delete(id);
    }
}
