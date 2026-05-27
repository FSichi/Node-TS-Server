import { Request, Response } from 'express';
import TestService from '../services/TestService.js';
import { CreateTestInput } from '../schemas/test.schema.js';

class TestController {
    private testService = new TestService();

    getAll = async (_req: Request, res: Response): Promise<void> => {
        const data = await this.testService.getAll();
        res.json({ status: 'OK', data });
    };

    create = async (
        req: Request<unknown, unknown, CreateTestInput>,
        res: Response,
    ): Promise<void> => {
        const test = await this.testService.create(req.body);
        res.status(201).json({ status: 'OK', data: test });
    };
}

export default TestController;
