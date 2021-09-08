"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
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
exports.SocketGateway = void 0;
var websockets_1 = require("@nestjs/websockets");
var common_1 = require("@nestjs/common");
var auth_service_1 = require("../../../../../../../../src/auth/auth.service");
var users_service_1 = require("../../../../../../../../src/users/users.service");
var chat_service_1 = require("../../../../../../../../src/chat/chat.service");
var connected_service_service_1 = require("../../../../../../../../src/chat/connected-service.service");
var options = {
    cors: {
        origin: [
            'http://localhost:3000',
            'https://vigorous-kilby-91cb1f.netlify.app',
        ],
        methods: ['GET', 'POST'],
        credentials: true
    }
};
var SocketGateway = /** @class */ (function () {
    function SocketGateway(authService, userService, chatService, connectedUserService) {
        this.authService = authService;
        this.userService = userService;
        this.chatService = chatService;
        this.connectedUserService = connectedUserService;
        this.logger = new common_1.Logger('AppGateway');
    }
    SocketGateway.prototype.afterInit = function () {
        this.logger.log('Init');
    };
    SocketGateway.prototype.handleConnection = function (socket) {
        var args = [];
        for (var _i = 1; _i < arguments.length; _i++) {
            args[_i - 1] = arguments[_i];
        }
        return __awaiter(this, void 0, void 0, function () {
            var token, decodedToken, _a;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        _b.trys.push([0, 5, , 6]);
                        token = socket.handshake.headers.cookie.split('=')[1];
                        return [4 /*yield*/, this.authService.verifyToken(token)];
                    case 1:
                        decodedToken = _b.sent();
                        this.logger.log("socket connected: " + socket.id + " token: " + token.slice(0, 20) + "...");
                        if (!!decodedToken) return [3 /*break*/, 2];
                        return [2 /*return*/, this.disconnect(socket)];
                    case 2: return [4 /*yield*/, this.connectedUserService.setOnline({
                            socketId: socket.id,
                            userId: decodedToken.id
                        })];
                    case 3:
                        _b.sent();
                        _b.label = 4;
                    case 4: return [3 /*break*/, 6];
                    case 5:
                        _a = _b.sent();
                        return [2 /*return*/, this.disconnect(socket)];
                    case 6: return [2 /*return*/];
                }
            });
        });
    };
    SocketGateway.prototype.disconnect = function (socket) {
        socket.emit('Error', new common_1.UnauthorizedException());
        socket.disconnect();
    };
    SocketGateway.prototype.handleDisconnect = function (socket) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        this.logger.log("socket disconnected: " + socket.id);
                        return [4 /*yield*/, this.connectedUserService.setOffline(socket.id)];
                    case 1:
                        _a.sent();
                        socket.disconnect();
                        return [2 /*return*/];
                }
            });
        });
    };
    SocketGateway.prototype.getAllConversation = function (socket, payload) {
        return __awaiter(this, void 0, void 0, function () {
            var d;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.chatService.getAllConversation(payload.userID, payload.page)];
                    case 1:
                        d = _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    SocketGateway.prototype.getAllConversationImmediate = function (socket, payload) {
        return __awaiter(this, void 0, void 0, function () {
            var d;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.chatService.getAllConversation(payload.userID, payload.page)];
                    case 1:
                        d = _a.sent();
                        socket.emit('get-all-conversations-immediate', d);
                        return [2 /*return*/];
                }
            });
        });
    };
    SocketGateway.prototype.handleSendMessage = function (socket, payload) {
        return __awaiter(this, void 0, void 0, function () {
            var d;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.chatService.addNewMassageBetweenTwoUsers(payload)];
                    case 1:
                        d = _a.sent();
                        socket.emit('send-message', d);
                        return [2 /*return*/];
                }
            });
        });
    };
    SocketGateway.prototype.handleOnNewMessage = function (socket, payload) {
        return __awaiter(this, void 0, void 0, function () {
            var _this = this;
            return __generator(this, function (_a) {
                payload.user_list.map(function (u_id) { return __awaiter(_this, void 0, void 0, function () {
                    var tobe_send, d;
                    var _a;
                    return __generator(this, function (_b) {
                        switch (_b.label) {
                            case 0: return [4 /*yield*/, this.connectedUserService.getSocketOfOnlineUser(u_id)];
                            case 1:
                                tobe_send = _b.sent();
                                if (!((_a = tobe_send === null || tobe_send === void 0 ? void 0 : tobe_send.user) === null || _a === void 0 ? void 0 : _a.id)) return [3 /*break*/, 3];
                                return [4 /*yield*/, this.chatService.getAllConversation(tobe_send.user.id, 1)];
                            case 2:
                                d = _b.sent();
                                this.server.to(tobe_send.socketId).emit('notify-all-on-new-message', d);
                                _b.label = 3;
                            case 3: return [2 /*return*/];
                        }
                    });
                }); });
                return [2 /*return*/];
            });
        });
    };
    __decorate([
        (0, websockets_1.WebSocketServer)()
    ], SocketGateway.prototype, "server");
    __decorate([
        (0, websockets_1.SubscribeMessage)('get-all-conversations')
    ], SocketGateway.prototype, "getAllConversation");
    __decorate([
        (0, websockets_1.SubscribeMessage)('get-all-conversations-immediate')
    ], SocketGateway.prototype, "getAllConversationImmediate");
    __decorate([
        (0, websockets_1.SubscribeMessage)('send-message')
    ], SocketGateway.prototype, "handleSendMessage");
    __decorate([
        (0, websockets_1.SubscribeMessage)('notify-all-on-new-message')
    ], SocketGateway.prototype, "handleOnNewMessage");
    SocketGateway = __decorate([
        (0, websockets_1.WebSocketGateway)(options)
    ], SocketGateway);
    return SocketGateway;
}());
exports.SocketGateway = SocketGateway;
