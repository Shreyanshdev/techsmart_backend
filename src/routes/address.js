import express from 'express';
import {
    addAddress,
    getAddresses,
    updateAddress,
    deleteAddress,
    getAddressById,
} from '../controllers/address.js';
import { verifyToken } from '../middleware/auth.js';
import { requireCustomer } from '../middleware/roleAuth.js';

const router = express.Router();

// Only customers should manage addresses
router.use(verifyToken);
router.use(requireCustomer);

router.post('/', addAddress);
router.get('/', getAddresses);
router.put('/:id', updateAddress);
router.delete('/:id', deleteAddress);
router.get('/:id', getAddressById);

export default router;