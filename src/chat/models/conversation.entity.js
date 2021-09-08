"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
exports.__esModule = true;
exports.Conversation = void 0;
var typeorm_1 = require("typeorm");
var users_entity_1 = require("../../users/models/users.entity");
var messages_entity_1 = require("./messages.entity");
var participants_entity_1 = require("./participants.entity");
var Conversation = /** @class */ (function () {
    function Conversation() {
    }
    __decorate([
        (0, typeorm_1.PrimaryGeneratedColumn)('uuid')
    ], Conversation.prototype, "id");
    __decorate([
        (0, typeorm_1.ManyToOne)(function () { return users_entity_1.Users; }, function (user) { return user.conversations; }, {
            onDelete: 'CASCADE',
            onUpdate: 'CASCADE'
        })
    ], Conversation.prototype, "creator");
    __decorate([
        (0, typeorm_1.OneToMany)(function () { return participants_entity_1.Participants; }, function (p) { return p.conversation; }, { cascade: true })
    ], Conversation.prototype, "participants");
    __decorate([
        (0, typeorm_1.OneToMany)(function () { return messages_entity_1.Message; }, function (m) { return m.conversation; }, { cascade: true })
    ], Conversation.prototype, "messages");
    __decorate([
        (0, typeorm_1.CreateDateColumn)({
            type: 'timestamp',
            "default": function () { return 'CURRENT_TIMESTAMP(6)'; }
        })
    ], Conversation.prototype, "created_at");
    __decorate([
        (0, typeorm_1.UpdateDateColumn)({
            type: 'timestamp',
            "default": function () { return 'CURRENT_TIMESTAMP(6)'; },
            onUpdate: 'CURRENT_TIMESTAMP(6)'
        })
    ], Conversation.prototype, "updated_at");
    Conversation = __decorate([
        (0, typeorm_1.Entity)()
    ], Conversation);
    return Conversation;
}());
exports.Conversation = Conversation;
