"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const express_validator_1 = require("express-validator");
// Middlewares
const validar_campos_1 = __importDefault(require("../../../middlewares/validar-campos"));
// Controladores
const presupuesto_controller_1 = require("../controllers/presupuesto.controller");
const router = (0, express_1.Router)();
router.get('/adicionales/obtenerSolicitudesActivas', presupuesto_controller_1.obtenerSolicitudesActivas);
router.get('/:id', presupuesto_controller_1.obtenerSolicitudPresupuesto);
router.post('/', [
    (0, express_validator_1.check)('precontractual_id', 'El id de la solicitud precontractual es requerido').not().isEmpty(),
    (0, express_validator_1.check)('descripcion', 'Debe ingresar la descripción de la solicitud presupuestal').not().isEmpty(),
    validar_campos_1.default
], presupuesto_controller_1.crearCDPCRPPresupuesto);
router.put('/:id', [
    (0, express_validator_1.check)('motivo', 'Debe ingresar la respuesta de la solicitud presupuestal').not().isEmpty(),
    (0, express_validator_1.check)('descripcion', 'Debe ingresar la descripción de la solicitud presupuestal').not().isEmpty(),
    (0, express_validator_1.check)('tipo_certificado', 'Debe ingresar el tipo de certificado').not().isEmpty(),
    (0, express_validator_1.check)('estado', 'Debe ingresar el estado de la solicitud').not().isEmpty(),
    validar_campos_1.default
], presupuesto_controller_1.actualizarSolicitudPresupuestal);
exports.default = router;
//# sourceMappingURL=presupuesto.routes.js.map