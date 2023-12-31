import { Router } from 'express';
import { check } from 'express-validator';

import TestController from "../controllers/TestController.ts";
import { Color } from '../database/enums/index.ts';
import { esAdminRole, validarCampos, validarJWT } from '../middlewares/index.js';

const router = Router();
const controller = new TestController();

router.get("/", [
    validarJWT,
    esAdminRole
], controller.testMethodGET);

router.post('/', [
    check('nombreCompleto', 'El nombre es obligatorio y debe ser un String').isString().notEmpty(),
    check('color', 'El Color es obligatorio y pertenecer a [Azul - Verde - Rojo]').not().isEmpty().isIn([
        Color.Blue, Color.Green, Color.Red
    ]),
    check('estado', 'El campo estado es obligatorio y debe ser un valor Booleano').not().isEmpty().isBoolean(),
    validarCampos
], controller.testMethodPOST);

export default router;