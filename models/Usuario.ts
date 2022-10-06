import { DataTypes } from 'sequelize';
import database from '../database/connection';

const Usuario = database.define('Usuario', {
	nombre: {
		type: DataTypes.STRING
	},
	email: {
		type: DataTypes.STRING
	},
	estado: {
		type: DataTypes.BOOLEAN,
	}
}, {
	tableName: 'usuarios'
});

export default Usuario;