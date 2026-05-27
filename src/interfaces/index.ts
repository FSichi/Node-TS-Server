export interface IAggregationPipeline {
    $match?: Record<string, unknown>;
    $group?: Record<string, unknown>;
    $project?: Record<string, unknown>;
    $sort?: Record<string, 1 | -1>;
    $limit?: number;
}
