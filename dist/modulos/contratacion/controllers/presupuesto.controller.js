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
exports.obtenerSolicitudPresupuesto = exports.obtenerSolicitudesActivas = exports.obtenerSolicitudes = exports.crearCDPCRPPresupuesto = exports.actualizarSolicitudPresupuestal = void 0;
const fs_1 = __importDefault(require("fs"));
// Importar funciones
const nodemailer_controller_1 = require("../../../controllers/nodemailer.controller");
// Modelos
const Presupuesto_1 = __importDefault(require("../models/Presupuesto"));
const Precontractual_1 = __importDefault(require("../models/Precontractual"));
const Documentacion_1 = __importDefault(require("../models/Documentacion"));
/**
* Controlador que actualiza la solicitud presupuestal por el número de consecutivo
* @name			actualizarSolicitudPresupuestal
* @author		Santiago Ramirez Gaitan <santiagooo42@gmail.com>
* @version		1.0.0
* @access		public
*
* @param 		{Request} req
* @param 		{Response} res
*
* @returns
*/
const actualizarSolicitudPresupuestal = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    let data = {};
    const { id } = req.params;
    const { body } = req;
    try {
        const presupuesto = yield Presupuesto_1.default.findByPk(id);
        if (presupuesto) {
            // Validar si el documento anterior es igual al enviado en la petición
            const documento_anterior = presupuesto === null || presupuesto === void 0 ? void 0 : presupuesto.getDataValue('documento_adjunto');
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
            // Eliminar los campos que no se desean actualizar
            const id_solicitud = body.precontractual_id;
            let tipo_certificado = (presupuesto === null || presupuesto === void 0 ? void 0 : presupuesto.getDataValue('tipo_certificado')) == 1 ? 'CDP' : 'CRP';
            delete (body.id);
            delete (body.precontractual_id);
            delete (body.created_by);
            delete (body.createdAt);
            delete (body.updatedAt);
            yield presupuesto.update(body);
            // Obtener la solicitud para envíar la notificación
            const precontractual = yield Precontractual_1.default.findByPk(id_solicitud);
            // Enviar un correo de notificación al usuario
            (0, nodemailer_controller_1.enviarCorreoElectronicoContratacion)(precontractual === null || precontractual === void 0 ? void 0 : precontractual.getDataValue('correo_electronico'), `Respuesta a la solcitud de contrato ${tipo_certificado}`, null, `Se ha dado respuesta a su solicitud de contrato / ${tipo_certificado} # ${id_solicitud} la cual podrá ser consultada en el aplicativo web.`)
                .then(resp => {
                console.log(resp);
            })
                .catch(err => {
                console.log(err);
            });
            data = {
                code: 200,
                status: 'success',
                message: 'Se ha actualizado la solicitud presupuestal con el número de consecutivo ' + id,
                presupuesto
            };
        }
        else {
            data = {
                code: 404,
                status: 'error',
                message: 'No existe una solicitud presupuestal con el número de consecutivo ' + id
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
exports.actualizarSolicitudPresupuestal = actualizarSolicitudPresupuestal;
/**
 * Controlador que guarda una nueva solicitud presupuestal
 * @name		crearCDPCRPPresupuesto
 * @author		Santiago Ramirez Gaitan <santiagooo42@gmail.com>
 * @version		1.0.0
 * @access		public
 *
 * @param 		{Request} req
 * @param 		{Response} res
 *
 * @returns
*/
const crearCDPCRPPresupuesto = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    let data = {};
    const { body } = req;
    try {
        // Asignar el estado a una nueva solicitud
        body.estado = 1;
        // Guardar el usuario logueado como creador del registro
        body.created_by = req.usuario.user.employeeID;
        const presupuesto = Presupuesto_1.default.build(body);
        yield presupuesto.save();
        let tipo_certificado = (presupuesto === null || presupuesto === void 0 ? void 0 : presupuesto.getDataValue('tipo_certificado')) == 1 ? 'CDP' : 'CRP';
        // Enviar un correo de notificación al usuario
        (0, nodemailer_controller_1.enviarCorreoElectronicoContratacion)('profesional.desarrollo3@capitalsalud.gov.co', `Solicitud de ${tipo_certificado}`, null, `Se ha generado una solicitud de ${tipo_certificado} con número de radicado: ${presupuesto === null || presupuesto === void 0 ? void 0 : presupuesto.getDataValue('id')}`)
            .then(resp => {
            console.log(resp);
        })
            .catch(err => {
            console.log(err);
        });
        data = {
            code: 200,
            status: 'success',
            message: 'Se ha guardado una nueva solicitud a presupuesto',
            presupuesto
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
exports.crearCDPCRPPresupuesto = crearCDPCRPPresupuesto;
/**
 * Controlador que obtiene todas las solicitudes para el área de presupuesto
 * @name		obtenerSolicitudes
 * @author		Santiago Ramirez Gaitan <santiagooo42@gmail.com>
 * @version		1.0.0
 * @access		public
 *
 * @param 		{Request} req
 * @param 		{Response} res
 *
 * @returns
*/
const obtenerSolicitudes = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    let data = {};
    try {
        const presupuestos = yield Presupuesto_1.default.findAll({
            where: {
                estado: 1
            },
            include: [
                {
                    model: Precontractual_1.default,
                    as: 'solicitud_precontractual'
                }
            ],
            order: [
                ['createdAt', 'DESC']
            ]
        });
        if (presupuestos) {
            data = {
                code: 200,
                status: 'success',
                presupuestos
            };
        }
        else {
            data = {
                code: 404,
                status: 'error',
                message: 'No se han encontrado solicitudes para el área de presupuesto'
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
exports.obtenerSolicitudes = obtenerSolicitudes;
/**
 * Controlador que obtiene las solicitudes activas para el área de presupuesto
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
        const presupuestos = yield Presupuesto_1.default.findAll({
            where: {
                estado: 1
            },
            include: [
                {
                    model: Precontractual_1.default,
                    as: 'solicitud_precontractual'
                }
            ],
            order: [
                ['createdAt', 'DESC']
            ]
        });
        if (presupuestos) {
            data = {
                code: 200,
                status: 'success',
                presupuestos
            };
        }
        else {
            data = {
                code: 404,
                status: 'error',
                message: 'No se han encontrado solicitudes a presupuesto activas'
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
 * Controlador que obtiene la solicitud presupuestal por el número de consecutivo
 * @name		obtenerSolicitudPresupuesto
 * @author		Santiago Ramirez Gaitan <santiagooo42@gmail.com>
 * @version		1.0.0
 * @access		public
 *
 * @param 		{Request} req
 * @param 		{Response} res
 *
 * @returns
*/
const obtenerSolicitudPresupuesto = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    let data = {};
    let { id } = req.params;
    try {
        const presupuesto = yield Presupuesto_1.default.findByPk(id, {
            include: [
                {
                    model: Precontractual_1.default,
                    as: 'solicitud_precontractual',
                    include: [
                        {
                            model: Documentacion_1.default,
                            as: 'documentos'
                        }
                    ]
                },
            ],
            order: [
                ['createdAt', 'DESC']
            ]
        });
        if (presupuesto) {
            data = {
                code: 200,
                status: 'success',
                presupuesto
            };
        }
        else {
            data = {
                code: 404,
                status: 'error',
                message: 'No se ha encontrado una solicitud presupuestal con el número de consecutivo ' + id,
                secondary: true
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
exports.obtenerSolicitudPresupuesto = obtenerSolicitudPresupuesto;
//# sourceMappingURL=presupuesto.controller.js.map