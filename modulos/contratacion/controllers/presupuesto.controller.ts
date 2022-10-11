import { Request, Response } from 'express';
import fs from 'fs';

// Importar funciones
import { enviarCorreoElectronicoContratacion } from "../../../controllers/nodemailer.controller";

// Modelos
import Presupuesto from '../models/Presupuesto';
import Precontractual from '../models/Precontractual';
import Documentacion from '../models/Documentacion';

/**
* Controlador que actualiza la solicitud presupuestal por el número de consecutivo
* @name			actualizarSolicitudPresupuestal
* @author		Santiago Ramirez Gaitan <santiagooo42@gmail.com>
* @version		1.0.0
* @access		public
* 
* @param 		{Request} req
* @param 		{Response} res
* 
* @returns 
*/
export const actualizarSolicitudPresupuestal = async ( req: Request, res: Response ) => {
   let data: any = {};
   const { id } = req.params;
   const { body } = req;

   try {
	   const presupuesto = await Presupuesto.findByPk( id );
	   
	   if( presupuesto ) {
		   // Validar si el documento anterior es igual al enviado en la petición
		   const documento_anterior = presupuesto?.getDataValue('documento_adjunto');
		   
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
		   
			// Eliminar los campos que no se desean actualizar
			const id_solicitud = body.precontractual_id;
			let tipo_certificado = presupuesto?.getDataValue('tipo_certificado') == 1 ? 'CDP' : 'CRP';

			delete( body.id );
			delete( body.precontractual_id );
			delete( body.created_by );
			delete( body.createdAt );
			delete( body.updatedAt );

			await presupuesto.update( body );

			// Obtener la solicitud para envíar la notificación
			const precontractual = await Precontractual.findByPk( id_solicitud );

			// Enviar un correo de notificación al usuario
			enviarCorreoElectronicoContratacion( precontractual?.getDataValue('correo_electronico'), `Respuesta a la solcitud de contrato ${tipo_certificado}`, null, `Se ha dado respuesta a su solicitud de contrato / ${tipo_certificado} # ${id_solicitud} la cual podrá ser consultada en el aplicativo web.` )
				.then( resp => {
					console.log(resp);
				})
				.catch(err => {
					console.log(err);
				});
				   
			data = {
				code: 200,
				status: 'success',
				message: 'Se ha actualizado la solicitud presupuestal con el número de consecutivo ' + id,
				presupuesto
			}

	   } else {
			data = {
				code: 404,
				status: 'error',
				message: 'No existe una solicitud presupuestal con el número de consecutivo ' + id
			};
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
 * Controlador que guarda una nueva solicitud presupuestal
 * @name		crearCDPCRPPresupuesto
 * @author		Santiago Ramirez Gaitan <santiagooo42@gmail.com>
 * @version		1.0.0
 * @access		public
 * 
 * @param 		{Request} req
 * @param 		{Response} res
 * 
 * @returns 
*/
export const crearCDPCRPPresupuesto = async ( req: Request | any, res: Response ) => {
	let data: any = {};
	const { body } = req;

	try {
		// Asignar el estado a una nueva solicitud
		body.estado = 1;
		// Guardar el usuario logueado como creador del registro
		body.created_by = req.usuario.user.employeeID;

		const presupuesto = Presupuesto.build( body );
		await presupuesto.save();
		let tipo_certificado = presupuesto?.getDataValue('tipo_certificado') == 1 ? 'CDP' : 'CRP';

		// Enviar un correo de notificación al usuario
		enviarCorreoElectronicoContratacion( 'profesional.desarrollo3@capitalsalud.gov.co', `Solicitud de ${tipo_certificado}`, null, `Se ha generado una solicitud de ${tipo_certificado} con número de radicado: ${presupuesto?.getDataValue('id')}` )
			.then( resp => {
				console.log(resp);
			})
			.catch(err => {
				console.log(err);
			});

		data = {
			code: 200,
			status: 'success',
			message: 'Se ha guardado una nueva solicitud a presupuesto',
			presupuesto
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
 * Controlador que obtiene las solicitudes activas para el área de presupuesto
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
	const { id } = req.params;

	try {
		const presupuestos = await Presupuesto.findAll({
			where: {
				estado: 1
			},
			include: [
				{
					model: Precontractual,
					as: 'solicitud_precontractual'
				}
			],
			order: [
				[ 'createdAt', 'DESC' ]
			]
		});

		if( presupuestos ) {
			data = {
				code: 200,
				status: 'success',
				presupuestos
			}
		} else {
			data = {
				code: 404,
				status: 'error',
				message: 'No se han encontrado solicitudes a presupuesto activas'
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
 * Controlador que obtiene la solicitud presupuestal por el número de consecutivo
 * @name		obtenerSolicitudPresupuesto
 * @author		Santiago Ramirez Gaitan <santiagooo42@gmail.com>
 * @version		1.0.0
 * @access		public
 * 
 * @param 		{Request} req
 * @param 		{Response} res
 * 
 * @returns 
*/
export const obtenerSolicitudPresupuesto = async( req: Request, res: Response ) => {
	let data: any = {};
	let { id } = req.params;

	try {
		const presupuesto = await Presupuesto.findByPk( id, {
			include: [
				{
					model: Precontractual,
					as: 'solicitud_precontractual',
					include: [
						{
							model: Documentacion,
							as: 'documentos'
						}
					]
				},
			],
			order: [
				[ 'createdAt', 'DESC' ]
			]
		});

		if( presupuesto ) {
			data = {
				code: 200,
				status: 'success',
				presupuesto
			}
		} else {
			data = {
				code: 404,
				status: 'error',
				message: 'No se ha encontrado una solicitud presupuestal con el número de consecutivo ' + id,
				secondary: true
			}
		}
	} catch (error) {
		console.log(error)
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