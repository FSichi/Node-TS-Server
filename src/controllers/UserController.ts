import { Request, Response } from "express";
import UserService from "../services/UserService.ts";
import { handleErrorResponse, handleSuccessResponse } from "../messages/HTTPResponse.ts";


class UserController {

    private userService: UserService;

    constructor() {
        this.userService = new UserService();
    }

    public getAllUsers = async (_req: Request, res: Response): Promise<void> => {
        try {
            const listOfUsers = await this.userService.getAllUsers();
            handleSuccessResponse(res, 200, listOfUsers);
        } catch (error) {
            handleErrorResponse(res, error);
        }
    }

    public getUserById = async (req: Request, res: Response): Promise<void> => {

        const { userId } = req.params;

        try {
            const user = await this.userService.getUserById(userId);
            handleSuccessResponse(res, 200, user);
        } catch (error) {
            handleErrorResponse(res, error);
        }
    }

    public createUser = async (req: Request, res: Response): Promise<void> => {

        const { nombre, password, correo, rol } = req.body;
        const userToDB = { nombre, password, correo, rol, estado: true }

        try {
            const user = await this.userService.createUser(userToDB);
            handleSuccessResponse(res, 200, { usuario: user });
        } catch (error) {
            handleErrorResponse(res, error);
        }
    }

    public updateUser = async (req: Request, res: Response): Promise<void> => {

        const { _id, nombre } = req.body;
        const dataToUpdate = { _id, nombre }

        try {
            const user = await this.userService.updateUser(dataToUpdate);
            handleSuccessResponse(res, 200, { usuario: user });
        } catch (error) {
            handleErrorResponse(res, error);
        }
    }

    public changeUserStatus = async (req: Request, res: Response): Promise<void> => {

        const { _id, estado } = req.body;
        const data = { _id, estado }

        try {
            const user = await this.userService.changeUserStatus(data);
            handleSuccessResponse(res, 200, { usuario: user });
        } catch (error) {
            handleErrorResponse(res, error);
        }
    }

}

export default UserController;