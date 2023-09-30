import GenericRepository from './GenericRepository.ts';
import { TestModel } from '../database/models/Test.ts';
import { TestDocument } from '../database/models/Test.ts';

class TestRepository extends GenericRepository<TestDocument> {

    constructor() {
        super(TestModel);
    }

    async getAllTestsByColor(color: string): Promise<TestDocument[] | undefined> {
        return await this.getAll({ color: color });
    }

}

export default TestRepository;