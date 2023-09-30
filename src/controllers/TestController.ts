import { Request, Response } from "express";
import TestService from "../services/TestService.ts";
import { handleErrorResponse, handleSuccessResponse } from "../messages/HTTPResponse.ts";

class TestController {

    private testService: TestService;

    constructor() {
        this.testService = new TestService();
    }

    testMethodGET = async (_req: Request, res: Response) => {
        try {
            const responseData = await this.testService.getTestMethod();
            handleSuccessResponse(res, 200, responseData);
        } catch (error) {
            handleErrorResponse(res, error);
        }
    }

    testMethodPOST = async (_req: Request, res: Response) => {

        const { nombreCompleto, color, estado } = _req.body;

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