import { Router } from 'express';
import { check } from 'express-validator';

// Middelwares
import validarCampos from '../middlewares/validar-campos';
import { validarJWT } from '../middlewares/validar-jwt';

// Controladores
import { autenticarUsuario, obtenerIdentidadUsuario } from '../controllers/usuarios.controllers';

const router = Router();

router.get('/adicionales/obtenerIdentidadUsuario', validarJWT, obtenerIdentidadUsuario);
router.post('/adicionales/autenticarUsuario',
	[
		check('nombre_usuario', 'Debe ingresar el nombre de usuario').not().isEmpty(),
		check('password', 'Debe ingresar la contraseña del usuario').not().isEmpty(),
		validarCampos
	],
autenticarUsuario);

export default router;