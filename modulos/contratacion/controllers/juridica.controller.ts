import { Request, Response } from 'express';

// Importar funciones
import { enviarCorreoElectronicoContratacion } from "../../../controllers/nodemailer.controller";

// Modelos
import ObservacionJuridica from '../models/ObservacionJuridica';
import Precontractual from '../models/Precontractual';

export const crearObservacionJuridica = async ( req: Request, res: Response ) => {
	let data: any = {};
	const { body } = req;
	const { estado } = req.params;

	try {
		// Actualizar el estado de la solicitud		
		const solicitud_id = body.precontractual_id;
		const precontractual = await Precontractual.findByPk( solicitud_id );

		if( precontractual ) {
			// Actualizar el estado de la solicitud
			precontractual.update({
				estado: estado
			});
			// Guardar el usuario logueado como creador del registro
			body.created_by = 1;
	
			const observaciones = ObservacionJuridica.build( body );
			await observaciones.save();

			// Enviar un correo de notificación al usuario
			enviarCorreoElectronicoContratacion( precontractual?.getDataValue('correo_electronico'), `Actualización de la Solicitud ${solicitud_id}`, null, `La solicitud con número de consecutivo ${solicitud_id} ha sido devuelta con una observación. Por favor, ingrese al aplicativo y revise los cambios realizados` )
			.then( resp => {
				console.log(resp);
			})
			.catch(err => {
				console.log(err);
			});
	
			data = {
				code: 200,
				status: 'success',
				message: 'Se ha creado una nueva observación en el sistema y se ha actualizado el estado de la solicitud',
				observaciones
			}		
			
		} else {
			data = {
				code: 404,
				status: 'error',
				message: 'No existe una solicitud precontractual con el número de consecutivo ' + solicitud_id
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