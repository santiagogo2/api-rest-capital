import database from "../../../database/connection";
import { DataTypes } from "sequelize";

// Modelos
import Documentacion from "./Documentacion";

const Presupuesto = database.define('Presupuesto', {
	precontractual_id: {
		type: DataTypes.NUMBER,
	},
	descripcion: {
		type: DataTypes.STRING,
	},
	documento: {
		type: DataTypes.STRING,
	},
	motivo: {
		type: DataTypes.STRING,
	},
	tipo_certificado: {
		type: DataTypes.NUMBER,
	},
	estado: {
		type: DataTypes.NUMBER,
	},
	created_by: {
		type: DataTypes.NUMBER,
	},
}, {
	tableName: 'contratacion_presupuesto'
});

export default Presupuesto;