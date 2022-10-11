import { Request, Response } from 'express';
import { Op } from 'sequelize';
import fs from 'fs';

// Modelos
import Documentacion from '../models/Documentacion';

/**
 * Controlador que actualiza un documento adjunto con lo enviado en el request
 * @name		actualizarDocumentoAdjunto
 * @author		Santiago Ramirez Gaitan <santiagooo42@gmail.com>
 * @version		1.0.0
 * @access		public
 * 
 * @param 		{Request} req
 * @param 		{Response} res
 * 
 * @returns 
*/
export const actualizarDocumentoAdjunto = async ( req: Request, res: Response ) => {
	let data: any = {};
	const { id } = req.params;
	const { body } = req;

	try {
		const documentacion = await Documentacion.findByPk( id );
		
		if( documentacion ) {
			// Validar si el documento anterior es igual al enviado en la petición
			const documento_anterior = documentacion?.getDataValue('documento');
			
			if( documento_anterior && documento_anterior != body.documento ) {
				body.estado = 1;
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

			// Eliminar los campos que no se desean actualizar
			delete( body.id );
			delete( body.precontractual_id );
			delete( body.id_documento );
			delete( body.created_by );
			delete( body.createdAt );
			delete( body.updatedAt );

			await documentacion.update( body );
					
			data = {
				code: 200,
				status: 'success',
				message: 'Se ha actualizado el documento con el número de consecutivo ' + id,
				documentacion
			}

		} else {
			data = {
				code: 404,
				status: 'error',
				message: 'No existe un documento con el número de consecutivo ' + id
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
 * Controlador que actualiza el estado del documento seleccionado por el usuario
 * @name		actualizarEstadoDocumentoAdjunto
 * @author		Santiago Ramirez Gaitan <santiagooo42@gmail.com>
 * @version		1.0.0
 * @access		public
 * 
 * @param 		{Request} req
 * @param 		{Response} res
 * 
 * @returns 
*/
export const actualizarEstadoDocumentoAdjunto = async ( req: Request, res: Response ) => {
	let data: any = {};
	const { id } = req.params;
	const { body } = req;

	try {
		const documentacion = await Documentacion.findByPk( id );
		
		if( documentacion ) {
			await documentacion.update({
				estado: body.estado,
				fecha_vigencia: body.fecha_vigencia,
				observacion: body.observacion,
			});
					
			data = {
				code: 200,
				status: 'success',
				message: 'Se ha actualizado el documento con el número de consecutivo ' + id,
				documentacion
			}

		} else {
			data = {
				code: 404,
				status: 'error',
				message: 'No existe un documento con el número de consecutivo ' + id
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
 * Controlador que guarda un nuevo valor del documento en la base de datos
 * @name		crearDocumentoAdjunto
 * @author		Santiago Ramirez Gaitan <santiagooo42@gmail.com>
 * @version		1.0.0
 * @access		public
 * 
 * @param 		{Request} req
 * @param 		{Response} res
 * 
 * @returns 
*/
export const crearDocumentoAdjunto = async ( req: Request | any, res: Response ) => {
	let data: any = {};
	const { body } = req;

	try {
		// Guardar el usuario logueado como creador del registro
		body.created_by = req.usuario.user.employeeID;
		body.estado = 1;

		const documentacion = Documentacion.build( body );
		await documentacion.save();

		data = {
			code: 200,
			status: 'success',
			message: 'Se ha guardado un nuevo documento asociado a la solicitud ' + body.precontractual_id,
			documentacion
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
