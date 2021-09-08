"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
exports.__esModule = true;
exports.ConnectedUser = void 0;
var users_entity_1 = require("../../../../../../../../../src/users/models/users.entity");
var typeorm_1 = require("typeorm");
var ConnectedUser = /** @class */ (function () {
    function ConnectedUser() {
    }
    __decorate([
        (0, typeorm_1.PrimaryGeneratedColumn)()
    ], ConnectedUser.prototype, "id");
    __decorate([
        (0, typeorm_1.Column)()
    ], ConnectedUser.prototype, "socketId");
    __decorate([
        (0, typeorm_1.ManyToOne)(function () { return users_entity_1.Users; }, function (user) { return user.connections; })
    ], ConnectedUser.prototype, "user");
    ConnectedUser = __decorate([
        (0, typeorm_1.Entity)()
    ], ConnectedUser);
    return ConnectedUser;
}());
exports.ConnectedUser = ConnectedUser;
