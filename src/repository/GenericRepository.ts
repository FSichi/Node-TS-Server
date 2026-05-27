import { Document, Model, PipelineStage, UpdateQuery } from 'mongoose';
import { IAggregationPipeline } from '../interfaces/index.js';

class GenericRepository<T extends Document> {
    protected readonly model: Model<T>;

    constructor(model: Model<T>) {
        this.model = model;
    }

    getAll = (
        query: Record<string, unknown> = {},
        options: Record<string, unknown> = {},
    ): Promise<T[]> => this.model.find(query, options).exec();

    getById = (id: string): Promise<T | null> => this.model.findById(id).exec();

    getOne = (query: Record<string, unknown> = {}): Promise<T | null> =>
        this.model.findOne(query).exec();

    aggregate = (pipeline: IAggregationPipeline[]): Promise<unknown[]> =>
        this.model.aggregate(pipeline as PipelineStage[]).exec();

    create = (data: object): Promise<T> => this.model.create(data) as unknown as Promise<T>;

    update = (id: string, data: UpdateQuery<T>): Promise<T | null> =>
        this.model.findByIdAndUpdate(id, data, { new: true }).exec();

    delete = (id: string): Promise<T | null> => this.model.findByIdAndDelete(id).exec();
}

export default GenericRepository;
