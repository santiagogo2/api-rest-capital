"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const connection_1 = __importDefault(require("../../../database/connection"));
const sequelize_1 = require("sequelize");
// Modelos
const ObservacionJuridica_1 = __importDefault(require("./ObservacionJuridica"));
const Documentacion_1 = __importDefault(require("./Documentacion"));
const Presupuesto_1 = __importDefault(require("./Presupuesto"));
const Precontractual = connection_1.default.define('Precontractual', {
    primer_nombre: {
        type: sequelize_1.DataTypes.STRING,
    },
    segundo_nombre: {
        type: sequelize_1.DataTypes.STRING,
    },
    primer_apellido: {
        type: sequelize_1.DataTypes.STRING,
    },
    segundo_apellido: {
        type: sequelize_1.DataTypes.STRING,
    },
    correo_electronico: {
        type: sequelize_1.DataTypes.STRING,
    },
    cargo: {
        type: sequelize_1.DataTypes.STRING,
    },
    area_solicitante: {
        type: sequelize_1.DataTypes.NUMBER,
    },
    descripcion_solicitud: {
        type: sequelize_1.DataTypes.STRING,
    },
    tipo_contrato: {
        type: sequelize_1.DataTypes.NUMBER,
    },
    documento_adjunto: {
        type: sequelize_1.DataTypes.STRING,
    },
    observaciones_juridica: {
        type: sequelize_1.DataTypes.STRING,
    },
    fecha_comite_contratacion: {
        type: sequelize_1.DataTypes.DATE,
    },
    estado: {
        type: sequelize_1.DataTypes.NUMBER,
    },
    fecha_respuesta: {
        type: sequelize_1.DataTypes.DATE,
    },
    created_by: {
        type: sequelize_1.DataTypes.NUMBER,
    },
}, {
    tableName: 'tbl_contratacion_precontractual'
});
Precontractual.hasMany(ObservacionJuridica_1.default, {
    as: 'comentarios_juridica',
    foreignKey: {
        name: 'precontractual_id'
    }
});
Precontractual.hasMany(Documentacion_1.default, {
    as: 'documentos',
    foreignKey: {
        name: 'precontractual_id'
    }
});
Precontractual.hasMany(Presupuesto_1.default, {
    as: 'presupuesto',
    foreignKey: {
        name: 'precontractual_id'
    }
});
Presupuesto_1.default.belongsTo(Precontractual, {
    as: 'solicitud_precontractual',
    foreignKey: {
        name: 'precontractual_id'
    }
});
exports.default = Precontractual;
//# sourceMappingURL=Precontractual.js.map