import { IAggregationPipeline } from "../interfaces/index.js";
import { handleDatabaseError } from "../messages/ErrorHandlers.js";
import { Document, Model, PipelineStage } from 'mongoose';

class GenericRepository<T extends Document>{

    private readonly model: Model<T>;

    constructor(model: Model<T>) {
        this.model = model;
    }

    async getAll(query: Record<string, any> = {}, options: Record<string, any> = {}): Promise<T[] | undefined> {
        try {
            return await this.model.find(query, options);
        } catch (error: any) {
            handleDatabaseError({ status: 500, error: error });
        }
    }

    async getById(id: string): Promise<T | null | undefined> {
        try {
            return await this.model.findById(id);
        } catch (error: any) {
            handleDatabaseError({ status: 500, error: error });
        }
    }

    async getOne(query: Record<string, any> = {}): Promise<T | null | undefined> {
        try {
            return await this.model.findOne(query);
        } catch (error: any) {
            handleDatabaseError({ status: 500, error: error });
        }
    }

    async aggregate(pipeline: IAggregationPipeline[]): Promise<any> {
        try {
            const pipelineStages: PipelineStage[] = pipeline as PipelineStage[];
            return await this.model.aggregate(pipelineStages);
        } catch (error: any) {
            handleDatabaseError({ status: 500, error: error });
        }
    }

    async create(data: Record<string, any>): Promise<T | undefined> {
        try {
            return await this.model.create(data);
        } catch (error: any) {
            handleDatabaseError({ status: 500, error: error });
        }
    }

    async update(id: string, data: Record<string, any>): Promise<T | null | undefined> {
        try {
            return await this.model.findByIdAndUpdate(id, data, { new: true });
        } catch (error: any) {
            handleDatabaseError({ status: 500, error: error });
        }
    }

    async delete(id: string): Promise<T | null | undefined> {
        try {
            return await this.model.findByIdAndDelete(id);
        } catch (error: any) {
            handleDatabaseError({ status: 500, error: error });
        }
    }

}

export default GenericRepository;