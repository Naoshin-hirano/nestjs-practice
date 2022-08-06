import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { ItemStatus } from './item-status.enum';
import { Item } from "../entities/item.entity";
import { CreateItemDto } from './dto/create-item.dto';
// items.moduleにてitemRepositoryの接続をしているので使える
import { ItemRepository } from './item.repository';
import { User } from '../entities/user.entity';

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

    async create(createItemDto: CreateItemDto, user: User): Promise<Item> {
        return await this.itemRepository.createItem(createItemDto, user);
    }

    async updateStatus(id: string, user: User): Promise<Item> {
        const item = await this.findById(id);
        if (item.userId === user.id) {
            throw new BadRequestException("自身の商品を購入できません");
        }
        item.status = ItemStatus.SOLD_OUT;
        item.updatedAt = new Date().toISOString();
        await this.itemRepository.save(item);
        return item;
    }

    async delete(id: string, user: User): Promise<void> {
        // 削除する投稿
        const item = await this.findById(id);
        if (item.userId !== user.id) {
            throw new BadRequestException("他人の商品は削除できません");
        }
        await this.itemRepository.delete({ id });
    }
}
