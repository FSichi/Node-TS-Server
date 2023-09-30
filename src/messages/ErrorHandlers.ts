interface IError {
    status: number;
    error: string;
}

export const handleDatabaseError = ({ status, error }: IError) => {
    throw { status: status || 500, message: error };
};

export const handleProcessError = ({ status, error }: IError) => {
    throw { status: status || 500, message: error };
};