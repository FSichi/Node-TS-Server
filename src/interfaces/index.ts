export interface IAggregationPipeline {
    $match?: { [key: string]: any };
    $group?: { [key: string]: any };
    $project?: { [key: string]: any };
    $sort?: { [key: string]: 1 | -1 };
    $limit?: number;
}
