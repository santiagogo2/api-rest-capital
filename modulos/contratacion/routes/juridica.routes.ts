import { Router } from "express";
import { check } from "express-validator";

// Middlewares
import validarCampos from "../../../middlewares/validar-campos";

// Controladores
import { crearObservacionJuridica } from "../controllers/juridica.controller";
import { validarJWT } from '../../../middlewares/validar-jwt';

const router = Router();

router.post('/:estado',
	[
		validarJWT,
		check('precontractual_id', 'El id de la solicitud precontractual es requerido').not().isEmpty(),
		check('observaciones', 'Debe ingresar las observaciones del rechazo').not().isEmpty(),
		validarCampos
	],
crearObservacionJuridica);

export default router;