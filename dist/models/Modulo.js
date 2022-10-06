"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const sequelize_1 = require("sequelize");
const connection_1 = __importDefault(require("../database/connection"));
const Modulos = connection_1.default.define('Modulos', {
    nombre: {
        type: sequelize_1.DataTypes.STRING
    },
    enlace: {
        type: sequelize_1.DataTypes.STRING
    },
    clase: {
        type: sequelize_1.DataTypes.STRING
    },
    estado: {
        type: sequelize_1.DataTypes.NUMBER,
    },
    created_by: {
        type: sequelize_1.DataTypes.NUMBER,
    },
}, {
    tableName: 'modulos'
});
exports.default = Modulos;
//# sourceMappingURL=Modulo.js.map