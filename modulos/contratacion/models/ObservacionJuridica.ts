import database from "../../../database/connection";
import { DataTypes } from "sequelize";

const ObservacionJuridica = database.define('ObservacionJuridica', {
	precontractual_id: {
		type: DataTypes.STRING,
	},
	observaciones: {
		type: DataTypes.STRING,
	},
	created_by: {
		type: DataTypes.NUMBER,
	},
}, {
	tableName: 'contratacion_observaciones_juridica'
});

export default ObservacionJuridica;