"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
exports.__esModule = true;
exports.ChatService = void 0;
var common_1 = require("@nestjs/common");
var typeorm_1 = require("@nestjs/typeorm");
var users_entity_1 = require("../../../../../../../../src/users/models/users.entity");
var conversation_entity_1 = require("./models/conversation.entity");
var messages_entity_1 = require("./models/messages.entity");
var participants_entity_1 = require("./models/participants.entity");
var ChatService = /** @class */ (function () {
    function ChatService(userRepository, conversationRepository, messageRepository, participantsRepository) {
        this.userRepository = userRepository;
        this.conversationRepository = conversationRepository;
        this.messageRepository = messageRepository;
        this.participantsRepository = participantsRepository;
    }
    ChatService.prototype.addNewMassageBetweenTwoUsers = function (data) {
        return __awaiter(this, void 0, void 0, function () {
            var sender_id, receiver_id, content, conservationExistBetweenSR, sender_1;
            var _this = this;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        sender_id = data.sender_id, receiver_id = data.receiver_id, content = data.content;
                        return [4 /*yield*/, this.participantsRepository
                                .createQueryBuilder('p')
                                .leftJoinAndSelect('p.conversation', 'c')
                                .where('c.creatorId = :c1 AND p.userId = :p2', {
                                //conversation is created by c1, or participated by p2
                                c1: sender_id,
                                p2: receiver_id
                            })
                                .orWhere('c.creatorId = :c2 AND p.userId = :p1', {
                                c2: receiver_id,
                                p1: sender_id
                            })
                                .getMany()];
                    case 1:
                        conservationExistBetweenSR = _a.sent();
                        if (!(conservationExistBetweenSR.length >= 2)) return [3 /*break*/, 3];
                        return [4 /*yield*/, this.userRepository.findOne(sender_id)];
                    case 2:
                        sender_1 = _a.sent();
                        conservationExistBetweenSR.map(function (c) { return __awaiter(_this, void 0, void 0, function () {
                            var conversation_id, message;
                            return __generator(this, function (_a) {
                                switch (_a.label) {
                                    case 0:
                                        conversation_id = c.conversation.id;
                                        message = this.messageRepository.create({
                                            sender: sender_1,
                                            content: content,
                                            conversation: { id: conversation_id }
                                        });
                                        return [4 /*yield*/, this.messageRepository.save(message)];
                                    case 1:
                                        _a.sent();
                                        return [2 /*return*/];
                                }
                            });
                        }); });
                        _a.label = 3;
                    case 3: return [2 /*return*/, conservationExistBetweenSR];
                }
            });
        });
    };
    ChatService.prototype.getAllConversation = function (userId, page) {
        if (page === void 0) { page = Number(10); }
        return __awaiter(this, void 0, void 0, function () {
            var limit, offset;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        limit = 10;
                        offset = limit * page - limit;
                        return [4 /*yield*/, this.conversationRepository
                                .createQueryBuilder('c')
                                .leftJoinAndSelect('c.creator', 'u')
                                .leftJoinAndSelect('c.participants', 'p')
                                .leftJoinAndSelect('p.user', 'u2')
                                .leftJoinAndSelect('c.messages', 'm')
                                .leftJoinAndSelect('m.sender', 'sender')
                                .select([
                                'c',
                                'u.id',
                                'u.name',
                                'p',
                                'u2.id',
                                'u2.name',
                                'u2.is_active',
                                'm',
                                'm.id',
                                'm.content',
                                'm.updated_at',
                                'sender.id',
                                'sender.name',
                            ])
                                .where('c.creator = :id', { id: userId })
                                .andWhere('u2.id != :id', { id: userId })
                                // .limit(limit)
                                // .offset(offset)
                                .orderBy('m.updated_at', 'ASC')
                                .getMany()];
                    case 1: return [2 /*return*/, _a.sent()];
                }
            });
        });
    };
    ChatService = __decorate([
        (0, common_1.Injectable)(),
        __param(0, (0, typeorm_1.InjectRepository)(users_entity_1.Users)),
        __param(1, (0, typeorm_1.InjectRepository)(conversation_entity_1.Conversation)),
        __param(2, (0, typeorm_1.InjectRepository)(messages_entity_1.Message)),
        __param(3, (0, typeorm_1.InjectRepository)(participants_entity_1.Participants))
    ], ChatService);
    return ChatService;
}());
exports.ChatService = ChatService;
