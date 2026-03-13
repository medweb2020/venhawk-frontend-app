/**
 * API Service Layer
 * @description Centralized API calls for the application
 */
import { withAppLoader } from './loadingManager';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000/api';

const appendArrayFilters = (queryParams, filters = {}) => {
  Object.entries(filters).forEach(([filterKey, values]) => {
    if (!Array.isArray(values)) {
      return;
    }

    values
      .map((value) => String(value).trim())
      .filter(Boolean)
      .forEach((value) => queryParams.append(filterKey, value));
  });
};

const buildVendorListingEndpoint = (filters = {}) => {
  const queryParams = new URLSearchParams();

  appendArrayFilters(queryParams, filters);

  const queryString = queryParams.toString();
  return queryString ? `/vendors/listing?${queryString}` : '/vendors/listing';
};

const buildProjectRecommendationsEndpoint = (projectId, filters = {}) => {
  const queryParams = new URLSearchParams();
  appendArrayFilters(queryParams, filters);

  const queryString = queryParams.toString();
  const basePath = `/projects/${projectId}/recommendations`;
  return queryString ? `${basePath}?${queryString}` : basePath;
};

const buildVendorDetailEndpoint = (vendorId, projectId = null) => {
  const queryParams = new URLSearchParams();
  if (projectId !== null && projectId !== undefined && String(projectId).trim()) {
    queryParams.set('projectId', String(projectId).trim());
  }

  const queryString = queryParams.toString();
  const basePath = `/vendors/${encodeURIComponent(vendorId)}/detail`;
  return queryString ? `${basePath}?${queryString}` : basePath;
};

/**
 * Generic fetch wrapper with error handling
 */
const fetchAPI = async (endpoint, options = {}, loadingOptions = {}) => {
  const url = `${API_BASE_URL}${endpoint}`;

  const defaultOptions = {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...(options.headers || {}),
    },
  };

  return withAppLoader(async () => {
    const response = await fetch(url, defaultOptions);

    if (!response.ok) {
      const error = await response.json().catch(() => ({ message: 'An error occurred' }));
      // Throw error with full error data as JSON string so it can be parsed later
      const errorMessage = typeof error.message === 'string'
        ? error.message
        : JSON.stringify(error);
      throw new Error(errorMessage);
    }

    if (response.status === 204) {
      return null;
    }

    const responseText = await response.text();
    if (!responseText) {
      return null;
    }

    return JSON.parse(responseText);
  }, loadingOptions);
};

