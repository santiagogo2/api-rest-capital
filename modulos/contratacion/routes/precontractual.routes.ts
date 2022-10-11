import { Router } from "express";
import { check } from "express-validator";

// Middlewares
import validarCampos from "../../../middlewares/validar-campos";
import { validarJWT } from '../../../middlewares/validar-jwt';

// Controladores
import { obtenerSolicitud, obtenerSolicitudesActivas, obtenerSolicitudesJuridica, obtenerSolicitudesPrecontractuales, crearSolicitudPrecontractual, actualizarSolicitudPrecontractual, eliminarSolicitudPrecontractual, obtenerSolicitudesPrecontractualesPorUsuario, actualizarEstadoSolicitudPrecontractual } from '../controllers/precontractual.controller';

const router = Router();

router.get('/', validarJWT, obtenerSolicitudesPrecontractuales);
router.get('/:id', validarJWT, obtenerSolicitud);
router.get('/adicionales/obtenerSolicitudesActivas', validarJWT, obtenerSolicitudesActivas);
router.get('/adicionales/obtenerSolicitudesJuridica', validarJWT, obtenerSolicitudesJuridica);
router.get('/adicionales/obtenerSolicitudesPrecontractualesPorUsuario', validarJWT, obtenerSolicitudesPrecontractualesPorUsuario);
router.get('/adicionales/actualizarEstadoSolicitudPrecontractual/:id/:estado', validarJWT, actualizarEstadoSolicitudPrecontractual);
router.post('/',
	[
		validarJWT,
		check('primer_nombre', 'El primer nombre es obligatorio').not().isEmpty(),
		check('primer_apellido', 'El primer apellido es obligatorio').not().isEmpty(),
		check('correo_electronico', 'El correo electrónico es obligatorio').not().isEmpty(),
		check('correo_electronico', 'El correo electrónico debe ser un email').normalizeEmail().isEmail(),
		check('correo_electronico', 'El correo electrónico debe tener como domínio @capitalsalud.gov.co').matches('[a-z0-9._%+-]+@capitalsalud.gov.co'),
		check('cargo', 'El cargo es obligatorio').not().isEmpty(),
		check('area_solicitante', 'El area solicitante es obligatorio').not().isEmpty(),
		check('descripcion_solicitud', 'El descripción de la solicitud es obligatorio').not().isEmpty(),
		check('tipo_contrato', 'El tipo de contrato es obligatorio').not().isEmpty(),
		check('documento_adjunto', 'El documento adjunto es obligatorio').not().isEmpty(),
		validarCampos
	],
crearSolicitudPrecontractual);
router.put('/:id',
	[
		validarJWT,
		check('primer_nombre', 'El primer nombre es obligatorio').not().isEmpty(),
		check('primer_apellido', 'El primer apellido es obligatorio').not().isEmpty(),
		check('correo_electronico', 'El correo electrónico es obligatorio').not().isEmpty(),
		check('correo_electronico', 'El correo electrónico debe ser un email').normalizeEmail().isEmail(),
		check('correo_electronico', 'El correo electrónico debe tener como domínio @capitalsalud.gov.co').matches('[a-z0-9._%+-]+@capitalsalud.gov.co'),
		check('cargo', 'El cargo es obligatorio').not().isEmpty(),
		check('area_solicitante', 'El area solicitante es obligatorio').not().isEmpty(),
		check('descripcion_solicitud', 'El descripción de la solicitud es obligatorio').not().isEmpty(),
		check('tipo_contrato', 'El tipo de contrato es obligatorio').not().isEmpty(),
		validarCampos
	],
actualizarSolicitudPrecontractual);
router.delete('/:id', validarJWT, eliminarSolicitudPrecontractual);

export default router;