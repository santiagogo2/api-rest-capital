import { Router } from 'express';
import { check } from 'express-validator';
import validarCampos from '../middlewares/validar-campos';

// Controladores
import { obtenerModulosActivos } from '../controllers/modulos.controller';

const router = Router();

router.get('/', obtenerModulosActivos);

export default router;