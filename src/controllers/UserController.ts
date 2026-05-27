import { Request, Response } from 'express';
import UserService from '../services/UserService.js';
import { CreateUserInput, UpdateUserInput, ChangeStatusInput } from '../schemas/user.schema.js';
import { ok, paginated, created, getPagination } from '../helpers/index.js';

class UserController {
    private userService = new UserService();

    getAllUsers = async (_req: Request, res: Response): Promise<void> => {
        const { data, total } = await this.userService.getAllUsers(getPagination(res));
        paginated(res, data, total);
    };

    getUserById = async (req: Request, res: Response): Promise<void> => {
        const user = await this.userService.getUserById(String(req.params.userId));
        ok(res, user);
    };

    createUser = async (
        req: Request<unknown, unknown, CreateUserInput>,
        res: Response,
    ): Promise<void> => {
        const user = await this.userService.createUser({ ...req.body, estado: true });
        created(res, user);
    };

    updateUser = async (
        req: Request<unknown, unknown, UpdateUserInput>,
        res: Response,
    ): Promise<void> => {
        const user = await this.userService.updateUser(req.body);
        ok(res, user);
    };

    changeUserStatus = async (
        req: Request<unknown, unknown, ChangeStatusInput>,
        res: Response,
    ): Promise<void> => {
        const user = await this.userService.changeUserStatus(req.body);
        ok(res, user);
    };
}

export default UserController;
