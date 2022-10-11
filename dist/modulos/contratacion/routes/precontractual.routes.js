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
const precontractual_controller_1 = require("../controllers/precontractual.controller");
const router = (0, express_1.Router)();
router.get('/', validar_jwt_1.validarJWT, precontractual_controller_1.obtenerSolicitudesPrecontractuales);
router.get('/:id', validar_jwt_1.validarJWT, precontractual_controller_1.obtenerSolicitud);
router.get('/adicionales/obtenerSolicitudesActivas', validar_jwt_1.validarJWT, precontractual_controller_1.obtenerSolicitudesActivas);
router.get('/adicionales/obtenerSolicitudesJuridica', validar_jwt_1.validarJWT, precontractual_controller_1.obtenerSolicitudesJuridica);
router.get('/adicionales/obtenerSolicitudesPrecontractualesPorUsuario', validar_jwt_1.validarJWT, precontractual_controller_1.obtenerSolicitudesPrecontractualesPorUsuario);
router.get('/adicionales/actualizarEstadoSolicitudPrecontractual/:id/:estado', validar_jwt_1.validarJWT, precontractual_controller_1.actualizarEstadoSolicitudPrecontractual);
router.post('/', [
    validar_jwt_1.validarJWT,
    (0, express_validator_1.check)('primer_nombre', 'El primer nombre es obligatorio').not().isEmpty(),
    (0, express_validator_1.check)('primer_apellido', 'El primer apellido es obligatorio').not().isEmpty(),
    (0, express_validator_1.check)('correo_electronico', 'El correo electrónico es obligatorio').not().isEmpty(),
    (0, express_validator_1.check)('correo_electronico', 'El correo electrónico debe ser un email').normalizeEmail().isEmail(),
    (0, express_validator_1.check)('correo_electronico', 'El correo electrónico debe tener como domínio @capitalsalud.gov.co').matches('[a-z0-9._%+-]+@capitalsalud.gov.co'),
    (0, express_validator_1.check)('cargo', 'El cargo es obligatorio').not().isEmpty(),
    (0, express_validator_1.check)('area_solicitante', 'El area solicitante es obligatorio').not().isEmpty(),
    (0, express_validator_1.check)('descripcion_solicitud', 'El descripción de la solicitud es obligatorio').not().isEmpty(),
    (0, express_validator_1.check)('tipo_contrato', 'El tipo de contrato es obligatorio').not().isEmpty(),
    (0, express_validator_1.check)('documento_adjunto', 'El documento adjunto es obligatorio').not().isEmpty(),
    validar_campos_1.default
], precontractual_controller_1.crearSolicitudPrecontractual);
router.put('/:id', [
    validar_jwt_1.validarJWT,
    (0, express_validator_1.check)('primer_nombre', 'El primer nombre es obligatorio').not().isEmpty(),
    (0, express_validator_1.check)('primer_apellido', 'El primer apellido es obligatorio').not().isEmpty(),
    (0, express_validator_1.check)('correo_electronico', 'El correo electrónico es obligatorio').not().isEmpty(),
    (0, express_validator_1.check)('correo_electronico', 'El correo electrónico debe ser un email').normalizeEmail().isEmail(),
    (0, express_validator_1.check)('correo_electronico', 'El correo electrónico debe tener como domínio @capitalsalud.gov.co').matches('[a-z0-9._%+-]+@capitalsalud.gov.co'),
    (0, express_validator_1.check)('cargo', 'El cargo es obligatorio').not().isEmpty(),
    (0, express_validator_1.check)('area_solicitante', 'El area solicitante es obligatorio').not().isEmpty(),
    (0, express_validator_1.check)('descripcion_solicitud', 'El descripción de la solicitud es obligatorio').not().isEmpty(),
    (0, express_validator_1.check)('tipo_contrato', 'El tipo de contrato es obligatorio').not().isEmpty(),
    validar_campos_1.default
], precontractual_controller_1.actualizarSolicitudPrecontractual);
router.delete('/:id', validar_jwt_1.validarJWT, precontractual_controller_1.eliminarSolicitudPrecontractual);
exports.default = router;
//# sourceMappingURL=precontractual.routes.js.map