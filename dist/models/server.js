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
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const path_1 = __importDefault(require("path"));
// Rutas
const documentacion_routes_1 = __importDefault(require("../modulos/contratacion/routes/documentacion.routes"));
const juridica_routes_1 = __importDefault(require("../modulos/contratacion/routes/juridica.routes"));
const precontractual_routes_1 = __importDefault(require("../modulos/contratacion/routes/precontractual.routes"));
const presupuesto_routes_1 = __importDefault(require("../modulos/contratacion/routes/presupuesto.routes"));
const nodemailer_routes_1 = __importDefault(require("../routes/nodemailer.routes"));
const modulos_routes_1 = __importDefault(require("../routes/modulos.routes"));
const usuarios_routes_1 = __importDefault(require("../routes/usuarios.routes"));
const uploads_routes_1 = __importDefault(require("../routes/uploads.routes"));
const connection_1 = __importDefault(require("../database/connection"));
class Server {
    constructor() {
        this.api_paths = {
            contratacion_documentacion: '/api/contratacion/documentacion',
            contratacion_juridica: '/api/contratacion/juridica',
            contratacion_precontractual: '/api/contratacion/precontractual',
            contratacion_presupuesto: '/api/contratacion/presupuesto',
            email: '/api/email',
            modulos: '/api/modulos',
            uploads: '/api/upload',
            usuarios: '/api/usuarios',
        };
        this.app = (0, express_1.default)();
        this.port = process.env.PORT || '8000';
        // Metodos iniciales
        this.conectarBaseDatos();
        this.middlewares();
        this.routes();
    }
    conectarBaseDatos() {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                yield connection_1.default.authenticate();
            }
            catch (error) {
                throw new Error('No se ha generado la conexión a la base de datos. La aplicación no puede continuar');
            }
        });
    }
    listen() {
        this.app.listen(this.port, () => {
            console.log('Servidor corriendo en el puerto ' + this.port);
        });
    }
    middlewares() {
        // Configuración del CORS
        this.app.use((0, cors_1.default)());
        // Lectura del body
        this.app.use(express_1.default.json());
        // Carpeta pública
        this.app.use(express_1.default.static('public'));
    }
    routes() {
        this.app.use(this.api_paths.contratacion_documentacion, documentacion_routes_1.default);
        this.app.use(this.api_paths.contratacion_juridica, juridica_routes_1.default);
        this.app.use(this.api_paths.contratacion_precontractual, precontractual_routes_1.default);
        this.app.use(this.api_paths.contratacion_presupuesto, presupuesto_routes_1.default);
        this.app.use(this.api_paths.email, nodemailer_routes_1.default);
        this.app.use(this.api_paths.modulos, modulos_routes_1.default);
        this.app.use(this.api_paths.uploads, uploads_routes_1.default);
        this.app.use(this.api_paths.usuarios, usuarios_routes_1.default);
        // Ruta que le permite a la aplicación usar siempre la ruta base para no perder la configuración de angular
        this.app.get('*', (req, res) => {
            res.sendFile(path_1.default.resolve(__dirname, '../../public/index.html'));
        });
    }
}
exports.default = Server;
//# sourceMappingURL=server.js.map