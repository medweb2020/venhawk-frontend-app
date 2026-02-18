/**
 * API Service Layer
 * @description Centralized API calls for the application
 */

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000/api';

/**
 * Generic fetch wrapper with error handling
 */
const fetchAPI = async (endpoint, options = {}) => {
  const url = `${API_BASE_URL}${endpoint}`;

  const defaultOptions = {
    headers: {
      'Content-Type': 'application/json',
      ...options.headers,
    },
    ...options,
  };

  try {
    const response = await fetch(url, defaultOptions);

    if (!response.ok) {
      const error = await response.json().catch(() => ({ message: 'An error occurred' }));
      // Throw error with full error data as JSON string so it can be parsed later
      const errorMessage = typeof error.message === 'string'
        ? error.message
        : JSON.stringify(error);
      throw new Error(errorMessage);
    }

    return await response.json();
  } catch (error) {
    console.error('API Error:', error);
    throw error;
  }
};

/**
 * Project API Service
 */
export const projectAPI = {
  /**
   * Submit a new project
   * @param {Object} projectData - Complete project data from all form pages
   * @param {string} accessToken - Auth0 access token
   * @returns {Promise<Object>} Created project data
   */
  submitProject: async (projectData, accessToken) => {
    return fetchAPI('/projects', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${accessToken}`,
      },
      body: JSON.stringify(projectData),
    });
  },

  /**
   * Upload project files
   * @param {number} projectId - Project ID
   * @param {File[]} files - Array of file objects
   * @param {string} accessToken - Auth0 access token
   * @returns {Promise<Object>} Upload response
   */
  uploadFiles: async (projectId, files, accessToken) => {
    const formData = new FormData();
    files.forEach((file) => {
      formData.append('files', file);
    });

    return fetch(`${API_BASE_URL}/projects/${projectId}/files`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
      body: formData,
    }).then(res => res.json());
  },

  /**
   * Get user's projects
   * @param {string} accessToken - Auth0 access token
   * @returns {Promise<Array>} List of projects
   */
  getProjects: async (accessToken) => {
    return fetchAPI('/projects', {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });
  },

  /**
   * Get a specific project by ID
   * @param {number} projectId - Project ID
   * @param {string} accessToken - Auth0 access token
   * @returns {Promise<Object>} Project data
   */
  getProject: async (projectId, accessToken) => {
    return fetchAPI(`/projects/${projectId}`, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });
  },
};

/**
 * User API Service
 */
export const userAPI = {
  /**
   * Sync user data from Auth0
   * @param {Object} userData - User data from Auth0
   * @param {string} accessToken - Auth0 access token
   * @returns {Promise<Object>} User data
   */
  syncUser: async (userData, accessToken) => {
    return fetchAPI('/users/sync', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${accessToken}`,
      },
      body: JSON.stringify(userData),
    });
  },
};

/**
 * File API Service
 */
export const fileAPI = {
  /**
   * Upload a single file to Supabase
   * @param {File} file - File object to upload
   * @param {string} accessToken - Auth0 access token
   * @returns {Promise<Object>} File upload response with fileUrl, fileName, fileSize, mimeType
   */
  uploadFile: async (file, accessToken) => {
    const formData = new FormData();
    formData.append('file', file);

    const response = await fetch(`${API_BASE_URL}/files/upload`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
      body: formData,
    });

    if (!response.ok) {
      const error = await response.json().catch(() => ({ message: 'File upload failed' }));
      throw new Error(error.message || `HTTP error! status: ${response.status}`);
    }

    return await response.json();
  },

  /**
   * Delete a file from Supabase
   * @param {string} fileUrl - Full URL of the file to delete
   * @param {string} accessToken - Auth0 access token
   * @returns {Promise<Object>} Delete response
   */
  deleteFile: async (fileUrl, accessToken) => {
    const response = await fetch(`${API_BASE_URL}/files`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${accessToken}`,
      },
      body: JSON.stringify({ fileUrl }),
    });

    if (!response.ok) {
      const error = await response.json().catch(() => ({ message: 'File deletion failed' }));
      throw new Error(error.message || `HTTP error! status: ${response.status}`);
    }

    // 204 No Content has no response body
    if (response.status === 204) {
      return { success: true };
    }

    return await response.json();
  },
};

/**
 * Vendors API Service
 */
export const vendorsAPI = {
  /**
   * Get procurement listing vendors
   * @param {string} accessToken - Auth0 access token
   * @returns {Promise<Array>} Vendor listing cards
   */
  getListing: async (accessToken) => {
    return fetchAPI('/vendors/listing', {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });
  },
};

export default {
  projectAPI,
  userAPI,
  fileAPI,
  vendorsAPI,
};
