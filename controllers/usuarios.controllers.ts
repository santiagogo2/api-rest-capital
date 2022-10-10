import { Request, Response } from 'express';
const ActiveDirectory = require('activedirectory');
import { generarJWT }  from '../helpers/jwt';

interface Usuario {
	employeeID: string,
	dn: string,
	sAMAccountName: string,
	mail: string,
	whenCreated: string,
	userAccountControl: number,
	cn: string,
	description: string,
}

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
export const autenticarUsuario = async (req: Request, res: Response) => {
	let data: any = {};
	const { body } = req;

	const usuario = body.nombre_usuario + '@capitalsalud.loc';
	const contraseña = body.password;
	let flag = false;

	await autenticarUsuarioLDAP( usuario, contraseña )
		.then( () => {
			flag = true;				
		})
		.catch( error => {
			data = {
				code: 500,
				status: 'error',
				message: error,
			}
		});
	
	if( flag ) {
		let user: Usuario | any = null;
		await obtenerInformacionUsuarioLDAP( usuario, contraseña )
			.then( (res: any) => {
				user = res;
			})
			.catch( err => {
				data = {
					code: 500,
					status: 'error',
					message: err,
				}
			});

		if( user ) {			
			// Generar el Token - JWT
			await generarJWT( user )
				.then( token => {
					data = {
						code: 200,
						status: 'success',
						message: 'Se ha realizado la autenticación del usuario correctamente',
						token
					}
				})
				.catch( error => {
					data = {
						code: 500,
						status: 'error',
						message: error,
					}
				});
		}
	}

	res.status(data.code).json(data);
}

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
export const obtenerIdentidadUsuario = async (req: Request | any, res: Response) => {
	let data: any = {};

	// El usuario viene del request despues de pasar por el middleware del token
	if( req.usuario ) {
		data = {
			code: 200,
			status: 'success',
			usuario: req.usuario
		}
	} else {
		data = {
			code: 500,
			status: 'error',
			message: 'No se ha podido obtener los datos del usuario con el token',
		}
	}

	res.status(data.code).json(data);
}

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
async function autenticarUsuarioLDAP( usuario: string, contraseña: string ) {
	return new Promise( (resolve, reject) => {
		// Configuración LDAP
		const config = {
			url: 'LDAP://srvcsdcbog03.capitalsalud.loc',
			baseDN: 'dc=capitalsalud,dc=loc',
		}

		var ad = new ActiveDirectory(config);

		ad.authenticate(usuario, contraseña, (error:any, auth:any) => {
			if (error) {
				console.log(error)
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
async function obtenerInformacionUsuarioLDAP( usuario:string, contraseña: string ) {
	return new Promise( (resolve, reject) => {
		// Configuración LDAP
		const config = {
			url: 'LDAP://srvcsdcbog03.capitalsalud.loc',
			baseDN: 'dc=capitalsalud,dc=loc',
			username: usuario,
			password: contraseña
		}

		const ad = new ActiveDirectory(config);

		ad.findUser(usuario, (error: any, user: any) => {
			if (error) {
				console.log('ERROR: ' +JSON.stringify(error));
				reject( 'Ha ocurrido un error al intentar consultar el usuario indicado' );
			}
		   
			if (! user) {
				reject( 'El usuario consultado no se ha encontrado en el directorio activo' );
			}
			else {
				resolve( user );
			}
		});
	});	
}