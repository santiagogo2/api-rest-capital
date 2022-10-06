"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const connection_1 = __importDefault(require("../../../database/connection"));
const sequelize_1 = require("sequelize");
const Presupuesto = connection_1.default.define('Presupuesto', {
    precontractual_id: {
        type: sequelize_1.DataTypes.NUMBER,
    },
    descripcion: {
        type: sequelize_1.DataTypes.STRING,
    },
    documento: {
        type: sequelize_1.DataTypes.STRING,
    },
    motivo: {
        type: sequelize_1.DataTypes.STRING,
    },
    tipo_certificado: {
        type: sequelize_1.DataTypes.NUMBER,
    },
    estado: {
        type: sequelize_1.DataTypes.NUMBER,
    },
    created_by: {
        type: sequelize_1.DataTypes.NUMBER,
    },
}, {
    tableName: 'contratacion_presupuesto'
});
exports.default = Presupuesto;
//# sourceMappingURL=Presupuesto.js.map