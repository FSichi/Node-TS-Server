import { Router } from 'express';
import { check } from 'express-validator';

import { UserRoles } from '../database/enums/index.ts';
import { esAdminRole, validarCampos, validarJWT } from '../middlewares/index.js';
import dbValidators from '../middlewares/db-validators.ts';

import UserController from "../controllers/UserController.ts";

const router = Router();
const controller = new UserController();

/* Me retorna todos los Usuarios  -> QueryParam: ?ficha = [ 'true' - 'false' ]*/
router.get("/", [
    validarJWT,
    esAdminRole,
], controller.getAllUsers);

/* Me retorna un Usuario Especifico -> QueryParam: ?ficha = [ 'true' - 'false' ]*/
router.get("/:userId", [
    validarJWT,
    esAdminRole,
], controller.getUserById);

/* Crear un Nuevo Usuario */
router.post('/', [
    // validarJWT,
    check('nombre', 'El nombre es obligatorio y debe ser un String').isString().notEmpty(),
    check('password', 'El Password debe contener entre 6 y 15 Caracteres').isLength({ min: 6, max: 15 }),
    check('correo', 'El correo no es válido').isEmail(),
    check('correo').custom(dbValidators.emailExiste),
    check('rol', 'El Rol es obligatorio y ser [Admin - User]').not().isEmpty().isIn([UserRoles.ADMIN, UserRoles.USER]),
    validarCampos
], controller.createUser);

/* Actualizar Usuario  */
router.put('/', [
    validarJWT,
    esAdminRole,
    check('_id', 'El id es obligatorio').not().isEmpty(),
    check('nombre', 'El nombre es obligatorio').not().isEmpty(),
    validarCampos
], controller.updateUser);

/* Modificar Estado Cuenta del Usuario*/
router.put('/change-status', [
    validarJWT,
    esAdminRole,
    check('_id', 'El id es obligatorio').not().isEmpty(),
    check('estado', 'El campo estado es obligatorio y debe ser un valor Booleano').not().isEmpty().isBoolean(),
    validarCampos
], controller.changeUserStatus);

export default router;