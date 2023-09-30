import { Request, Response } from "express";
import TestService from "../services/TestService.ts";
import { handleErrorResponse, handleSuccessResponse } from "../messages/HTTPResponse.ts";

class TestController {

    private testService: TestService;

    constructor() {
        this.testService = new TestService();
    }

    testMethodGET = async (_req: Request, res: Response): Promise<void> => {
        try {
            const responseData = await this.testService.getTestMethod();
            handleSuccessResponse(res, 200, responseData);
        } catch (error) {
            handleErrorResponse(res, error);
        }
    }

    testMethodPOST = async (req: Request, res: Response): Promise<void> => {

        const { nombreCompleto, color, estado } = req.body;

        const data = {
            nombreCompleto,
            color,
            estado
        }

        try {
            const responseData = await this.testService.postTestMethod(data);
            handleSuccessResponse(res, 200, responseData);
        } catch (error) {
            handleErrorResponse(res, error);
        }
    }

}

export default TestController;