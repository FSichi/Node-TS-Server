import { TestDocument, ITestParams } from '../database/models/Test.js';
import TestRepository from '../repository/TestRepository.js';

class TestService {
    private testRepository = new TestRepository();

    getAll = (): Promise<TestDocument[]> => this.testRepository.getAll();

    create = (data: ITestParams): Promise<TestDocument> => this.testRepository.create(data);
}

export default TestService;
