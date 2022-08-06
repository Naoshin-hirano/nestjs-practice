import { createParamDecorator, ExecutionContext } from "@nestjs/common";

// ExecutinoContext: 実行中の一連の処理の全ての情報を含んでいる
// createParamDecorator: custom decoratorの作成
export const GetUser = createParamDecorator((_, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest();
    return request.user;
});