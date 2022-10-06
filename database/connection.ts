require("dotenv").config();
import { Sequelize } from 'sequelize';

const host = process.env.HOST || "localhost";
const database_name = process.env.DATABASE || "";
const user_name = process.env.USER || "";
const password = process.env.PASSWORD || "";

const database = new Sequelize( database_name, user_name, password, {
	host: host,
	dialect: 'mysql',
	// logging: false,
} );

export default database;