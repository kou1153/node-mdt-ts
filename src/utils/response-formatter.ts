interface ApiResponse {
    success: boolean;
    data?: any;
    message?: string;
}

const createApiResponse = (
    success: boolean,
    data?: any,
    message?: string
): ApiResponse => {
    const response: ApiResponse = {success};
    if (data) {
        response.data = data;
    }
    if (message) {
        response.message = message;
    }
    return response;
};

export {ApiResponse, createApiResponse}