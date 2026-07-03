import { Router } from 'express';
import { upload } from '../utils/cloudinary.js';
import { 
    processLogin, 
    processLogout, 
    fetchAllRecords, 
    removeRecord, 
    modifyRecord 
} from '../controller/pacientes.js';

const router = Router();

router.post('/login', processLogin);
router.post('/logout', processLogout);

router.get('/', fetchAllRecords);
router.delete('/:id', removeRecord);
router.put('/:id', upload.single('profilePhoto'), modifyRecord); 

export default router;