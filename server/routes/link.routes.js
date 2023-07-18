import express from 'express';

import { createNewLink, deleteLink } from '../controllers/link.controller.js';

const router = express.Router();

// Crear Links
router.route('/')
    .post(createNewLink)
    .delete(deleteLink)

export default router;