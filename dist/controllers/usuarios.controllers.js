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
exports.autenticarUsuarioLDAP = exports.deleteUsuario = exports.putUsuario = exports.postUsuario = exports.getUsuario = exports.getUsuarios = void 0;
const ldapjs_1 = __importDefault(require("ldapjs"));
// Modelos
const Usuario_1 = __importDefault(require("../models/Usuario"));
const getUsuarios = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    let data = {};
    try {
        const usuarios = yield Usuario_1.default.findAll();
        if (usuarios) {
            data = {
                code: 200,
                status: 'success',
                usuarios
            };
        }
        else {
            data = {
                code: 404,
                status: 'error',
                message: 'No se han encontrado usuarios en la base de datos'
            };
        }
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
exports.getUsuarios = getUsuarios;
const getUsuario = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    let data = {};
    const { id } = req.params;
    try {
        const usuario = yield Usuario_1.default.findByPk(id);
        if (usuario) {
            data = {
                code: 200,
                status: 'success',
                usuario
            };
        }
        else {
            data = {
                code: 404,
                status: 'error',
                message: 'No se ha encontrado un usuario con el id ' + id
            };
        }
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
exports.getUsuario = getUsuario;
const postUsuario = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    let data = {};
    const { body } = req;
    try {
        const existe_email = yield Usuario_1.default.findOne({
            where: {
                email: body.email
            }
        });
        if (existe_email) {
            data = {
                code: 400,
                status: 'error',
                message: 'Ya existe un usuario con el correo electrónico ' + body.email
            };
        }
        else {
            const usuario = Usuario_1.default.build(body);
            yield usuario.save();
            data = {
                code: 200,
                status: 'success',
                message: 'Se ha creado correctamente el usuario en el sistema',
                usuario
            };
        }
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
exports.postUsuario = postUsuario;
const putUsuario = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    let data = {};
    const { id } = req.params;
    const { body } = req;
    try {
        const usuario = yield Usuario_1.default.findByPk(id);
        if (usuario) {
            const existe_email = yield Usuario_1.default.findOne({
                where: {
                    email: body.email
                }
            });
            if (existe_email) {
                data = {
                    code: 400,
                    status: 'error',
                    message: 'Ya existe un usuario con el correo electrónico ' + body.email
                };
            }
            else {
                yield usuario.update(body);
                data = {
                    code: 200,
                    status: 'success',
                    message: 'Se ha actualizado el usuario con el número de consecutivo ' + id,
                    usuario
                };
            }
        }
        else {
            data = {
                code: 404,
                status: 'error',
                message: 'No existe un usuario con el número de consecutivo ' + id
            };
        }
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
exports.putUsuario = putUsuario;
const deleteUsuario = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    let data = {};
    const { id } = req.params;
    try {
        const usuario = yield Usuario_1.default.findByPk(id);
        if (usuario) {
            // Eliminación física
            // await usuario.destroy();
            // Eliminación lógica
            yield usuario.update({ estado: false });
            data = {
                code: 200,
                status: 'success',
                message: 'Se ha eliminado correctamente el usuario con el número de consecutivo ' + id,
                usuario
            };
        }
        else {
            data = {
                code: 404,
                status: 'error',
                message: 'No existe un usuario con el número de consecutivo ' + id
            };
        }
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
exports.deleteUsuario = deleteUsuario;
const autenticarUsuarioLDAP = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    // const username = 'userappweb';
    // const password = 'Colombia2019';
    const username = "ldadp";
    const password = "C4pit4l2022*-";
    // Iniciar la conexión con el LDAP
    const client = ldapjs_1.default.createClient({
        url: 'LDAP://srvcsdcbog03.capitalsalud.loc'
    });
    client.bind(username, password, (error) => {
        if (error) {
            console.log('Error en la conexión con el directorio activo ' + error);
        }
        else {
            console.log('success');
        }
    });
    const { body } = req;
});
exports.autenticarUsuarioLDAP = autenticarUsuarioLDAP;
//# sourceMappingURL=usuarios.controllers.js.map