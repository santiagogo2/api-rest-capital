import { Request, Response } from 'express';
import nodemailer from 'nodemailer';
import hbs from 'nodemailer-express-handlebars';

const transport = nodemailer.createTransport({
	host: 'smtp.office365.com',
	port: 587,
	secure: false,
	auth: {
		user: process.env.MAIL_USER,
		pass: process.env.MAIL_PASSWORD
	}
});
transport.use('compile', hbs({
	viewEngine: {
		partialsDir: './views/',
		extname: './views/',
		defaultLayout: false
	},
	viewPath: './views/',
	extName: '.handlebars'
}));

/**
 * Controlador que envía una notificación por correo electrónico de los cambios realizados en contratación
 * @name		enviarCorreoElectronicoContratacion
 * @author		Santiago Ramirez Gaitan <santiagooo42@gmail.com>
 * @version		1.0.0
 * @access		public
 * 
 * @param 		{Request} req
 * @param 		{Response} res
 * 
 * @returns 
*/
// export const enviarCorreoElectronicoContratacion = ( req: Request, res: Response ) => {
// 	let data: any = {};

// 	let mail_options = {
// 		from: 'Remitente',
// 		to: 'profesional.desarrollo3@capitalsalud.gov.co',
// 		subject: 'Notificación Capital Salud EPS',
// 		text: 'Esto es una prueba del envío del correo',
// 		template: 'notificaciones-contratacion',	
// 		context: {
// 			id_solicitud: 1,
// 			descripcion: 'Esta es una prueba de la descripción'
// 		}
// 	}

// 	transport.sendMail( mail_options, ( error, info ) => {
// 		if( error ) {
// 			data = {
// 				code: 500,
// 				status: 'error',
// 				message: error.message,
// 			}
// 		} else {
// 			data = {
// 				code: 200,
// 				status: 'success',
// 				message: 'Se ha enviado correctamente la notificación del cambio al correo electrónico',
// 			}
// 		}
// 	});
// };



/**
 * Función que envía una notificación por correo electrónico de los cambios realizados en contratación
 * @name		enviarCorreoElectronicoContratacion
 * @author		Santiago Ramirez Gaitan <santiagooo42@gmail.com>
 * @version		1.0.0
 * @access		public
 * 
 * @param 		{string} correo_electronico
 * @param 		{string} asunto
 * @param 		{string} fecha_creacion
 * @param 		{string} descripcion
 * 
 * @returns 
*/
export function enviarCorreoElectronicoContratacion( correo_electronico: string, asunto: string, fecha_creacion: string|null, descripcion: string ) {
	return new Promise((resolve, reject) => {
		fecha_creacion = fecha_creacion ? obtenerFechaActual( fecha_creacion ) : null;

		let mail_options = {
			from: 'Notificaciones Capital Salud EPS <no_reply@capitalsalud.gov.co>',
			to: correo_electronico,
			subject: asunto,
			template: 'notificaciones-contratacion',	
			context: {
				fecha_creacion: fecha_creacion,
				descripcion: descripcion
			}
		}
	
		transport.sendMail( mail_options, ( error, info ) => {
			if( error ) {
				reject( error );
			} else {
				resolve( 'Se ha enviado correctamente la notificación del cambio al correo electrónico' );
			}
		});
	})
};

function addZero(numero: any) {
	if ( numero < 10 ) {
		numero = '0' + numero.toString();
	}
	return numero;
}

function obtenerFechaActual( date: any ) {
	date = new Date( date );
	const day = addZero( date.getDate() );
	let month = date.getMonth() + 1;
	month = addZero( month );
	const year = date.getFullYear();
	var hour = date.getHours();
    var minute = addZero( date.getMinutes() );
    var sAMPM = "AM";
	return `${day}/${month}/${year} ${hour}:${minute} ${sAMPM}`;
}