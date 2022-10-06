import { Request, Response } from 'express';
import { Op } from 'sequelize';
import fs from 'fs';

// Importar funciones
import { enviarCorreoElectronicoContratacion } from "../../../controllers/nodemailer.controller";

// Modelos
import Documentacion from '../models/Documentacion';
import ObservacionJuridica from '../models/ObservacionJuridica';
import Precontractual from '../models/Precontractual';
import Presupuesto from '../models/Presupuesto';

/**
 * Controlador que actualiza el estado de una solicitud precontractual por el número de consecutivo
 * @name		actualizarEstadoSolicitudPrecontractual
 * @author		Santiago Ramirez Gaitan <santiagooo42@gmail.com>
 * @version		1.0.0
 * @access		public
 * 
 * @param 		{Request} req
 * @param 		{Response} res
 * 
 * @returns 
*/
export const actualizarEstadoSolicitudPrecontractual = async ( req: Request, res: Response ) => {
	let data: any = {};
	const { id } = req.params;
	const { estado } = req.params;
	const { body } = req;

	try {
		const precontractual = await Precontractual.findByPk( id );
		
		if( precontractual ) {			
			// Eliminar los campos que no se desean actualizar
			delete( body.id );
			delete( body.created_by );
			delete( body.createdAt );
			delete( body.updatedAt );

			await precontractual.update({ estado: estado });

			// Enviar un correo de notificación al usuario
			enviarCorreoElectronicoContratacion( precontractual?.getDataValue('correo_electronico'), `Actualización de la Solicitud ${id}`, null, `El estado de la solicitud con número de consecutivo ${id} ha sido actualizado. Por favor, ingrese al aplicativo y revise los cambios realizados` )
				.then( resp => {
					console.log(resp);
				})
				.catch(err => {
					console.log(err);
				});
					
			data = {
				code: 200,
				status: 'success',
				message: 'Se ha actualizado el estado de la solicitud con el número de consecutivo ' + id,
				precontractual
			}

		} else {
			data = {
				code: 404,
				status: 'error',
				message: 'No existe una solicitud precontractual con el número de consecutivo ' + id
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

/**
 * Controlador que actualiza una solicitud precontractual por el número de consecutivo
 * @name		actualizarSolicitudPrecontractual
 * @author		Santiago Ramirez Gaitan <santiagooo42@gmail.com>
 * @version		1.0.0
 * @access		public
 * 
 * @param 		{Request} req
 * @param 		{Response} res
 * 
 * @returns 
*/
export const actualizarSolicitudPrecontractual = async ( req: Request, res: Response ) => {
	let data: any = {};
	const { id } = req.params;
	const { body } = req;

	try {
		const precontractual = await Precontractual.findByPk( id );
		
		if( precontractual ) {
			// Validar si el documento anterior es igual al enviado en la petición
			const documento_anterior = precontractual?.getDataValue('documento_adjunto');
			
			if( documento_anterior && documento_anterior != body.documento_adjunto ) {
				const path = `./uploads/contratacion/${ documento_anterior }`;
				await fs.unlink( path, error => {
					if( error ) {
						data = {
							code: 500,
							status: 'error',
							message: 'No ha sido posible eliminar el documento cargado anteriormente',
							error
						}
						res.status(data.code).json(data);
					}
				});
			}
			
			// Si el estado es devuelto se actualiza a nuevo para que pueda ser visto por el área de jurídica
			if( precontractual?.getDataValue('estado') == '4' ) {
				body.estado = 1;
			}
			
			// Eliminar los campos que no se desean actualizar
			delete( body.id );
			delete( body.fecha_solicitud );
			delete( body.fecha_respuesta );
			delete( body.created_by );
			delete( body.createdAt );
			delete( body.updatedAt );

			await precontractual.update( body );

			// Enviar un correo de notificación al usuario
			enviarCorreoElectronicoContratacion( precontractual?.getDataValue('correo_electronico'), `Actualización de la Solicitud ${id}`, null, `La solicitud con número de consecutivo ${id} ha sido actualizada. Por favor, ingrese al aplicativo y revise los cambios realizados` )
				.then( resp => {
					console.log(resp);
				})
				.catch(err => {
					console.log(err);
				});
					
			data = {
				code: 200,
				status: 'success',
				message: 'Se ha actualizado la solicitud precontractual con el número de consecutivo ' + id,
				precontractual
			}

		} else {
			data = {
				code: 404,
				status: 'error',
				message: 'No existe una solicitud precontractual con el número de consecutivo ' + id
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

/**
 * Controlador que crea una nueva solicitud precontractual en el sistema
 * @name		crearSolicitudPrecontractual
 * @author		Santiago Ramirez Gaitan <santiagooo42@gmail.com>
 * @version		1.0.0
 * @access		public
 * 
 * @param 		{Request} req
 * @param 		{Response} res
 * 
 * @returns 
*/
export const crearSolicitudPrecontractual = async ( req: Request, res: Response ) => {
	let data: any = {};
	const { body } = req;

	try {
		// Asignar el valor de creado al estado: 1
		body.estado = 1;
		// Guardar el usuario logueado como creador del registro
		body.created_by = 1;

		const precontractual = Precontractual.build( body );
		await precontractual.save();
		
		// Enviar un correo de notificación al usuario
		enviarCorreoElectronicoContratacion( precontractual?.getDataValue('correo_electronico'), 'Solcitud de contrato', precontractual.getDataValue('createdAt'), `Se ha generado con éxito su solicitud con el número de radicado: ${precontractual.getDataValue('id')}` )
			.then( resp => {
				console.log(resp);
			})
			.catch(err => {
				console.log(err);
			});

		data = {
			code: 200,
			status: 'success',
			message: 'Se ha creado la solicitud precontractual correctamente en el sistema',
			precontractual
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

/**
 * Controlador que realiza una eliminación lógica de la solicitud precontractual
 * @name		eliminarSolicitudPrecontractual
 * @author		Santiago Ramirez Gaitan <santiagooo42@gmail.com>
 * @version		1.0.0
 * @access		public
 * 
 * @param 		{Request} req
 * @param 		{Response} res
 * 
 * @returns 
*/
export const eliminarSolicitudPrecontractual = async ( req: Request, res: Response ) => {
	let data: any = {};
	const { id } = req.params;

	try {
		const precontractual = await Precontractual.findByPk(id);
		if( precontractual ) {
			// Eliminación lógica
			await precontractual.update({ estado: 5 });
			data = {
				code: 200,
				status: 'success',
				message: 'Se ha eliminado correctamente la solicitud precontractual con número de consectuvo ' + id,
				precontractual
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
}

/**
 * Controlador que obtiene una solicitud por el número de consecutivo
 * @name		obtenerSolicitud
 * @author		Santiago Ramirez Gaitan <santiagooo42@gmail.com>
 * @version		1.0.0
 * @access		public
 * 
 * @param 		{Request} req
 * @param 		{Response} res
 * 
 * @returns 
*/
export const obtenerSolicitud = async ( req: Request, res: Response ) => {
	let data: any = {};
	const { id } = req.params;

	try {
		const precontractual = await Precontractual.findByPk( id, {
			include: [
				{
					model: ObservacionJuridica,
					as: 'comentarios_juridica'
				},
				{
					model: Documentacion,
					as: 'documentos'
				},
				{
					model: Presupuesto,
					as: 'presupuesto',
				},
			]
		});

		if( precontractual ) {
			data = {
				code: 200,
				status: 'success',
				precontractual
			}
		} else {
			data = {
				code: 404,
				status: 'error',
				message: 'No se ha encontrado una solicitud precontractual con el número de consecutivo ' + id,
				secondary: true
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

/**
 * Controlador que obtiene las solicitudes precontractuales activas
 * @name		obtenerSolicitudesActivas
 * @author		Santiago Ramirez Gaitan <santiagooo42@gmail.com>
 * @version		1.0.0
 * @access		public
 * 
 * @param 		{Request} req
 * @param 		{Response} res
 * 
 * @returns 
*/
export const obtenerSolicitudesActivas = async ( req: Request, res: Response ) => {
	let data: any = {};

	try {
		const precontractuales = await Precontractual.findAll({
			where: { 
				estado: 1
			},
			order: [
				[ 'createdAt', 'DESC' ]
			]
		});

		if( precontractuales && precontractuales.length > 0 ) {
			data = {
				code: 200,
				status: 'success',
				precontractuales
			}
		} else {
			data = {
				code: 404,
				status: 'error',
				message: 'No se han encontrado solicitudes precontractuales activas en la base de datos'
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

/**
 * Controlador que obtiene las solicitudes precontractuales para el área de jurídica
 * @name		obtenerSolicitudesJuridica
 * @author		Santiago Ramirez Gaitan <santiagooo42@gmail.com>
 * @version		1.0.0
 * @access		public
 * 
 * @param 		{Request} req
 * @param 		{Response} res
 * 
 * @returns 
*/
export const obtenerSolicitudesJuridica = async ( req: Request, res: Response ) => {
	let data: any = {};

	try {
		const precontractuales = await Precontractual.findAll({
			where: { 
				estado: {
					[Op.or]: [1, 3, 6, 7]
				}
			},
			order: [
				[ 'estado', 'ASC' ],
				[ 'createdAt', 'DESC' ],
			]
		});

		if( precontractuales && precontractuales.length > 0 ) {
			data = {
				code: 200,
				status: 'success',
				precontractuales
			}
		} else {
			data = {
				code: 404,
				status: 'error',
				message: 'No se han encontrado solicitudes precontractuales activas en la base de datos'
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

/**
 * Controlador que obtiene todas las solicitudes contractuales
 * @name		obtenerSolicitudesPrecontractuales
 * @author		Santiago Ramirez Gaitan <santiagooo42@gmail.com>
 * @version		1.0.0
 * @access		public
 * 
 * @param 		{Request} req
 * @param 		{Response} res
 * 
 * @returns 
*/
export const obtenerSolicitudesPrecontractuales = async ( req: Request, res: Response ) => {
	let data: any = {};

	try {
		const precontractuales = await Precontractual.findAll({
			order: [
				[ 'createdAt', 'DESC' ]
			]
		});

		if( precontractuales ) {
			data = {
				code: 200,
				status: 'success',
				precontractuales
			}
		} else {
			data = {
				code: 404,
				status: 'error',
				message: 'No se han encontrado solicitudes precontractuales en la base de datos'
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

/**
 * Controlador que obtiene todas las solicitudes precontractuales del usuario logueado
 * @name		obtenerSolicitudesPrecontractuales
 * @author		Santiago Ramirez Gaitan <santiagooo42@gmail.com>
 * @version		1.0.0
 * @access		public
 * 
 * @param 		{Request} req
 * @param 		{Response} res
 * 
 * @returns 
*/
export const obtenerSolicitudesPrecontractualesPorUsuario = async ( req: Request, res: Response ) => {
	let data: any = {};
	let usuario_activo = 1;

	try {
		const precontractuales = await Precontractual.findAll({
			where: { 
				created_by: usuario_activo
			},
			order: [
				[ 'createdAt', 'DESC' ]
			]
		});

		if( precontractuales && precontractuales.length > 0 ) {
			data = {
				code: 200,
				status: 'success',
				precontractuales
			}
		} else {
			data = {
				code: 404,
				status: 'error',
				message: 'No se han encontrado solicitudes precontractuales para el usuario logueado'
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