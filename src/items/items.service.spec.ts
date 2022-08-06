import { BadRequestException, NotFoundException } from "@nestjs/common";
import { Test } from "@nestjs/testing";
import { UserStatus } from "../auth/user-status.enum";
import { ItemStatus } from "./item-status.enum";
import { ItemRepository } from "./item.repository";
import { ItemsService } from "./items.service";

// 関数のモック
const mockItemRepository = () => ({
    find: jest.fn(),
    findOne: jest.fn(),
    createItem: jest.fn(),
    save: jest.fn(),
    delete: jest.fn(),
});

// Userのモック
const mockUser1 = {
    id: "1",
    username: "test1",
    password: "1234",
    status: UserStatus.PREMIUM,
};
const mockUser2 = {
    id: "2",
    username: "test2",
    password: "1234",
    status: UserStatus.FREE,
}

describe('ItemServiceTest', () => {
    let itemService;
    let itemRepository;

    // モックしたmoduleからitemsのサービスとレポジトリをmockする
    beforeEach(async () => {
        const module = await Test.createTestingModule({
            providers: [
                ItemsService,
                {
                    provide: ItemRepository,
                    useFactory: mockItemRepository,
                },
            ],
        }).compile();

        itemService = module.get<ItemsService>(ItemsService);
        itemRepository = module.get<ItemRepository>(ItemRepository);
    });

    describe('findAll', () => {
        it('正常系', async () => {
            const expected = [];
            // mockResolvedValue(): 引数に返り値を設定できる（無事DBからfindできたことをexpectedを返すことで表現）
            itemRepository.find.mockResolvedValue(expected);
            // serviceからデータ見つける
            const result = await itemService.findAll();

            expect(result).toEqual(expected);
        });
    });

    describe('findById', () => {
        it('正常系', async () => {
            const expected = {
                id: "test-id",
                name: "PC",
                price: 50000,
                description: "",
                status: ItemStatus.SOLD_OUT,
                createAt: "",
                updatedAt: "",
                userId: mockUser1.id,
                user: mockUser1,
            };

            itemRepository.findOne.mockResolvedValue(expected);
            const result = await itemService.findById('test-id');
            expect(result).toEqual(expected);
        });

        it('異常系: 商品が存在しない', async () => {

            itemRepository.findOne.mockResolvedValue(null);
            await expect(itemService.findById('test-id')).rejects.toThrow(
                NotFoundException,
            );
        });
    });

    describe('create', () => {
        it('正常系', async () => {
            const expected = {
                id: "test-id",
                name: "PC",
                price: 50000,
                description: "",
                status: ItemStatus.SOLD_OUT,
                createAt: "",
                updatedAt: "",
                userId: mockUser1.id,
                user: mockUser1,
            };

            itemRepository.createItem.mockResolvedValue(expected);
            const result = await itemService.create(
                { name: 'PC', price: 50000, description: '' },
                mockUser1,
            );
            expect(result).toEqual(expected);
        });
    });

    describe('updateStatus', () => {
        const mockItem = {
            id: "test-id",
            name: "PC",
            price: 50000,
            description: "",
            status: ItemStatus.ON_SALE,
            createAt: "",
            updatedAt: "",
            userId: mockUser1.id,
            user: mockUser1,
        };
        it('正常系', async () => {
            itemRepository.findOne.mockResolvedValue(mockItem);
            await itemService.updateStatus('test-id', mockUser2);
            expect(itemRepository.save).toHaveBeenCalled();
        });

        it('異常系: 自身の商品を購入できません', async () => {
            itemRepository.findOne.mockResolvedValue(mockItem);
            await expect(
                itemService.updateStatus('test-id', mockUser1),
            ).rejects.toThrow(BadRequestException);
        });
    });

    describe('delete', () => {
        const mockItem = {
            id: "test-id",
            name: "PC",
            price: 50000,
            description: "",
            status: ItemStatus.ON_SALE,
            createAt: "",
            updatedAt: "",
            userId: mockUser1.id,
            user: mockUser1,
        };
        it('正常系', async () => {
            itemRepository.findOne.mockResolvedValue(mockItem);
            await itemService.delete('test-id', mockUser1);
            expect(itemRepository.delete).toHaveBeenCalled();
        });

        it('異常系: 他人の商品は削除できません', async () => {
            itemRepository.findOne.mockResolvedValue(mockItem);
            await expect(
                itemService.delete('test-id', mockUser2),
            ).rejects.toThrow(BadRequestException);
        });
    });
});