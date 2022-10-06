"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const express_fileupload_1 = __importDefault(require("express-fileupload"));
// Controladores
const uploads_controller_1 = require("../controllers/uploads.controller");
const router = (0, express_1.Router)();
router.use((0, express_fileupload_1.default)());
router.get('/:modulo/:archivo', uploads_controller_1.obtenerArchivo);
router.post('/:modulo', uploads_controller_1.cargarArchivo);
exports.default = router;
//# sourceMappingURL=uploads.routes.js.map