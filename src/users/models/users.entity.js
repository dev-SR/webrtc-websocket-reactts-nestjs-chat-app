"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
exports.__esModule = true;
exports.Users = void 0;
var class_transformer_1 = require("class-transformer");
var connected_user_entity_1 = require("../../../../../../../../../src/chat/models/connected-user.entity");
var conversation_entity_1 = require("../../../../../../../../../src/chat/models/conversation.entity");
var messages_entity_1 = require("../../../../../../../../../src/chat/models/messages.entity");
var participants_entity_1 = require("../../../../../../../../../src/chat/models/participants.entity");
var typeorm_1 = require("typeorm");
var Users = /** @class */ (function () {
    function Users() {
    }
    __decorate([
        (0, typeorm_1.PrimaryGeneratedColumn)('uuid')
    ], Users.prototype, "id");
    __decorate([
        (0, typeorm_1.Column)({ unique: true })
    ], Users.prototype, "email");
    __decorate([
        (0, typeorm_1.Column)()
    ], Users.prototype, "name");
    __decorate([
        (0, typeorm_1.Column)({ "default": false })
    ], Users.prototype, "is_active");
    __decorate([
        (0, typeorm_1.Column)(),
        (0, class_transformer_1.Exclude)()
    ], Users.prototype, "password");
    __decorate([
        (0, typeorm_1.OneToMany)(function () { return messages_entity_1.Message; }, function (m) { return m.sender; }, { cascade: true })
    ], Users.prototype, "massages");
    __decorate([
        (0, typeorm_1.OneToMany)(function () { return participants_entity_1.Participants; }, function (m) { return m.user; }, { cascade: true })
    ], Users.prototype, "participant_with");
    __decorate([
        (0, typeorm_1.OneToMany)(function () { return conversation_entity_1.Conversation; }, function (m) { return m.creator; }, { cascade: true })
    ], Users.prototype, "conversations");
    __decorate([
        (0, typeorm_1.OneToMany)(function () { return connected_user_entity_1.ConnectedUser; }, function (connection) { return connection.user; })
    ], Users.prototype, "connections");
    Users = __decorate([
        (0, typeorm_1.Entity)()
    ], Users);
    return Users;
}());
exports.Users = Users;
