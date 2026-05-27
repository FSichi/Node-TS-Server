import { Request, Response } from 'express';
import TestService from '../services/TestService.js';
import { CreateTestInput } from '../schemas/test.schema.js';
import { paginated, created, getPagination } from '../helpers/index.js';

class TestController {
    private testService = new TestService();

    getAll = async (_req: Request, res: Response): Promise<void> => {
        const { data, total } = await this.testService.getAll(getPagination(res));
        paginated(res, data, total);
    };

    create = async (
        req: Request<unknown, unknown, CreateTestInput>,
        res: Response,
    ): Promise<void> => {
        const test = await this.testService.create(req.body);
        created(res, test);
    };
}

export default TestController;
