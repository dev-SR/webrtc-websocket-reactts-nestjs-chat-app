"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
exports.__esModule = true;
exports.ChatModule = void 0;
var common_1 = require("@nestjs/common");
var typeorm_1 = require("@nestjs/typeorm");
var conversation_entity_1 = require("./models/conversation.entity");
var messages_entity_1 = require("./models/messages.entity");
var participants_entity_1 = require("./models/participants.entity");
var chat_service_1 = require("./chat.service");
var users_entity_1 = require("../../../../../../../../src/users/models/users.entity");
var connected_user_entity_1 = require("./models/connected-user.entity");
var connected_service_service_1 = require("./connected-service.service");
var ChatModule = /** @class */ (function () {
    function ChatModule() {
    }
    ChatModule = __decorate([
        (0, common_1.Module)({
            imports: [
                typeorm_1.TypeOrmModule.forFeature([
                    conversation_entity_1.Conversation,
                    messages_entity_1.Message,
                    participants_entity_1.Participants,
                    users_entity_1.Users,
                    connected_user_entity_1.ConnectedUser,
                ]),
            ],
            providers: [chat_service_1.ChatService, connected_service_service_1.ConnectedUserService],
            exports: [chat_service_1.ChatService, connected_service_service_1.ConnectedUserService]
        })
    ], ChatModule);
    return ChatModule;
}());
exports.ChatModule = ChatModule;
