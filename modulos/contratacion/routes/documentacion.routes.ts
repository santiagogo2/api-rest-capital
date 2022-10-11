import { Router } from "express";
import { check } from "express-validator";

// Middlewares
import validarCampos from "../../../middlewares/validar-campos";
import { validarJWT } from '../../../middlewares/validar-jwt';

// Controladores
import { actualizarDocumentoAdjunto, actualizarEstadoDocumentoAdjunto, crearDocumentoAdjunto } from "../controllers/documentacion.controller";

const router = Router();

router.post('/',
	[
		validarJWT,
		check('precontractual_id', 'El id de la solicitud precontractual es requerido').not().isEmpty(),
		check('id_documento', 'Debe ingresar el identificador del documento que está guardando').not().isEmpty(),
		check('documento', 'Debe ingresar el nombre del documento guardado en el servidor').not().isEmpty(),
		check('fecha_vigencia', 'Debe ingresar la fecha de la vigencia del documento').exists(),
		check('observacion', 'Debe ingresar una observación para el documento').exists(),
		validarCampos
	],
crearDocumentoAdjunto);
router.put('/adicional/actualizarEstadoDocumentoAdjunto/:id',
	[
		validarJWT,
		check('estado', 'Debe ingresar el estado del documento').not().isEmpty(),
		check('fecha_vigencia', 'Debe ingresar la fecha de la vigencia del documento').exists(),
		check('observacion', 'Debe ingresar una observación para el documento').exists(),
		validarCampos
	],
actualizarEstadoDocumentoAdjunto);
router.put('/adicional/:id',
	[
		validarJWT,
		check('documento', 'Debe ingresar el nombre del documento guardado en el servidor').not().isEmpty(),
		validarCampos
	],
actualizarDocumentoAdjunto);

export default router;