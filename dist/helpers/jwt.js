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
exports.generarJWT = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
/**
 * Función que crea el jsonwebtoken para el aplicativo con el inicio de sesión
 * @name		generarJWT
 * @author		Santiago Ramirez Gaitan <santiagooo42@gmail.com>
 * @version		1.0.0
 * @access		public
 *
 * @param 		{any} user
 *
 * @returns
*/
const generarJWT = (user) => __awaiter(void 0, void 0, void 0, function* () {
    return new Promise((resolve, reject) => {
        const secret_key = process.env.JWT_SECRET;
        const secret_string = secret_key === null || secret_key === void 0 ? void 0 : secret_key.toString();
        const payload = {
            user,
        };
        jsonwebtoken_1.default.sign(payload, secret_string, {
            expiresIn: '12h'
        }, (error, token) => {
            if (error) {
                console.log(error);
                reject('No se pudo generar el JWT');
            }
            else {
                resolve(token);
            }
        });
    });
});
exports.generarJWT = generarJWT;
//# sourceMappingURL=jwt.js.map