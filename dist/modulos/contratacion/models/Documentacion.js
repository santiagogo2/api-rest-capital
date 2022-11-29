"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const connection_1 = __importDefault(require("../../../database/connection"));
const sequelize_1 = require("sequelize");
const Documentacion = connection_1.default.define('Documentacion', {
    precontractual_id: {
        type: sequelize_1.DataTypes.NUMBER,
    },
    id_documento: {
        type: sequelize_1.DataTypes.NUMBER,
    },
    documento: {
        type: sequelize_1.DataTypes.STRING,
    },
    etapa_contractual: {
        type: sequelize_1.DataTypes.NUMBER,
    },
    fecha_vigencia: {
        type: sequelize_1.DataTypes.STRING,
    },
    observacion: {
        type: sequelize_1.DataTypes.STRING,
    },
    estado: {
        type: sequelize_1.DataTypes.NUMBER,
    },
    created_by: {
        type: sequelize_1.DataTypes.NUMBER,
    },
}, {
    tableName: 'tbl_contratacion_documentacion'
});
exports.default = Documentacion;
//# sourceMappingURL=Documentacion.js.map