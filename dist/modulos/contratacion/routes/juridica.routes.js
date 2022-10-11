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
const juridica_controller_1 = require("../controllers/juridica.controller");
const validar_jwt_1 = require("../../../middlewares/validar-jwt");
const router = (0, express_1.Router)();
router.post('/:estado', [
    validar_jwt_1.validarJWT,
    (0, express_validator_1.check)('precontractual_id', 'El id de la solicitud precontractual es requerido').not().isEmpty(),
    (0, express_validator_1.check)('observaciones', 'Debe ingresar las observaciones del rechazo').not().isEmpty(),
    validar_campos_1.default
], juridica_controller_1.crearObservacionJuridica);
exports.default = router;
//# sourceMappingURL=juridica.routes.js.map