const fetchMultipartAPI = async (endpoint, file, accessToken) => {
  const formData = new FormData();
  formData.append('file', file);

  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
    body: formData,
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({ message: 'An error occurred' }));
    throw new Error(error.message || 'An error occurred');
  }

  return response.json();
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

  /**
   * Generate project-specific vendor recommendations
   * @param {number|string} projectId - Project ID
   * @param {string} accessToken - Auth0 access token
   * @returns {Promise<Object>} Recommendation response
   */
  generateRecommendations: async (projectId, accessToken) => {
    return fetchAPI(`/projects/${projectId}/recommendations`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });
  },

  /**
   * Get recommendations for a project
   * @param {number|string} projectId - Project ID
   * @param {string} accessToken - Auth0 access token
   * @returns {Promise<Object>} Recommendation response
   */
  getRecommendations: async (projectId, accessToken, filters = {}) => {
    return fetchAPI(buildProjectRecommendationsEndpoint(projectId, filters), {
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
    }, { enabled: false });
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
  getListing: async (accessToken, filters = {}) => {
    return fetchAPI(buildVendorListingEndpoint(filters), {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });
  },

  /**
   * Get listing filter options
   * @param {string} accessToken - Auth0 access token
   * @returns {Promise<Object>} Filter groups and options
   */
  getListingFilters: async (accessToken) => {
    return fetchAPI('/vendors/listing/filters', {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });
  },

  /**
   * Get a single procurement listing vendor
   * @param {string} vendorId - Vendor UUID
   * @param {string} accessToken - Auth0 access token
   * @returns {Promise<Object>} Vendor listing card data
   */
  getListingVendor: async (vendorId, accessToken) => {
    return fetchAPI(`/vendors/listing/${vendorId}`, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });
  },

  /**
   * Get vendor detail profile
   * @param {string} vendorId - Vendor UUID
   * @param {string} accessToken - Auth0 access token
   * @param {Object} options - Optional request context
   * @param {number|string|null} options.projectId - Project ID context for reason/category-aware detail
   * @returns {Promise<Object>} Vendor detail payload
   */
  getVendorDetail: async (vendorId, accessToken, options = {}) => {
    return fetchAPI(buildVendorDetailEndpoint(vendorId, options?.projectId), {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });
  },

  getVendorAdminOverview: async (accessToken) => {
    return fetchAPI('/vendors/admin', {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });
  },

  getVendorAdminVendor: async (vendorId, accessToken) => {
    return fetchAPI(`/vendors/admin/vendors/${encodeURIComponent(vendorId)}`, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });
  },

  createVendorAdminVendor: async (payload, accessToken) => {
    return fetchAPI('/vendors/admin/vendors', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
      body: JSON.stringify(payload),
    });
  },

  updateVendorAdminVendor: async (vendorId, payload, accessToken) => {
    return fetchAPI(`/vendors/admin/vendors/${encodeURIComponent(vendorId)}`, {
      method: 'PATCH',
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
      body: JSON.stringify(payload),
    });
  },

  deleteVendorAdminVendor: async (vendorId, accessToken) => {
    return fetchAPI(`/vendors/admin/vendors/${encodeURIComponent(vendorId)}`, {
      method: 'DELETE',
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });
  },

  createVendorAdminClient: async (vendorId, payload, accessToken) => {
    return fetchAPI(`/vendors/admin/vendors/${encodeURIComponent(vendorId)}/clients`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
      body: JSON.stringify(payload),
    });
  },

  updateVendorAdminClient: async (vendorId, clientId, payload, accessToken) => {
    return fetchAPI(
      `/vendors/admin/vendors/${encodeURIComponent(vendorId)}/clients/${encodeURIComponent(clientId)}`,
      {
        method: 'PATCH',
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
        body: JSON.stringify(payload),
      },
    );
  },

  deleteVendorAdminClient: async (vendorId, clientId, accessToken) => {
    return fetchAPI(
      `/vendors/admin/vendors/${encodeURIComponent(vendorId)}/clients/${encodeURIComponent(clientId)}`,
      {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      },
    );
  },

  uploadVendorLogo: async (vendorId, file, accessToken) => {
    return fetchMultipartAPI(
      `/vendors/admin/vendors/${encodeURIComponent(vendorId)}/logo`,
      file,
      accessToken,
    );
  },

  deleteVendorLogo: async (vendorId, accessToken) => {
    return fetchAPI(`/vendors/admin/vendors/${encodeURIComponent(vendorId)}/logo`, {
      method: 'DELETE',
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });
  },

  uploadVendorClientLogo: async (vendorId, clientId, file, accessToken) => {
    return fetchMultipartAPI(
      `/vendors/admin/vendors/${encodeURIComponent(vendorId)}/clients/${encodeURIComponent(clientId)}/logo`,
      file,
      accessToken,
    );
  },

  deleteVendorClientLogo: async (vendorId, clientId, accessToken) => {
    return fetchAPI(
      `/vendors/admin/vendors/${encodeURIComponent(vendorId)}/clients/${encodeURIComponent(clientId)}/logo`,
      {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      },
    );
  },

  createVendorAdminCaseStudy: async (vendorId, payload, accessToken) => {
    return fetchAPI(
      `/vendors/admin/vendors/${encodeURIComponent(vendorId)}/case-studies`,
      {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
        body: JSON.stringify(payload),
      },
    );
  },

  updateVendorAdminCaseStudy: async (
    vendorId,
    caseStudyId,
    payload,
    accessToken,
  ) => {
    return fetchAPI(
      `/vendors/admin/vendors/${encodeURIComponent(vendorId)}/case-studies/${encodeURIComponent(caseStudyId)}`,
      {
        method: 'PATCH',
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
        body: JSON.stringify(payload),
      },
    );
  },

  deleteVendorAdminCaseStudy: async (vendorId, caseStudyId, accessToken) => {
    return fetchAPI(
      `/vendors/admin/vendors/${encodeURIComponent(vendorId)}/case-studies/${encodeURIComponent(caseStudyId)}`,
      {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      },
    );
  },
};

export default {
  projectAPI,
  userAPI,
  fileAPI,
  vendorsAPI,
};
