import { Router } from 'express';
import { check } from 'express-validator';
import validarCampos from '../middlewares/validar-campos';

// Controladores
import { getUsuarios, getUsuario, postUsuario, putUsuario, deleteUsuario, autenticarUsuarioLDAP } from '../controllers/usuarios.controllers';

const router = Router();

router.get('/', getUsuarios);
router.get('/:id', getUsuario);
router.get('/adicionales/autenticarUsuarioLDAP', autenticarUsuarioLDAP);
router.post('/',
	[
		check('nombre', 'El nombre es obligatorio').not().isEmpty(),
		check('email', 'El correo electrónico es obligatorio').not().isEmpty(),
		validarCampos,
	],
postUsuario);
router.put('/:id', putUsuario);
router.delete('/:id', deleteUsuario);

export default router;