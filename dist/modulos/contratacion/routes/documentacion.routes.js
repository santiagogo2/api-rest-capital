"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const express_validator_1 = require("express-validator");
// Middlewares
const validar_campos_1 = __importDefault(require("../../../middlewares/validar-campos"));
const validar_jwt_1 = require("../../../middlewares/validar-jwt");
// Controladores
const documentacion_controller_1 = require("../controllers/documentacion.controller");
const router = (0, express_1.Router)();
router.post('/', [
    validar_jwt_1.validarJWT,
    (0, express_validator_1.check)('precontractual_id', 'El id de la solicitud precontractual es requerido').not().isEmpty(),
    (0, express_validator_1.check)('id_documento', 'Debe ingresar el identificador del documento que está guardando').not().isEmpty(),
    (0, express_validator_1.check)('documento', 'Debe ingresar el nombre del documento guardado en el servidor').not().isEmpty(),
    (0, express_validator_1.check)('fecha_vigencia', 'Debe ingresar la fecha de la vigencia del documento').exists(),
    (0, express_validator_1.check)('observacion', 'Debe ingresar una observación para el documento').exists(),
    validar_campos_1.default
], documentacion_controller_1.crearDocumentoAdjunto);
router.put('/adicional/actualizarEstadoDocumentoAdjunto/:id', [
    validar_jwt_1.validarJWT,
    (0, express_validator_1.check)('estado', 'Debe ingresar el estado del documento').not().isEmpty(),
    (0, express_validator_1.check)('fecha_vigencia', 'Debe ingresar la fecha de la vigencia del documento').exists(),
    (0, express_validator_1.check)('observacion', 'Debe ingresar una observación para el documento').exists(),
    validar_campos_1.default
], documentacion_controller_1.actualizarEstadoDocumentoAdjunto);
router.put('/adicional/:id', [
    validar_jwt_1.validarJWT,
    (0, express_validator_1.check)('documento', 'Debe ingresar el nombre del documento guardado en el servidor').not().isEmpty(),
    validar_campos_1.default
], documentacion_controller_1.actualizarDocumentoAdjunto);
exports.default = router;
//# sourceMappingURL=documentacion.routes.js.map