import { Router } from 'express';
import expressFileUpload from 'express-fileupload';

// Controladores
import { cargarArchivo, obtenerArchivo } from '../controllers/uploads.controller';

const router = Router();
router.use( expressFileUpload() );

router.get('/:modulo/:archivo', obtenerArchivo);
router.post('/:modulo', cargarArchivo);

export default router;