import { Injectable, NotFoundException } from '@nestjs/common';
import { ItemStatus } from './item-status.enum';
import { Item } from "../entities/item.entity";
import { CreateItemDto } from './dto/create-item.dto';
import { ItemRepository } from './item.repository';

@Injectable()
export class ItemsService {
    constructor(private readonly itemRepository: ItemRepository) { }

    private items: Item[] = [];

    async findAll(): Promise<Item[]> {
        // レポジトリ（itemのDBから見つける）
        return await this.itemRepository.find();
    }

    // NotFoundExceptionsは例外処理(形式はuuidだがあてはまるuuidがない)
    async findById(id: string): Promise<Item> {
        const found = await this.itemRepository.findOne(id);
        if (!found) {
            throw new NotFoundException();
        }
        return found;
    }

    async create(createItemDto: CreateItemDto): Promise<Item> {
        return await this.itemRepository.createItem(createItemDto);
    }

    async updateStatus(id: string): Promise<Item> {
        const item = await this.findById(id);
        item.status = ItemStatus.SOLD_OUT;
        item.updatedAt = new Date().toISOString();
        await this.itemRepository.save(item);
        return item;
    }

    async delete(id: string): Promise<void> {
        await this.itemRepository.delete({ id });
    }
}
