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
exports.crearObservacionJuridica = void 0;
// Importar funciones
const nodemailer_controller_1 = require("../../../controllers/nodemailer.controller");
// Modelos
const ObservacionJuridica_1 = __importDefault(require("../models/ObservacionJuridica"));
const Precontractual_1 = __importDefault(require("../models/Precontractual"));
const crearObservacionJuridica = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    let data = {};
    const { body } = req;
    const { estado } = req.params;
    try {
        // Actualizar el estado de la solicitud		
        const solicitud_id = body.precontractual_id;
        const precontractual = yield Precontractual_1.default.findByPk(solicitud_id);
        if (precontractual) {
            // Actualizar el estado de la solicitud
            precontractual.update({
                estado: estado
            });
            // Guardar el usuario logueado como creador del registro
            body.created_by = req.usuario.user.employeeID;
            const observaciones = ObservacionJuridica_1.default.build(body);
            yield observaciones.save();
            // Enviar un correo de notificación al usuario
            (0, nodemailer_controller_1.enviarCorreoElectronicoContratacion)(precontractual === null || precontractual === void 0 ? void 0 : precontractual.getDataValue('correo_electronico'), `Actualización de la Solicitud ${solicitud_id}`, null, `La solicitud con número de consecutivo ${solicitud_id} ha sido devuelta con una observación. Por favor, ingrese al aplicativo y revise los cambios realizados`)
                .then(resp => {
                console.log(resp);
            })
                .catch(err => {
                console.log(err);
            });
            data = {
                code: 200,
                status: 'success',
                message: 'Se ha creado una nueva observación en el sistema y se ha actualizado el estado de la solicitud',
                observaciones
            };
        }
        else {
            data = {
                code: 404,
                status: 'error',
                message: 'No existe una solicitud precontractual con el número de consecutivo ' + solicitud_id
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
exports.crearObservacionJuridica = crearObservacionJuridica;
//# sourceMappingURL=juridica.controller.js.map