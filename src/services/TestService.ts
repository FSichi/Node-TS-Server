import { handleProcessError } from "../messages/ErrorHandlers.ts";
import TestRepository from "../repository/TestRepository.ts";
import { TestDocument, TestModel, ITestParams } from "../database/models/Test.ts";

class TestService {

    private testRepository: TestRepository;

    constructor() {
        this.testRepository = new TestRepository();
    }

    getTestMethod = async (): Promise<TestDocument[] | undefined> => {
        try {
            return this.testRepository.getAll();
        } catch (error) {
            handleProcessError({ status: (error as any).status, error: (error as any).message || '' });
        }
    }

    postTestMethod = async (data: ITestParams): Promise<TestDocument | undefined> => {
        try {

            if (data.nombreCompleto.length < 6) {
                throw { status: 407, message: `El nombre debe tener al menos 6 caracteres` }
            }

            // const newTest:ITest = new TestModel({
            const newTest = new TestModel({
                nombreCompleto: data.nombreCompleto,
                color: data.color,
                estado: data.estado
            });

            console.log(newTest.getColorName());

            const testDB = await this.testRepository.create(newTest);
            return testDB;

        } catch (error) {
            handleProcessError({ status: (error as any).status, error: (error as any).message || '' });
        }
    }
}

export default TestService;