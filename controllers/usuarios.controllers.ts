import { Request, Response } from 'express';
import ffi from 'ffi-napi';
import path from 'path';
import ldap from 'ldapjs';

// Modelos
import Usuario from '../models/Usuario';

export const getUsuarios = async (req: Request, res: Response) => {
	let data: any = {};

	try {
		const usuarios = await Usuario.findAll();

		if( usuarios ) {
			data = {
				code: 200,
				status: 'success',
				usuarios
			}
		} else {
			data = {
				code: 404,
				status: 'error',
				message: 'No se han encontrado usuarios en la base de datos'
			}
		}
	} catch (error) {
		data = {
			code: 500,
			status: 'error',
			message: 'Ha ocurrido un error en el servidor, pongase en contacto con el administrador',
			error
		}	
	}

	// Devolver la respuesta
	res.status(data.code).json(data);
}

export const getUsuario = async (req: Request, res: Response) => {
	let data: any = {};
	const { id } = req.params;

	try {
		const usuario = await Usuario.findByPk( id );

		if( usuario ) {
			data = {
				code: 200,
				status: 'success',
				usuario
			}
		} else {
			data = {
				code: 404,
				status: 'error',
				message: 'No se ha encontrado un usuario con el id ' + id
			}
		}
	} catch (error) {
		data = {
			code: 500,
			status: 'error',
			message: 'Ha ocurrido un error en el servidor, pongase en contacto con el administrador',
			error
		}	
	}

	// Devolver la respuesta
	res.status(data.code).json(data);
}

export const postUsuario = async (req: Request, res: Response) => {
	let data: any = {};
	const { body } = req;

	try {
		const existe_email = await Usuario.findOne({
			where: {
				email: body.email
			}
		});

		if( existe_email ) {
			data = {
				code: 400,
				status: 'error',
				message: 'Ya existe un usuario con el correo electrónico ' + body.email
			}
		} else {
			const usuario = Usuario.build(body);
			await usuario.save();

			data = {
				code: 200,
				status: 'success',
				message: 'Se ha creado correctamente el usuario en el sistema',
				usuario
			}
		}
	} catch (error) {
		data = {
			code: 500,
			status: 'error',
			message: 'Ha ocurrido un error en el servidor, pongase en contacto con el administrador',
			error
		}	
	}

	// Devolver la respuesta
	res.status(data.code).json(data);
}

export const putUsuario = async (req: Request, res: Response) => {
	let data: any = {};
	const { id } = req.params;
	const { body } = req;

	try {
		const usuario = await Usuario.findByPk(id);
		if( usuario ) {
			const existe_email = await Usuario.findOne({
				where: {
					email: body.email
				}
			});
	
			if( existe_email ) {
				data = {
					code: 400,
					status: 'error',
					message: 'Ya existe un usuario con el correo electrónico ' + body.email
				}
			} else {
				await usuario.update( body );
					
				data = {
					code: 200,
					status: 'success',
					message: 'Se ha actualizado el usuario con el número de consecutivo ' + id,
					usuario
				}
			}
		} else {
			data = {
				code: 404,
				status: 'error',
				message: 'No existe un usuario con el número de consecutivo ' + id
			}
		}
		
	} catch (error) {
		data = {
			code: 500,
			status: 'error',
			message: 'Ha ocurrido un error en el servidor, pongase en contacto con el administrador',
			error
		}	
	}

	// Devolver la respuesta
	res.status(data.code).json(data);
}

export const deleteUsuario = async (req: Request, res: Response) => {
	let data: any = {};
	const { id } = req.params;

	try {
		const usuario = await Usuario.findByPk(id);
		if( usuario ) {
			// Eliminación física
			// await usuario.destroy();
			// Eliminación lógica
			await usuario.update({ estado: false });
			data = {
				code: 200,
				status: 'success',
				message: 'Se ha eliminado correctamente el usuario con el número de consecutivo ' + id,
				usuario
			}
		} else {
			data = {
				code: 404,
				status: 'error',
				message: 'No existe un usuario con el número de consecutivo ' + id
			}
		}		
	} catch (error) {
		data = {
			code: 500,
			status: 'error',
			message: 'Ha ocurrido un error en el servidor, pongase en contacto con el administrador',
			error
		}	
	}

	// Devolver la respuesta
	res.status(data.code).json(data);
}

export const autenticarUsuarioLDAP = async(req: Request, res: Response) => {
	// const username = 'userappweb';
	// const password = 'Colombia2019';
	const username = "ldadp";
	const password = "C4pit4l2022*-";

	// Iniciar la conexión con el LDAP
	const client = ldap.createClient({
		url: 'LDAP://srvcsdcbog03.capitalsalud.loc'
	});

	client.bind( username, password, (error) => {
		if( error ) {
			console.log('Error en la conexión con el directorio activo ' + error);
		} else {
			console.log('success')
		}
	});
	const { body } = req;

}