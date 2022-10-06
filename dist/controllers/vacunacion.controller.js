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
exports.guardarLogWebService = void 0;
// Modelos
const Vacunacion_1 = __importDefault(require("../models/Vacunacion"));
const guardarLogWebService = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    let data = {};
    const { body } = req;
    try {
        const vacunacion = Vacunacion_1.default.build(body);
        yield vacunacion.save();
        data = {
            code: 200,
            status: 'success',
            message: 'Se ha creado el log correctamente en el sistema',
            vacunacion
        };
    }
    catch (error) {
        data = {
            code: 500,
            status: 'error',
            message: 'Ha ocurrido un error en el servidor, pongase en contacto con el administrador',
            error
        };
    }
    // Devolver la respuesta
    res.status(data.code).json(data);
});
exports.guardarLogWebService = guardarLogWebService;
//# sourceMappingURL=vacunacion.controller.js.map