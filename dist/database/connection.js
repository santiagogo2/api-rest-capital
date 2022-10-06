"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
require("dotenv").config();
const sequelize_1 = require("sequelize");
const host = process.env.HOST || "localhost";
const database_name = process.env.DATABASE || "";
const user_name = process.env.USER || "";
const password = process.env.PASSWORD || "";
const database = new sequelize_1.Sequelize(database_name, user_name, password, {
    host: host,
    dialect: 'mysql',
    // logging: false,
});
exports.default = database;
//# sourceMappingURL=connection.js.map