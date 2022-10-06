import express, { Application } from 'express';
import cors from 'cors';
import path from 'path';

// Rutas
import contratacionDocumentacionRoutes from '../modulos/contratacion/routes/documentacion.routes';
import contratacionJuridicaRoutes from '../modulos/contratacion/routes/juridica.routes';
import contratacionPrecontractualRoutes from '../modulos/contratacion/routes/precontractual.routes';
import contratacionPresupuestoRoutes from '../modulos/contratacion/routes/presupuesto.routes';

import emailRoutes from '../routes/nodemailer.routes';
import modulosRoutes from '../routes/modulos.routes';
import userRoutes from '../routes/usuarios.routes';
import uploadsRoutes from '../routes/uploads.routes';

import database from '../database/connection';

class Server {
	private app: Application;
	private port: string;
	private api_paths = {
		contratacion_documentacion: '/api/contratacion/documentacion',
		contratacion_juridica: '/api/contratacion/juridica',
		contratacion_precontractual: '/api/contratacion/precontractual',
		contratacion_presupuesto: '/api/contratacion/presupuesto',

		email: '/api/email',
		modulos: '/api/modulos',
		uploads: '/api/upload',
		usuarios: '/api/usuarios',
	};

	constructor(){
		this.app = express();
		this.port = process.env.PORT || '8000';
	
		// Metodos iniciales
		this.conectarBaseDatos();
		this.middlewares();
		this.routes();
	}

	async conectarBaseDatos() {
		try {
			await database.authenticate();
		} catch (error) {
			throw new Error( 'No se ha generado la conexión a la base de datos. La aplicación no puede continuar' );			
		}
	}
	
	listen() {
		this.app.listen( this.port, () => {
			console.log('Servidor corriendo en el puerto ' + this.port);
		});
	}

	middlewares() {
		// Configuración del CORS
		this.app.use( cors() );

		// Lectura del body
		this.app.use( express.json() );

		// Carpeta pública
		this.app.use( express.static('public') );
	}

	routes() {
		this.app.use( this.api_paths.contratacion_documentacion, contratacionDocumentacionRoutes);
		this.app.use( this.api_paths.contratacion_juridica, contratacionJuridicaRoutes);
		this.app.use( this.api_paths.contratacion_precontractual, contratacionPrecontractualRoutes);
		this.app.use( this.api_paths.contratacion_presupuesto, contratacionPresupuestoRoutes);

		this.app.use( this.api_paths.email, emailRoutes);
		this.app.use( this.api_paths.modulos, modulosRoutes);
		this.app.use( this.api_paths.uploads, uploadsRoutes );
		this.app.use( this.api_paths.usuarios, userRoutes );

		// Ruta que le permite a la aplicación usar siempre la ruta base para no perder la configuración de angular
		// this.app.get('*', (req, res) => {
		// 	res.sendFile( path.resolve(__dirname, '../../public/index.html') );
		// });
	}
}

export default Server;