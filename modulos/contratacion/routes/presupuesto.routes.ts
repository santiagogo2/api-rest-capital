import { Router } from "express";
import { check } from "express-validator";

// Middlewares
import validarCampos from "../../../middlewares/validar-campos";

// Controladores
import { actualizarSolicitudPresupuestal, crearCDPCRPPresupuesto, obtenerSolicitudes, obtenerSolicitudesActivas, obtenerSolicitudPresupuesto } from '../controllers/presupuesto.controller';
import { validarJWT } from '../../../middlewares/validar-jwt';

const router = Router();

router.get('/adicionales/obtenerSolicitudes', validarJWT, obtenerSolicitudesActivas);
router.get('/adicionales/obtenerSolicitudesActivas', validarJWT, obtenerSolicitudesActivas);
router.get('/:id', validarJWT, obtenerSolicitudPresupuesto);
router.post('/',
	[
		validarJWT,
		check('precontractual_id', 'El id de la solicitud precontractual es requerido').not().isEmpty(),
		check('descripcion', 'Debe ingresar la descripción de la solicitud presupuestal').not().isEmpty(),
		validarCampos
	],
crearCDPCRPPresupuesto);
router.put('/:id',
	[
		validarJWT,
		check('motivo', 'Debe ingresar la respuesta de la solicitud presupuestal').not().isEmpty(),
		check('descripcion', 'Debe ingresar la descripción de la solicitud presupuestal').not().isEmpty(),
		check('tipo_certificado', 'Debe ingresar el tipo de certificado').not().isEmpty(),
		check('estado', 'Debe ingresar el estado de la solicitud').not().isEmpty(),
		validarCampos
	],
actualizarSolicitudPresupuestal);

export default router;