import express from 'express';
import { protectRoute } from '../middleware/auth.middleware.js';
import { deleteAllMessages, deleteSingleMessage, getMessage, getUserForSidebar, sendMessage } from '../controllers/message.controllers.js';

const router = express.Router();

router.get("/users",protectRoute,getUserForSidebar)
router.get("/:id", protectRoute, getMessage)
router.post("/send/:id", protectRoute, sendMessage)
router.put("/deleteOne/:messageId/:userId", protectRoute,deleteSingleMessage)
router.put("/deleteAll/:userId/:selectedUserId", protectRoute, deleteAllMessages)

export default router;