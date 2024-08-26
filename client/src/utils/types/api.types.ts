export interface ApiError {
    data: {
        status: number;
        message: string;
        error: number;
    }
}