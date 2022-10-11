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
Object.defineProperty(exports, "__esModule", { value: true });
exports.obtenerIdentidadUsuario = exports.autenticarUsuario = void 0;
const ActiveDirectory = require('activedirectory');
const jwt_1 = require("../helpers/jwt");
/**
 * Función que realiza la autenticación del usuario para el aplicativo
 * @name		autenticarUsuario
 * @author		Santiago Ramirez Gaitan <santiagooo42@gmail.com>
 * @version		1.0.0
 * @access		public
 *
 * @param 		{Request} req
 * @param 		{Response} res
 *
 * @returns
*/
const autenticarUsuario = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    let data = {};
    const { body } = req;
    const usuario = body.nombre_usuario + '@capitalsalud.loc';
    const contraseña = body.password;
    let flag = false;
    yield autenticarUsuarioLDAP(usuario, contraseña)
        .then(() => {
        flag = true;
    })
        .catch(error => {
        data = {
            code: 500,
            status: 'error',
            message: error,
        };
    });
    if (flag) {
        let user = null;
        yield obtenerInformacionUsuarioLDAP(usuario, contraseña)
            .then((res) => {
            user = res;
        })
            .catch(err => {
            data = {
                code: 500,
                status: 'error',
                message: err,
            };
        });
        if (user) {
            yield obtenerGruposPorUsuario(usuario, contraseña)
                .then((res) => {
                user.grupos = res;
            })
                .catch(err => {
                data = {
                    code: 500,
                    status: 'error',
                    message: err,
                };
            });
        }
        if (user.grupos) {
            // Generar el Token - JWT
            yield (0, jwt_1.generarJWT)(user)
                .then(token => {
                data = {
                    code: 200,
                    status: 'success',
                    message: 'Se ha realizado la autenticación del usuario correctamente',
                    token
                };
            })
                .catch(error => {
                data = {
                    code: 500,
                    status: 'error',
                    message: error,
                };
            });
        }
    }
    res.status(data.code).json(data);
});
exports.autenticarUsuario = autenticarUsuario;
/**
 * Función que devuelve la identidad del usuario que viene en el request del middelware
 * @name		obtenerIdentidadUsuario
 * @author		Santiago Ramirez Gaitan <santiagooo42@gmail.com>
 * @version		1.0.0
 * @access		public
 *
 * @param 		{Request} req
 * @param 		{Response} res
 *
 * @returns
*/
const obtenerIdentidadUsuario = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    let data = {};
    // El usuario viene del request despues de pasar por el middleware del token
    if (req.usuario) {
        data = {
            code: 200,
            status: 'success',
            usuario: req.usuario
        };
    }
    else {
        data = {
            code: 500,
            status: 'error',
            message: 'No se ha podido obtener los datos del usuario con el token',
        };
    }
    res.status(data.code).json(data);
});
exports.obtenerIdentidadUsuario = obtenerIdentidadUsuario;
/**
 * Función que realiza la autenticación del usuario con el directorio activo por medio del protocolo LDAP
 * @name		autenticarUsuarioLDAP
 * @author		Santiago Ramirez Gaitan <santiagooo42@gmail.com>
 * @version		1.0.0
 * @access		public
 *
 * @param 		{Request} req
 * @param 		{Response} res
 *
 * @returns
*/
function autenticarUsuarioLDAP(usuario, contraseña) {
    return __awaiter(this, void 0, void 0, function* () {
        return new Promise((resolve, reject) => {
            // Configuración LDAP
            const config = {
                url: 'LDAP://srvcsdcbog03.capitalsalud.loc',
                baseDN: 'dc=capitalsalud,dc=loc',
            };
            var ad = new ActiveDirectory(config);
            ad.authenticate(usuario, contraseña, (error, auth) => {
                if (error) {
                    console.log(error);
                    reject('No ha podido realizarse la autenticación con el usuario y contraseña ingresados');
                }
                if (auth) {
                    resolve(auth);
                }
                else {
                    reject('Autenticación fallida');
                }
            });
        });
    });
}
function obtenerGruposPorUsuario(usuario, contraseña) {
    return __awaiter(this, void 0, void 0, function* () {
        return new Promise((resolve, reject) => {
            // Configuración LDAP
            const config = {
                url: 'LDAP://srvcsdcbog03.capitalsalud.loc',
                baseDN: 'dc=capitalsalud,dc=loc',
                username: usuario,
                password: contraseña
            };
            const ad = new ActiveDirectory(config);
            ad.getGroupMembershipForUser(usuario, (error, grupos) => {
                if (error) {
                    console.log('ERROR: ' + JSON.stringify(error));
                    reject('Ha ocurrido un error al intentar consultar el usuario indicado');
                }
                if (!grupos) {
                    reject('El usuario consultado no se ha encontrado en el directorio activo');
                }
                else {
                    resolve(grupos);
                }
            });
        });
    });
}
/**
 * Función que obtiene la información del usuario autenticado
 * Es necesario enviarle nuevamente el usuario y la contraseña para poder realizar la busqueda con una nueva configuracion
 * @name		autenticarUsuarioLDAP
 * @author		Santiago Ramirez Gaitan <santiagooo42@gmail.com>
 * @version		1.0.0
 * @access		public
 *
 * @param 		{Request} req
 * @param 		{Response} res
 *
 * @returns
*/
function obtenerInformacionUsuarioLDAP(usuario, contraseña) {
    return __awaiter(this, void 0, void 0, function* () {
        return new Promise((resolve, reject) => {
            // Configuración LDAP
            const config = {
                url: 'LDAP://srvcsdcbog03.capitalsalud.loc',
                baseDN: 'dc=capitalsalud,dc=loc',
                username: usuario,
                password: contraseña
            };
            const ad = new ActiveDirectory(config);
            ad.findUser(usuario, (error, user) => {
                if (error) {
                    console.log('ERROR: ' + JSON.stringify(error));
                    reject('Ha ocurrido un error al intentar consultar el usuario indicado');
                }
                if (!user) {
                    reject('El usuario consultado no se ha encontrado en el directorio activo');
                }
                else {
                    resolve(user);
                }
            });
        });
    });
}
//# sourceMappingURL=usuarios.controllers.js.map