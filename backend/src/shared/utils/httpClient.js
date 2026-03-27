import axios from 'axios';

// HTTP client for inter-service communication
export const createHttpClient = (baseURL, timeout = 5000) => {
    const client = axios.create({
        baseURL,
        timeout,
        headers: {
            'Content-Type': 'application/json',
        },
    });

    // Request interceptor
    client.interceptors.request.use(
        (config) => {
            // Add auth token if available
            if (config.headers && !config.headers.Authorization) {
                const token = config.headers.authorization || config.headers.Authorization;
                if (token) {
                    config.headers.Authorization = token;
                }
            }
            return config;
        },
        (error) => {
            return Promise.reject(error);
        }
    );

    // Response interceptor
    client.interceptors.response.use(
        (response) => response.data,
        (error) => {
            if (error.response) {
                throw new Error(error.response.data?.message || error.message);
            }
            throw error;
        }
    );

    return client;
};

