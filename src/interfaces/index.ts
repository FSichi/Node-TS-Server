import { Request } from "express";
import { IUsuario } from "../database/models/Usuario";

export interface IAggregationPipeline {
    $match?: { [key: string]: any };
    $group?: { [key: string]: any };
    $project?: { [key: string]: any };
    $sort?: { [key: string]: 1 | -1 };
    $limit?: number;
}


export interface RequestWithUsuario extends Request {
    usuario?: IUsuario | null;
}
