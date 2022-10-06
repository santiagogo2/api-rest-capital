"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
// Controladores
const modulos_controller_1 = require("../controllers/modulos.controller");
const router = (0, express_1.Router)();
router.get('/', modulos_controller_1.obtenerModulosActivos);
exports.default = router;
//# sourceMappingURL=modulos.routes.js.map