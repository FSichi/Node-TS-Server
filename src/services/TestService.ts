import { TestDocument, ITestParams } from '../database/models/Test.js';
import TestRepository from '../repository/TestRepository.js';
import { PaginatedResult } from '../repository/GenericRepository.js';
import { PaginationQuery } from '../schemas/pagination.schema.js';

class TestService {
    private testRepository = new TestRepository();

    getAll = (pagination: PaginationQuery): Promise<PaginatedResult<TestDocument>> =>
        this.testRepository.getPaginated({}, pagination);

    create = (data: ITestParams): Promise<TestDocument> => this.testRepository.create(data);
}

export default TestService;
