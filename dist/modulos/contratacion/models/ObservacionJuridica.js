"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const connection_1 = __importDefault(require("../../../database/connection"));
const sequelize_1 = require("sequelize");
const ObservacionJuridica = connection_1.default.define('ObservacionJuridica', {
    precontractual_id: {
        type: sequelize_1.DataTypes.STRING,
    },
    observaciones: {
        type: sequelize_1.DataTypes.STRING,
    },
    created_by: {
        type: sequelize_1.DataTypes.NUMBER,
    },
}, {
    tableName: 'tbl_contratacion_observaciones_juridica'
});
exports.default = ObservacionJuridica;
//# sourceMappingURL=ObservacionJuridica.js.map