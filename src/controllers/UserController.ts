import { Request, Response } from 'express';
import UserService from '../services/UserService.js';
import {
    CreateUserInput,
    UpdateUserInput,
    ChangeStatusInput,
} from '../schemas/user.schema.js';

class UserController {
    private userService = new UserService();

    getAllUsers = async (_req: Request, res: Response): Promise<void> => {
        const users = await this.userService.getAllUsers();
        res.json({ status: 'OK', data: users });
    };

    getUserById = async (req: Request, res: Response): Promise<void> => {
        const user = await this.userService.getUserById(String(req.params.userId));
        res.json({ status: 'OK', data: user });
    };

    createUser = async (
        req: Request<unknown, unknown, CreateUserInput>,
        res: Response,
    ): Promise<void> => {
        const user = await this.userService.createUser({ ...req.body, estado: true });
        res.status(201).json({ status: 'OK', data: { usuario: user } });
    };

    updateUser = async (
        req: Request<unknown, unknown, UpdateUserInput>,
        res: Response,
    ): Promise<void> => {
        const user = await this.userService.updateUser(req.body);
        res.json({ status: 'OK', data: { usuario: user } });
    };

    changeUserStatus = async (
        req: Request<unknown, unknown, ChangeStatusInput>,
        res: Response,
    ): Promise<void> => {
        const user = await this.userService.changeUserStatus(req.body);
        res.json({ status: 'OK', data: { usuario: user } });
    };
}

export default UserController;
