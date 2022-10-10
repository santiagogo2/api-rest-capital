import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

export const validarJWT = (req: Request | any, res: Response, next: NextFunction) => {
	// Leer el token de los headers
	const token = req.header('x-token');

	if( !token ) {		
		return res.status(401).json({			
			code: 400,
			status: 'error',
			message: 'No hay un token en la petición'
		});
	}

	try {
		const secret_key = process.env.JWT_SECRET;
		const secret_string: any = secret_key?.toString();
		const usuario: any = jwt.verify( token, secret_string );

		req.usuario = usuario;
		next();
	} catch (error) {
		return res.status(401).json({			
			code: 401,
			status: 'error',
			message: 'El token ingresado no es correcto'
		});
	}
}