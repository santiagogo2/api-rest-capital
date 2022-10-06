import database from "../../../database/connection";
import { DataTypes } from "sequelize";

// Modelos
import ObservacionJuridica from "./ObservacionJuridica";
import Documentacion from "./Documentacion";
import Presupuesto from "./Presupuesto";

const Precontractual = database.define('Precontractual', {
	primer_nombre: {
		type: DataTypes.STRING,
	},
	segundo_nombre: {
		type: DataTypes.STRING,
	},
	primer_apellido: {
		type: DataTypes.STRING,
	},
	segundo_apellido: {
		type: DataTypes.STRING,
	},
	correo_electronico: {
		type: DataTypes.STRING,
	},
	cargo: {
		type: DataTypes.STRING,
	},
	area_solicitante: {
		type: DataTypes.NUMBER,
	},
	descripcion_solicitud: {
		type: DataTypes.STRING,
	},
	tipo_contrato: {
		type: DataTypes.NUMBER,
	},
	documento_adjunto: {
		type: DataTypes.STRING,
	},
	observaciones_juridica: {
		type: DataTypes.STRING,
	},
	fecha_comite_contratacion: {
		type: DataTypes.DATE,
	},
	estado: {
		type: DataTypes.NUMBER,
	},
	fecha_respuesta: {
		type: DataTypes.DATE,
	},
	created_by: {
		type: DataTypes.NUMBER,
	},
}, {
	tableName: 'contratacion_precontractual'
});

Precontractual.hasMany( ObservacionJuridica, {
	as: 'comentarios_juridica',
	foreignKey: {
		name: 'precontractual_id'
	}
});

Precontractual.hasMany( Documentacion, {
	as: 'documentos',
	foreignKey: {
		name: 'precontractual_id'
	}
});

Precontractual.hasMany( Presupuesto, {
	as: 'presupuesto',
	foreignKey: {
		name: 'precontractual_id'
	}
});

Presupuesto.belongsTo( Precontractual, {
	as: 'solicitud_precontractual',
	foreignKey: {
		name: 'precontractual_id'
	}
});

export default Precontractual;