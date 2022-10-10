"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.validarJWT = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const validarJWT = (req, res, next) => {
    // Leer el token de los headers
    const token = req.header('x-token');
    if (!token) {
        return res.status(401).json({
            code: 400,
            status: 'error',
            message: 'No hay un token en la petición'
        });
    }
    try {
        const secret_key = process.env.JWT_SECRET;
        const secret_string = secret_key === null || secret_key === void 0 ? void 0 : secret_key.toString();
        const usuario = jsonwebtoken_1.default.verify(token, secret_string);
        req.usuario = usuario;
        next();
    }
    catch (error) {
        return res.status(401).json({
            code: 401,
            status: 'error',
            message: 'El token ingresado no es correcto'
        });
    }
};
exports.validarJWT = validarJWT;
//# sourceMappingURL=validar-jwt.js.map