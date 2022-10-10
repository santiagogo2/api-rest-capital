"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const express_validator_1 = require("express-validator");
// Middelwares
const validar_campos_1 = __importDefault(require("../middlewares/validar-campos"));
const validar_jwt_1 = require("../middlewares/validar-jwt");
// Controladores
const usuarios_controllers_1 = require("../controllers/usuarios.controllers");
const router = (0, express_1.Router)();
router.get('/adicionales/obtenerIdentidadUsuario', validar_jwt_1.validarJWT, usuarios_controllers_1.obtenerIdentidadUsuario);
router.post('/adicionales/autenticarUsuario', [
    (0, express_validator_1.check)('nombre_usuario', 'Debe ingresar el nombre de usuario').not().isEmpty(),
    (0, express_validator_1.check)('password', 'Debe ingresar la contraseña del usuario').not().isEmpty(),
    validar_campos_1.default
], usuarios_controllers_1.autenticarUsuario);
exports.default = router;
//# sourceMappingURL=usuarios.routes.js.map