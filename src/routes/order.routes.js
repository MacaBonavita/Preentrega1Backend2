import { Router } from 'express';
import { createOrder, getOrders, getOrderById } from '../controllers/order.controller.js';
import { isAuthenticated } from '../middlewares/auth.middleware.js';

const router = Router();

router.post('/', isAuthenticated, createOrder);
router.get('/', isAuthenticated, getOrders);
router.get('/:id', isAuthenticated, getOrderById);

export default router;