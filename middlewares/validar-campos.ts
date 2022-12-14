import { Request, Response, NextFunction } from 'express';
import { validationResult } from 'express-validator';

const validarCampos = (req: Request, res: Response, next: NextFunction) => {
	const errores = validationResult( req );

	if( !errores.isEmpty() ) {
		return res.status(400).json({			
			code: 400,
			status: 'error',
			errores: errores.mapped()
		});
	}

	next();
}

export default validarCampos;