"use strict";
exports.__esModule = true;
exports.GetCurrentUser = void 0;
var common_1 = require("@nestjs/common");
exports.GetCurrentUser = (0, common_1.createParamDecorator)(function (data, ctx) {
    var req = ctx.switchToHttp().getRequest();
    return req.user;
});
