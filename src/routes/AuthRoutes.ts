import { Router } from 'express';
import { check } from 'express-validator';

import { validarCampos, validarJWT } from '../middlewares/index.js';
import AuthController from "../controllers/AuthController.ts";

const router = Router();
const controller = new AuthController();

/* Login */
router.post("/login", [
    check('correo', 'El correo es obligatorio y debe tener un formato valido').not().isEmpty().isEmail(),
    check('password', 'El Password es obligatorio y debe de ser un string').not().isEmpty().isString(),
    check('password', 'El Password debe contener entre 6 y 15 Caracteres').isLength({ min: 6, max: 15 }),
    validarCampos
], controller.login);

/* Validar y revalidar token */
router.get("/renew", [
    validarJWT
], controller.renewToken);

/* Cambiar Contraseña */
router.put('/change-password', [
    check('correo', 'El Correo no es valido').not().isEmpty().isEmail(),
    check('password', 'El Password debe contener entre 6 y 15 Caracteres').not().isEmpty().isLength({ min: 6, max: 15 }),
    validarCampos
], controller.updateUserPassword);


export default router;