// base44Client.js

// Utility function for error handling
function handleError(error) {
    console.error('API Error:', error);
    // Implement further error handling logic as needed
}

// Function for setting up interceptors
function setupInterceptors(axiosInstance) {
    // Add a response interceptor
    axiosInstance.interceptors.response.use(response => {
        return response;
    }, error => {
        handleError(error);
        return Promise.reject(error);
    });
}

// Sample usage
const axios = require('axios');
const axiosInstance = axios.create();
setupInterceptors(axiosInstance);

// Exporting the axios instance
module.exports = axiosInstance;
