import express from 'express';

import { createUser, deleteImage, getProfile, getPublicProfile, loginUser, updatePhoto, updateProfile, updateVcard } from '../controllers/usuario.controller.js';

const router = express.Router();

// Usuario
router.route('/profile')
    .get(getProfile)
    .patch(updateProfile)
// Fotrografía
router.route('/photo')
    .patch(updatePhoto)
    .delete(deleteImage);
// Vcard
router.route('/vcard').patch(updateVcard)
// Perfil público de usuarios
router.route('/:username').get(getPublicProfile);
// Autenticación
router.route('/register').post(createUser);
router.route('/login').post(loginUser);


export default router;