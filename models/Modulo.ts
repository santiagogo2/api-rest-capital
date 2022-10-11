import { DataTypes } from 'sequelize';
import database from '../database/connection';

const Modulos = database.define('Modulos', {
	nombre: {
		type: DataTypes.STRING
	},
	enlace: {
		type: DataTypes.STRING
	},
	clase: {
		type: DataTypes.STRING
	},
	grupo: {
		type: DataTypes.STRING
	},
	estado: {
		type: DataTypes.NUMBER,
	},
	created_by: {
		type: DataTypes.NUMBER,
	},
}, {
	tableName: 'tbl_modulos'
});

export default Modulos;