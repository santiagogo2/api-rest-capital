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
exports.obtenerSolicitudesPrecontractualesPorUsuario = exports.obtenerSolicitudesPrecontractuales = exports.obtenerSolicitudesJuridica = exports.obtenerSolicitudesActivas = exports.obtenerSolicitud = exports.eliminarSolicitudPrecontractual = exports.crearSolicitudPrecontractual = exports.actualizarSolicitudPrecontractual = exports.actualizarEstadoSolicitudPrecontractual = void 0;
const sequelize_1 = require("sequelize");
const fs_1 = __importDefault(require("fs"));
// Importar funciones
const nodemailer_controller_1 = require("../../../controllers/nodemailer.controller");
// Modelos
const Documentacion_1 = __importDefault(require("../models/Documentacion"));
const ObservacionJuridica_1 = __importDefault(require("../models/ObservacionJuridica"));
const Precontractual_1 = __importDefault(require("../models/Precontractual"));
const Presupuesto_1 = __importDefault(require("../models/Presupuesto"));
/**
 * Controlador que actualiza el estado de una solicitud precontractual por el número de consecutivo
 * @name		actualizarEstadoSolicitudPrecontractual
 * @author		Santiago Ramirez Gaitan <santiagooo42@gmail.com>
 * @version		1.0.0
 * @access		public
 *
 * @param 		{Request} req
 * @param 		{Response} res
 *
 * @returns
*/
const actualizarEstadoSolicitudPrecontractual = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    let data = {};
    const { id } = req.params;
    const { estado } = req.params;
    const { body } = req;
    try {
        const precontractual = yield Precontractual_1.default.findByPk(id);
        if (precontractual) {
            // Eliminar los campos que no se desean actualizar
            delete (body.id);
            delete (body.created_by);
            delete (body.createdAt);
            delete (body.updatedAt);
            yield precontractual.update({ estado: estado });
            // Enviar un correo de notificación al usuario
            (0, nodemailer_controller_1.enviarCorreoElectronicoContratacion)(precontractual === null || precontractual === void 0 ? void 0 : precontractual.getDataValue('correo_electronico'), `Actualización de la Solicitud ${id}`, null, `El estado de la solicitud con número de consecutivo ${id} ha sido actualizado. Por favor, ingrese al aplicativo y revise los cambios realizados`)
                .then(resp => {
                console.log(resp);
            })
                .catch(err => {
                console.log(err);
            });
            data = {
                code: 200,
                status: 'success',
                message: 'Se ha actualizado el estado de la solicitud con el número de consecutivo ' + id,
                precontractual
            };
        }
        else {
            data = {
                code: 404,
                status: 'error',
                message: 'No existe una solicitud precontractual con el número de consecutivo ' + id
            };
        }
    }
    catch (error) {
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
exports.actualizarEstadoSolicitudPrecontractual = actualizarEstadoSolicitudPrecontractual;
/**
 * Controlador que actualiza una solicitud precontractual por el número de consecutivo
 * @name		actualizarSolicitudPrecontractual
 * @author		Santiago Ramirez Gaitan <santiagooo42@gmail.com>
 * @version		1.0.0
 * @access		public
 *
 * @param 		{Request} req
 * @param 		{Response} res
 *
 * @returns
*/
const actualizarSolicitudPrecontractual = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    let data = {};
    const { id } = req.params;
    const { body } = req;
    try {
        const precontractual = yield Precontractual_1.default.findByPk(id);
        if (precontractual) {
            // Validar si el documento anterior es igual al enviado en la petición
            const documento_anterior = precontractual === null || precontractual === void 0 ? void 0 : precontractual.getDataValue('documento_adjunto');
            if (documento_anterior && documento_anterior != body.documento_adjunto) {
                const path = `./uploads/contratacion/${documento_anterior}`;
                yield fs_1.default.unlink(path, error => {
                    if (error) {
                        data = {
                            code: 500,
                            status: 'error',
                            message: 'No ha sido posible eliminar el documento cargado anteriormente',
                            error
                        };
                        res.status(data.code).json(data);
                    }
                });
            }
            // Si el estado es devuelto se actualiza a nuevo para que pueda ser visto por el área de jurídica
            if ((precontractual === null || precontractual === void 0 ? void 0 : precontractual.getDataValue('estado')) == '4') {
                body.estado = 1;
            }
            // Eliminar los campos que no se desean actualizar
            delete (body.id);
            delete (body.fecha_solicitud);
            delete (body.fecha_respuesta);
            delete (body.created_by);
            delete (body.createdAt);
            delete (body.updatedAt);
            yield precontractual.update(body);
            // Enviar un correo de notificación al usuario
            (0, nodemailer_controller_1.enviarCorreoElectronicoContratacion)(precontractual === null || precontractual === void 0 ? void 0 : precontractual.getDataValue('correo_electronico'), `Actualización de la Solicitud ${id}`, null, `La solicitud con número de consecutivo ${id} ha sido actualizada. Por favor, ingrese al aplicativo y revise los cambios realizados`)
                .then(resp => {
                console.log(resp);
            })
                .catch(err => {
                console.log(err);
            });
            data = {
                code: 200,
                status: 'success',
                message: 'Se ha actualizado la solicitud precontractual con el número de consecutivo ' + id,
                precontractual
            };
        }
        else {
            data = {
                code: 404,
                status: 'error',
                message: 'No existe una solicitud precontractual con el número de consecutivo ' + id
            };
        }
    }
    catch (error) {
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
exports.actualizarSolicitudPrecontractual = actualizarSolicitudPrecontractual;
/**
 * Controlador que crea una nueva solicitud precontractual en el sistema
 * @name		crearSolicitudPrecontractual
 * @author		Santiago Ramirez Gaitan <santiagooo42@gmail.com>
 * @version		1.0.0
 * @access		public
 *
 * @param 		{Request} req
 * @param 		{Response} res
 *
 * @returns
*/
const crearSolicitudPrecontractual = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    let data = {};
    const { body } = req;
    try {
        // Asignar el valor de creado al estado: 1
        body.estado = 1;
        // Guardar el usuario logueado como creador del registro
        body.created_by = 1;
        const precontractual = Precontractual_1.default.build(body);
        yield precontractual.save();
        // Enviar un correo de notificación al usuario
        (0, nodemailer_controller_1.enviarCorreoElectronicoContratacion)(precontractual === null || precontractual === void 0 ? void 0 : precontractual.getDataValue('correo_electronico'), 'Solcitud de contrato', precontractual.getDataValue('createdAt'), `Se ha generado con éxito su solicitud con el número de radicado: ${precontractual.getDataValue('id')}`)
            .then(resp => {
            console.log(resp);
        })
            .catch(err => {
            console.log(err);
        });
        data = {
            code: 200,
            status: 'success',
            message: 'Se ha creado la solicitud precontractual correctamente en el sistema',
            precontractual
        };
    }
    catch (error) {
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
exports.crearSolicitudPrecontractual = crearSolicitudPrecontractual;
/**
 * Controlador que realiza una eliminación lógica de la solicitud precontractual
 * @name		eliminarSolicitudPrecontractual
 * @author		Santiago Ramirez Gaitan <santiagooo42@gmail.com>
 * @version		1.0.0
 * @access		public
 *
 * @param 		{Request} req
 * @param 		{Response} res
 *
 * @returns
*/
const eliminarSolicitudPrecontractual = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    let data = {};
    const { id } = req.params;
    try {
        const precontractual = yield Precontractual_1.default.findByPk(id);
        if (precontractual) {
            // Eliminación lógica
            yield precontractual.update({ estado: 5 });
            data = {
                code: 200,
                status: 'success',
                message: 'Se ha eliminado correctamente la solicitud precontractual con número de consectuvo ' + id,
                precontractual
            };
        }
        else {
            data = {
                code: 404,
                status: 'error',
                message: 'No existe un usuario con el número de consecutivo ' + id
            };
        }
    }
    catch (error) {
        data = {
            code: 500,
            status: 'error',
            message: 'Ha ocurrido un error en el servidor, pongase en contacto con el administrador',
            error
        };
    }
});
exports.eliminarSolicitudPrecontractual = eliminarSolicitudPrecontractual;
/**
 * Controlador que obtiene una solicitud por el número de consecutivo
 * @name		obtenerSolicitud
 * @author		Santiago Ramirez Gaitan <santiagooo42@gmail.com>
 * @version		1.0.0
 * @access		public
 *
 * @param 		{Request} req
 * @param 		{Response} res
 *
 * @returns
*/
const obtenerSolicitud = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    let data = {};
    const { id } = req.params;
    try {
        const precontractual = yield Precontractual_1.default.findByPk(id, {
            include: [
                {
                    model: ObservacionJuridica_1.default,
                    as: 'comentarios_juridica'
                },
                {
                    model: Documentacion_1.default,
                    as: 'documentos'
                },
                {
                    model: Presupuesto_1.default,
                    as: 'presupuesto',
                },
            ]
        });
        if (precontractual) {
            data = {
                code: 200,
                status: 'success',
                precontractual
            };
        }
        else {
            data = {
                code: 404,
                status: 'error',
                message: 'No se ha encontrado una solicitud precontractual con el número de consecutivo ' + id,
                secondary: true
            };
        }
    }
    catch (error) {
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
exports.obtenerSolicitud = obtenerSolicitud;
/**
 * Controlador que obtiene las solicitudes precontractuales activas
 * @name		obtenerSolicitudesActivas
 * @author		Santiago Ramirez Gaitan <santiagooo42@gmail.com>
 * @version		1.0.0
 * @access		public
 *
 * @param 		{Request} req
 * @param 		{Response} res
 *
 * @returns
*/
const obtenerSolicitudesActivas = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    let data = {};
    try {
        const precontractuales = yield Precontractual_1.default.findAll({
            where: {
                estado: 1
            },
            order: [
                ['createdAt', 'DESC']
            ]
        });
        if (precontractuales && precontractuales.length > 0) {
            data = {
                code: 200,
                status: 'success',
                precontractuales
            };
        }
        else {
            data = {
                code: 404,
                status: 'error',
                message: 'No se han encontrado solicitudes precontractuales activas en la base de datos'
            };
        }
    }
    catch (error) {
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
exports.obtenerSolicitudesActivas = obtenerSolicitudesActivas;
/**
 * Controlador que obtiene las solicitudes precontractuales para el área de jurídica
 * @name		obtenerSolicitudesJuridica
 * @author		Santiago Ramirez Gaitan <santiagooo42@gmail.com>
 * @version		1.0.0
 * @access		public
 *
 * @param 		{Request} req
 * @param 		{Response} res
 *
 * @returns
*/
const obtenerSolicitudesJuridica = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    let data = {};
    try {
        const precontractuales = yield Precontractual_1.default.findAll({
            where: {
                estado: {
                    [sequelize_1.Op.or]: [1, 3, 6, 7]
                }
            },
            order: [
                ['estado', 'ASC'],
                ['createdAt', 'DESC'],
            ]
        });
        if (precontractuales && precontractuales.length > 0) {
            data = {
                code: 200,
                status: 'success',
                precontractuales
            };
        }
        else {
            data = {
                code: 404,
                status: 'error',
                message: 'No se han encontrado solicitudes precontractuales activas en la base de datos'
            };
        }
    }
    catch (error) {
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
exports.obtenerSolicitudesJuridica = obtenerSolicitudesJuridica;
/**
 * Controlador que obtiene todas las solicitudes contractuales
 * @name		obtenerSolicitudesPrecontractuales
 * @author		Santiago Ramirez Gaitan <santiagooo42@gmail.com>
 * @version		1.0.0
 * @access		public
 *
 * @param 		{Request} req
 * @param 		{Response} res
 *
 * @returns
*/
const obtenerSolicitudesPrecontractuales = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    let data = {};
    try {
        const precontractuales = yield Precontractual_1.default.findAll({
            order: [
                ['createdAt', 'DESC']
            ]
        });
        if (precontractuales) {
            data = {
                code: 200,
                status: 'success',
                precontractuales
            };
        }
        else {
            data = {
                code: 404,
                status: 'error',
                message: 'No se han encontrado solicitudes precontractuales en la base de datos'
            };
        }
    }
    catch (error) {
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
exports.obtenerSolicitudesPrecontractuales = obtenerSolicitudesPrecontractuales;
/**
 * Controlador que obtiene todas las solicitudes precontractuales del usuario logueado
 * @name		obtenerSolicitudesPrecontractuales
 * @author		Santiago Ramirez Gaitan <santiagooo42@gmail.com>
 * @version		1.0.0
 * @access		public
 *
 * @param 		{Request} req
 * @param 		{Response} res
 *
 * @returns
*/
const obtenerSolicitudesPrecontractualesPorUsuario = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    let data = {};
    let usuario_activo = 1;
    try {
        const precontractuales = yield Precontractual_1.default.findAll({
            where: {
                created_by: usuario_activo
            },
            order: [
                ['createdAt', 'DESC']
            ]
        });
        if (precontractuales && precontractuales.length > 0) {
            data = {
                code: 200,
                status: 'success',
                precontractuales
            };
        }
        else {
            data = {
                code: 404,
                status: 'error',
                message: 'No se han encontrado solicitudes precontractuales para el usuario logueado'
            };
        }
    }
    catch (error) {
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
exports.obtenerSolicitudesPrecontractualesPorUsuario = obtenerSolicitudesPrecontractualesPorUsuario;
//# sourceMappingURL=precontractual.controller.js.map