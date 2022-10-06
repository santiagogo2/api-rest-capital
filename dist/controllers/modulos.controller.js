"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.obtenerModulosActivos = void 0;
const Modulo_1 = __importDefault(require("../models/Modulo"));
/**
 * Obtiene los Módulos activos en el sistema
 * @name		obtenerModulosActivos
 * @author		Santiago Ramirez Gaitan <santiagooo42@gmail.com>
 * @version		1.0.0
 * @access		public
 *
 * @param 		{Request} req
 * @param 		{Response} res
 *
 * @returns
*/
const obtenerModulosActivos = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    let data = {};
    try {
        const modulos = yield Modulo_1.default.findAll({
            where: {
                estado: 1
            },
            order: [
                ['nombre', 'DESC']
            ]
        });
        if (modulos) {
            data = {
                code: 200,
                status: 'success',
                modulos
            };
        }
        else {
            data = {
                code: 404,
                status: 'error',
                message: 'No se han encontrado modulos activos en el sistema'
            };
        }
    }
    catch (error) {
        console.log(error);
        data = {
            code: 500,
            status: 'error',
            message: 'Ha ocurrido un error en el servidor, pongase en contacto con el administrador',
            error
        };
    }
    // Devolver la respuesta
    res.status(data.code).json(data);
});
exports.obtenerModulosActivos = obtenerModulosActivos;
//# sourceMappingURL=modulos.controller.js.map