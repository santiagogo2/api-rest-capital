import database from "../../../database/connection";
import { DataTypes } from "sequelize";

// Modelos
import Presupuesto from "./Presupuesto";

const Documentacion = database.define('Documentacion', {
	precontractual_id: {
		type: DataTypes.NUMBER,
	},
	id_documento: {
		type: DataTypes.NUMBER,
	},
	documento: {
		type: DataTypes.STRING,
	},
	etapa_contractual: {
		type: DataTypes.NUMBER,
	},
	fecha_vigencia: {
		type: DataTypes.STRING,
	},
	observacion: {
		type: DataTypes.STRING,
	},
	estado: {
		type: DataTypes.NUMBER,
	},
	created_by: {
		type: DataTypes.NUMBER,
	},
}, {
	tableName: 'tbl_contratacion_documentacion'
});

export default Documentacion;