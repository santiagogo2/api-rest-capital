import jwt from 'jsonwebtoken';

/**
 * Función que crea el jsonwebtoken para el aplicativo con el inicio de sesión
 * @name		generarJWT
 * @author		Santiago Ramirez Gaitan <santiagooo42@gmail.com>
 * @version		1.0.0
 * @access		public
 * 
 * @param 		{any} user
 * 
 * @returns 
*/
export const generarJWT = async ( user:any ) => {
	return new Promise( (resolve, reject) => {
		const secret_key = process.env.JWT_SECRET;
		const secret_string: any = secret_key?.toString();

		const payload = {
			user,
		};
	
		jwt.sign( payload, secret_string, {
			expiresIn: '12h'
		}, (error, token) => {
			if( error ) {
				console.log(error);
				reject( 'No se pudo generar el JWT' );
			} else {
				resolve( token );
			}
		});
	});
}