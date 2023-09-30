import { handleProcessError } from "../messages/ErrorHandlers.ts";
import TestRepository from "../repository/TestRepository.ts";
import { TestModel } from "../database/models/Test.ts";

class TestService {

    private testRepository: TestRepository;

    constructor() {
        this.testRepository = new TestRepository();
    }

    getTestMethod = async () => {
        try {
            return this.testRepository.getAll();
        } catch (error) {
            handleProcessError({ status: (error as any).status, error: (error as any).message || '' });
        }
    }

    postTestMethod = async (data: { nombreCompleto: string, color: string, estado: boolean }) => {
        try {

            if (data.nombreCompleto.length < 6) {
                throw { status: 407, message: `El nombre debe tener al menos 6 caracteres` }
            }

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