import { Request, Response } from 'express';
import Modulo from '../models/Modulo';

/**
 * Obtiene los Módulos activos en el sistema
 * @name		obtenerModulosActivos
 * @author		Santiago Ramirez Gaitan <santiagooo42@gmail.com>
 * @version		1.0.0
 * @access		public
 * 
 * @param 		{Request} req
 * @param 		{Response} res
 * 
 * @returns 
*/
export const obtenerModulosActivos = async ( req: Request, res: Response ) => {
	let data: any = {};

	try {
		const modulos = await Modulo.findAll({
			where: { 
				estado: 1
			},
			order: [
				[ 'nombre', 'DESC' ]
			]
		});

		if( modulos ) {
			data = {
				code: 200,
				status: 'success',
				modulos
			}
		} else {
			data = {
				code: 404,
				status: 'error',
				message: 'No se han encontrado modulos activos en el sistema'
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