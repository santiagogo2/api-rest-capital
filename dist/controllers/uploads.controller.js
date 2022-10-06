"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.obtenerArchivo = exports.cargarArchivo = void 0;
const uuid_1 = require("uuid");
const path_1 = __importDefault(require("path"));
const fs_1 = __importDefault(require("fs"));
/**
 * Controlador que guarda un archivo en la base de datos
 * @name		cargarArchivo
 * @author		Santiago Ramirez Gaitan <santiagooo42@gmail.com>
 * @version		1.0.0
 * @access		public
 *
 * @param 		{Request} req
 * @param 		{Response} res
 *
 * @returns
*/
const cargarArchivo = (req, res) => {
    let data = {};
    const modulo = req.params.modulo;
    const tipos_validos = ['contratacion'];
    const extensiones_validas = ['pdf', 'PDF'];
    try {
        // Validar los modulos existentes a donde se van a cargar los archivos
        if (tipos_validos.includes(modulo)) {
            // Validar que el request tenga un archivo
            if (!req.files || Object.keys(req.files).length === 0) {
                data = {
                    code: 400,
                    status: 'error',
                    message: 'No ha seleccionado ningun archivo para cargar en el servidor',
                };
                res.status(data.code).json(data);
            }
            else {
                const file = req.files.archivo;
                const nombre_cortado = file.name.split('.');
                const extension_archivo = nombre_cortado[nombre_cortado.length - 1];
                if (extensiones_validas.includes(extension_archivo)) {
                    const nombre_archivo = `${(0, uuid_1.v4)()}.${extension_archivo}`;
                    // Path para guardar la imágen
                    const path = `./uploads/${modulo}/${nombre_archivo}`;
                    // Mover la imágen a la carpeta deseada
                    file.mv(path, (error) => {
                        if (error) {
                            data = {
                                code: 500,
                                status: 'error',
                                message: 'Ha ocurrido un error al intentar cargar el archivo. Pongase en contacto con el administrador',
                            };
                        }
                        else {
                            data = {
                                code: 200,
                                status: 'success',
                                message: 'Se ha subido correctamente el archivo al servidor',
                                nombre_archivo
                            };
                        }
                        res.status(200).json(data);
                    });
                }
                else {
                    data = {
                        code: 400,
                        status: 'error',
                        message: 'No se permiten cargar archivos con la extensión ' + extension_archivo + ' en el servidor',
                    };
                    res.status(data.code).json(data);
                }
            }
        }
        else {
            data = {
                code: 500,
                status: 'error',
                message: 'El modulo ' + modulo + ' no es un modulo válido para el aplicativo. Pongase en contacto con el administrador',
            };
            res.status(data.code).json(data);
        }
    }
    catch (error) {
        data = {
            code: 500,
            status: 'error',
            message: 'Ha ocurrido un error en el servidor, pongase en contacto con el administrador',
            error
        };
        res.status(data.code).json(data);
    }
};
exports.cargarArchivo = cargarArchivo;
/**
 * Controlador que retorna el archivo con el nombre enviado por la url
 * @name		obtenerArchivo
 * @author		Santiago Ramirez Gaitan <santiagooo42@gmail.com>
 * @version		1.0.0
 * @access		public
 *
 * @param 		{Request} req
 * @param 		{Response} res
 *
 * @returns
*/
const obtenerArchivo = (req, res) => {
    const modulo = req.params.modulo;
    const archivo = req.params.archivo;
    const path_archivo = path_1.default.join(__dirname, `../../uploads/${modulo}/${archivo}`);
    if (fs_1.default.existsSync(path_archivo)) {
        res.sendFile(path_archivo);
    }
    else {
        res.status(404).json({
            code: 500,
            status: 'error',
            message: 'No se ha encontrado un archivo con el nombre ' + archivo + ' en el servidor',
        });
    }
};
exports.obtenerArchivo = obtenerArchivo;
//# sourceMappingURL=uploads.controller.js.map