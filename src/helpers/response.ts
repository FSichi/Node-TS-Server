import { Response } from 'express';

export const ok = <T>(res: Response, data: T): void => {
    res.json({ data });
};

export const paginated = <T>(res: Response, data: T[], total: number): void => {
    res.json({ data, total });
};

export const created = <T>(res: Response, data: T): void => {
    res.status(201).json({ data });
};

export const noContent = (res: Response): void => {
    res.status(204).end();
};
