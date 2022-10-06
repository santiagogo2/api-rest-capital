"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const sequelize_1 = require("sequelize");
const connection_1 = __importDefault(require("../database/connection"));
const Vacunacion = connection_1.default.define('Vacunacion', {
    documento: {
        type: sequelize_1.DataTypes.STRING
    },
    idSolicitudCambio: {
        type: sequelize_1.DataTypes.STRING
    },
    estado: {
        type: sequelize_1.DataTypes.STRING
    },
    mensaje: {
        type: sequelize_1.DataTypes.BOOLEAN,
    }
}, {
    tableName: 'vacunacion'
});
exports.default = Vacunacion;
//# sourceMappingURL=Vacunacion.js.map