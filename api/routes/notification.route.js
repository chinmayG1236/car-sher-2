import express from 'express';
import { addNotification  } from '../controllers/notification.controller.js';
import { getNotification } from '../controllers/notification.controller.js';
import { MarkAsRead } from '../controllers/notification.controller.js';
const router=express.Router();

router.post('/add',addNotification);
router.get('/get/',getNotification);
router.put('/markAsRead/:id',MarkAsRead);

export default router;