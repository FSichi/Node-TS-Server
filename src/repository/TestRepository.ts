import { TestDocument, TestModel } from '../database/models/Test.js';
import GenericRepository from './GenericRepository.js';

class TestRepository extends GenericRepository<TestDocument> {
    constructor() {
        super(TestModel);
    }

    getAllByColor = (color: string): Promise<TestDocument[]> => this.getAll({ color });
}

export default TestRepository;
