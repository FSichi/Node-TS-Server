import { Response } from "express";

interface IError {
    status: number;
    message: string;
}

interface IResponse {
    res: Response;
    status: number;
    data?: any;
    error?: IError;
}

export const handleResponse = ({ res, status, data, error }: IResponse): void => {

    const response = error
        ? { status: "FAILED", error: error.message || error }
        : { status: "OK", data };

    res.status(status).json(response);
};

export const handleSuccessResponse = (res: Response, status: number, data: any): void => {
    handleResponse({ res, status, data });
};

export const handleErrorResponse = (res: Response, error: any): void => {
    handleResponse({ res, status: error.status || 500, data: null, error });
};

export const handleErrorLogin = (res: Response, error: any): void => {
    res.status(error.status || 500)
        .json({ status: "FAILED", data: { authenticated: false, error: error?.message || error } });
};

export default {
    handleSuccessResponse,
    handleErrorResponse,
    handleErrorLogin,
};