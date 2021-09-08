"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
exports.__esModule = true;
exports.Message = void 0;
var typeorm_1 = require("typeorm");
var users_entity_1 = require("../../users/models/users.entity");
var conversation_entity_1 = require("./conversation.entity");
var Message = /** @class */ (function () {
    function Message() {
    }
    __decorate([
        (0, typeorm_1.PrimaryGeneratedColumn)('uuid')
    ], Message.prototype, "id");
    __decorate([
        (0, typeorm_1.Column)({ nullable: true })
    ], Message.prototype, "content");
    __decorate([
        (0, typeorm_1.ManyToOne)(function () { return users_entity_1.Users; }, function (user) { return user.conversations; }, {
            onDelete: 'CASCADE',
            onUpdate: 'CASCADE'
        })
    ], Message.prototype, "sender");
    __decorate([
        (0, typeorm_1.ManyToOne)(function () { return conversation_entity_1.Conversation; }, function (con) { return con.participants; }, {
            onDelete: 'CASCADE',
            onUpdate: 'CASCADE'
        })
    ], Message.prototype, "conversation");
    __decorate([
        (0, typeorm_1.CreateDateColumn)({
            type: 'timestamp',
            "default": function () { return 'CURRENT_TIMESTAMP(6)'; }
        })
    ], Message.prototype, "created_at");
    __decorate([
        (0, typeorm_1.UpdateDateColumn)({
            type: 'timestamp',
            "default": function () { return 'CURRENT_TIMESTAMP(6)'; },
            onUpdate: 'CURRENT_TIMESTAMP(6)'
        })
    ], Message.prototype, "updated_at");
    Message = __decorate([
        (0, typeorm_1.Entity)()
    ], Message);
    return Message;
}());
exports.Message = Message;
