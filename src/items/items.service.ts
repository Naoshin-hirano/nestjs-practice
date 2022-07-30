import { Injectable, NotFoundException } from '@nestjs/common';
import { ItemStatus } from './item-status.enum';
import { Item } from "./item.model";
import { CreateItemDto } from './dto/create-item.dto';
import { v4 as uuid } from 'uuid';

@Injectable()
export class ItemsService {
    private items: Item[] = [];

    findAll(): Item[] {
        return this.items
    }

    // NotFoundExceptionsは例外処理(形式はuuidだがあてはまるuuidがない)
    findById(id: string): Item {
        const found = this.items.find((item) => item.id === id);
        if (!found) {
            throw new NotFoundException();
        }
        return found;
    }

    // id: uuidによる自動採番
    create(CreateItemDto: CreateItemDto): Item {
        const item: Item = {
            id: uuid(),
            ...CreateItemDto,
            status: ItemStatus.ON_SALE
        }
        this.items.push(item);
        return item
    }

    updateStatus(id: string): Item {
        const item = this.findById(id);
        item.status = ItemStatus.SOLD_OUT;
        return item;
    }

    delete(id: string): void {
        this.items = this.items.filter((item) => item.id !== id);
    }
}
