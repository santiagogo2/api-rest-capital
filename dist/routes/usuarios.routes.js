"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const express_validator_1 = require("express-validator");
const validar_campos_1 = __importDefault(require("../middlewares/validar-campos"));
// Controladores
const usuarios_controllers_1 = require("../controllers/usuarios.controllers");
const router = (0, express_1.Router)();
router.get('/', usuarios_controllers_1.getUsuarios);
router.get('/:id', usuarios_controllers_1.getUsuario);
router.get('/adicionales/autenticarUsuarioLDAP', usuarios_controllers_1.autenticarUsuarioLDAP);
router.post('/', [
    (0, express_validator_1.check)('nombre', 'El nombre es obligatorio').not().isEmpty(),
    (0, express_validator_1.check)('email', 'El correo electrónico es obligatorio').not().isEmpty(),
    validar_campos_1.default,
], usuarios_controllers_1.postUsuario);
router.put('/:id', usuarios_controllers_1.putUsuario);
router.delete('/:id', usuarios_controllers_1.deleteUsuario);
exports.default = router;
//# sourceMappingURL=usuarios.routes.js.map