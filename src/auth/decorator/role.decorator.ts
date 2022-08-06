import { SetMetadata } from "@nestjs/common";

// 認可が必要なRoleを受け取りMetaデータに登録する
export const Role = (...statuses: string[]) =>
    SetMetadata('statuses', statuses);