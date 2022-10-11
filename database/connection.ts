require("dotenv").config();
import { Sequelize } from 'sequelize';

const host = process.env.HOST_SQL_SERVER || "localhost";
const database_name = process.env.DATABASE_SQL_SERVER || "";
const user_name = process.env.USER_SQL_SERVER || "";
const password = process.env.PASSWORD_SQL_SERVER || "";

// Para conexiones a mysql
const database_mysql = new Sequelize( database_name, user_name, password, {
	host: host,
	dialect: 'mysql',
	// logging: false,	
} );

// Para conexiones a SQL Server
const database_sqlserver = new Sequelize( database_name, user_name, password, {
	host: host,
	dialect: 'mssql',
	dialectOptions: {
		options: {
			encrypt: false,
    		trustServerCertificate: true,
		}
	},
	logging: false,	
});

export default database_sqlserver;