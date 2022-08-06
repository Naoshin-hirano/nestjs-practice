import { Item } from "../entities/item.entity";
import { CreateItemDto } from "./dto/create-item.dto";
import { EntityRepository, Repository } from "typeorm";
import { ItemStatus } from "./item-status.enum";
import { User } from "../entities/user.entity";

// Itemエンティティ(モデル)とつなげる
@EntityRepository(Item)
export class ItemRepository extends Repository<Item> {
    async createItem(createItemDto: CreateItemDto, user: User): Promise<Item> {
        const { name, price, description } = createItemDto;
        // Repository用オブジェクト生成
        const item = this.create({
            name,
            price,
            description,
            status: ItemStatus.ON_SALE,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
            user,
        });
        // このレポジトリにオブジェクト保存
        await this.save(item);

        return item;
    };
}