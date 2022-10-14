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
exports.crearDocumentoAdjunto = exports.actualizarEstadoDocumentoAdjunto = exports.actualizarDocumentoAdjunto = void 0;
const fs_1 = __importDefault(require("fs"));
// Modelos
const Documentacion_1 = __importDefault(require("../models/Documentacion"));
/**
 * Controlador que actualiza un documento adjunto con lo enviado en el request
 * @name		actualizarDocumentoAdjunto
 * @author		Santiago Ramirez Gaitan <santiagooo42@gmail.com>
 * @version		1.0.0
 * @access		public
 *
 * @param 		{Request} req
 * @param 		{Response} res
 *
 * @returns
*/
const actualizarDocumentoAdjunto = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    let data = {};
    const { id } = req.params;
    const { body } = req;
    try {
        const documentacion = yield Documentacion_1.default.findByPk(id);
        if (documentacion) {
            // Validar si el documento anterior es igual al enviado en la petición
            const documento_anterior = documentacion === null || documentacion === void 0 ? void 0 : documentacion.getDataValue('documento');
            if (documento_anterior && documento_anterior != body.documento) {
                body.estado = 1;
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
            delete (body.id);
            delete (body.precontractual_id);
            delete (body.id_documento);
            delete (body.created_by);
            delete (body.createdAt);
            delete (body.updatedAt);
            yield documentacion.update(body);
            data = {
                code: 200,
                status: 'success',
                message: 'Se ha actualizado el documento para la solicitud con el consecutivo ' + (documentacion === null || documentacion === void 0 ? void 0 : documentacion.getDataValue('precontractual_id')),
                documentacion
            };
        }
        else {
            data = {
                code: 404,
                status: 'error',
                message: 'No existe un documento con el número de consecutivo ' + id
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
exports.actualizarDocumentoAdjunto = actualizarDocumentoAdjunto;
/**
 * Controlador que actualiza el estado del documento seleccionado por el usuario
 * @name		actualizarEstadoDocumentoAdjunto
 * @author		Santiago Ramirez Gaitan <santiagooo42@gmail.com>
 * @version		1.0.0
 * @access		public
 *
 * @param 		{Request} req
 * @param 		{Response} res
 *
 * @returns
*/
const actualizarEstadoDocumentoAdjunto = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    let data = {};
    const { id } = req.params;
    const { body } = req;
    try {
        const documentacion = yield Documentacion_1.default.findByPk(id);
        if (documentacion) {
            yield documentacion.update({
                estado: body.estado,
                fecha_vigencia: body.fecha_vigencia,
                observacion: body.observacion,
            });
            data = {
                code: 200,
                status: 'success',
                message: 'Se ha actualizado el documento con el número de consecutivo ' + id,
                documentacion
            };
        }
        else {
            data = {
                code: 404,
                status: 'error',
                message: 'No existe un documento con el número de consecutivo ' + id
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
exports.actualizarEstadoDocumentoAdjunto = actualizarEstadoDocumentoAdjunto;
/**
 * Controlador que guarda un nuevo valor del documento en la base de datos
 * @name		crearDocumentoAdjunto
 * @author		Santiago Ramirez Gaitan <santiagooo42@gmail.com>
 * @version		1.0.0
 * @access		public
 *
 * @param 		{Request} req
 * @param 		{Response} res
 *
 * @returns
*/
const crearDocumentoAdjunto = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    let data = {};
    const { body } = req;
    try {
        // Guardar el usuario logueado como creador del registro
        body.created_by = req.usuario.user.employeeID;
        body.estado = 1;
        const documentacion = Documentacion_1.default.build(body);
        yield documentacion.save();
        data = {
            code: 200,
            status: 'success',
            message: 'Se ha guardado un nuevo documento asociado a la solicitud ' + body.precontractual_id,
            documentacion
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
exports.crearDocumentoAdjunto = crearDocumentoAdjunto;
//# sourceMappingURL=documentacion.controller.js.map