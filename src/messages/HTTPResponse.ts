import { Response } from "express";

interface IBaseResponse {
    res: Response;
    status: number;
}

interface IResponse extends IBaseResponse {
    data?: any;
    error?: IError;
}

interface IError {
    status: number;
    message: string;
}

export const handleResponse = ({ res, status, data, error }: IResponse) => {

    const response = error
        ? { status: "FAILED", error: error.message || error }
        : { status: "OK", data };

    res.status(status).json(response);
};

export const handleSuccessResponse = (res: Response, status: number, data: any) => {
    handleResponse({ res, status, data });
};

export const handleErrorResponse = (res: Response, error: any) => {
    handleResponse({ res, status: error.status || 500, data: null, error });
};

export const handleErrorLogin = (res: Response, error: any) => {
    res.status(error.status || 500)
        .json({ status: "FAILED", data: { authenticated: false, error: error?.message || error } });
};

export default {
    handleSuccessResponse,
    handleErrorResponse,
    handleErrorLogin,
};