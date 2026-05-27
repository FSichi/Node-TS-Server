import { Document, FilterQuery, Model, PipelineStage, SortOrder, UpdateQuery } from 'mongoose';
import { IAggregationPipeline } from '../interfaces/index.js';
import { PaginationQuery } from '../schemas/pagination.schema.js';

export interface PaginatedResult<T> {
    data: T[];
    total: number;
}

class GenericRepository<T extends Document> {
    protected readonly model: Model<T>;

    constructor(model: Model<T>) {
        this.model = model;
    }

    getAll = (filter: FilterQuery<T> = {}, options: Record<string, unknown> = {}): Promise<T[]> =>
        this.model.find(filter, options).exec();

    getPaginated = async (
        filter: FilterQuery<T> = {},
        pagination: PaginationQuery,
    ): Promise<PaginatedResult<T>> => {
        const { page, pageSize, orderField, orderDescending } = pagination;
        const sort: Record<string, SortOrder> | undefined = orderField
            ? { [orderField]: orderDescending ? -1 : 1 }
            : undefined;

        const query = this.model
            .find(filter)
            .skip(page * pageSize)
            .limit(pageSize);
        if (sort) query.sort(sort);

        const [data, total] = await Promise.all([
            query.exec(),
            this.model.countDocuments(filter).exec(),
        ]);

        return { data, total };
    };

    getById = (id: string): Promise<T | null> => this.model.findById(id).exec();

    getOne = (filter: FilterQuery<T> = {}): Promise<T | null> => this.model.findOne(filter).exec();

    aggregate = (pipeline: IAggregationPipeline[]): Promise<unknown[]> =>
        this.model.aggregate(pipeline as PipelineStage[]).exec();

    create = (data: object): Promise<T> => this.model.create(data) as unknown as Promise<T>;

    update = (id: string, data: UpdateQuery<T>): Promise<T | null> =>
        this.model.findByIdAndUpdate(id, data, { new: true }).exec();

    delete = (id: string): Promise<T | null> => this.model.findByIdAndDelete(id).exec();
}

export default GenericRepository;
