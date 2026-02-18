import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth0 } from '@auth0/auth0-react';
import { useProject } from '../../context/ProjectContext';
import { projectAPI } from '../../services/api';
import { getIndustryLabel, getProjectCategoryLabel } from '../../constants/projectOptions';
import Header from '../../components/layout/Header';
import LeftSidebar from '../../components/layout/LeftSidebar';
import Stepper from '../../components/common/Stepper';
import Button from '../../components/common/Button';
import LoadingSpinner from '../../components/common/LoadingSpinner';

/**
 * Check if project data has required fields filled
 * @param {Object} data - Project data object
 * @returns {boolean} - True if required fields are filled
 */
const hasRequiredProjectData = (data) => {
  return data &&
         data.clientIndustry &&
         data.projectTitle &&
         data.startDate;
};

/**
 * Summary Page Component
 * @description Step 3: Review and submit all collected information
 */
const Summary = () => {
  const navigate = useNavigate();
  const { getAccessTokenSilently } = useAuth0();
  const { projectData, updateProjectData } = useProject();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState(null);

  console.log('Project data:', projectData);

  // Redirect to landing page if no project data exists
  useEffect(() => {
    if (!hasRequiredProjectData(projectData)) {
      navigate('/');
    }
  }, [projectData, navigate]);

  const handleEdit = () => {
    // Navigate back to first step to edit
    navigate('/');
  };

  const handleSaveDraft = () => {
    // Save draft to local storage for now
    localStorage.setItem('venhawk_draft_project', JSON.stringify(projectData));
    alert('Draft saved successfully!');
  };

  const transformDataForBackend = (data) => {
    // Transform frontend data to match backend API format
    return {
      // Page 1 fields
      clientIndustry: data.clientIndustry,
      projectTitle: data.projectTitle,
      projectCategory: data.projectCategory,
      projectCategoryOther: data.projectCategoryOther || undefined,
      systemName: data.systemName || undefined,
      projectObjective: data.projectObjective,
      businessRequirements: data.businessRequirements,
      technicalRequirements: data.technicalRequirements || undefined,

      // File uploads - Send array of file URLs
      fileUrls: data.fileUploads?.map(file => file.fileUrl) || [],

      // Page 2 fields - Transform dates from mm/dd/yyyy to yyyy-mm-dd
      startDate: data.startDate ? convertToISODate(data.startDate) : undefined,
      endDate: data.endDate ? convertToISODate(data.endDate) : undefined,
      flexibleDates: data.flexibleDates || false,

      // Budget fields - Remove commas and convert to string
      budgetType: data.budgetType,
      totalBudget: data.budgetType === 'single' ? data.totalBudget?.replace(/,/g, '') : undefined,
      minBudget: data.budgetType === 'range' ? data.minBudget?.replace(/,/g, '') : undefined,
      maxBudget: data.budgetType === 'range' ? data.maxBudget?.replace(/,/g, '') : undefined,

      // Status
      status: 'submitted',
    };
  };

  const convertToISODate = (dateString) => {
    // Convert from mm/dd/yyyy to yyyy-mm-dd
    if (!dateString) return null;

    // Check if already in ISO format (yyyy-mm-dd)
    if (/^\d{4}-\d{2}-\d{2}$/.test(dateString)) {
      return dateString;
    }

    // Parse mm/dd/yyyy format
    const date = new Date(dateString);
    if (isNaN(date.getTime())) {
      return null;
    }

    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');

    return `${year}-${month}-${day}`;
  };

  const handleSubmit = async () => {
    try {
      setIsSubmitting(true);
      setError(null);

      // Get Auth0 access token
      const accessToken = await getAccessTokenSilently();

      // Transform and prepare project data for API
      const apiPayload = transformDataForBackend(projectData);

      // Submit project and get matched vendors
      const response = await projectAPI.submitProject(apiPayload, accessToken);
      console.log('Project submitted successfully:', response);

      // Store matched vendors in context
      if (response.matchedVendors) {
        updateProjectData({ matchedVendors: response.matchedVendors });
      }

      // Navigate to vendors page to display results
      navigate('/vendors');
    } catch (err) {
      console.error('Error submitting project:', err);

      // Parse error message - check if it's a validation error with multiple messages
      try {
        const errorData = JSON.parse(err.message);
        if (errorData.message && Array.isArray(errorData.message)) {
          setError(errorData.message);
        } else {
          setError([errorData.message || err.message || 'Failed to Find vendors. Please try again.']);
        }
      } catch (parseError) {
        // If error message is not JSON, treat it as a single error
        setError([err.message || 'Failed to Find vendors. Please try again.']);
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="h-screen flex flex-col overflow-hidden">
      <Header />

      {/* Full screen loading spinner */}
      {isSubmitting && (
        <LoadingSpinner
          fullScreen
          size="large"
          message="Submitting your project..."
        />
      )}

      <div className="flex-1 bg-gray-100 overflow-auto">
        <div className="relative min-h-full flex flex-col lg:flex-row">
          {/* Left Section with background */}
          <LeftSidebar />

          {/* Right Section */}
          <div className="flex-1 lg:px-12 px-6 py-8 flex flex-col items-center">
            <div className="w-full max-w-5xl">
              {/* Progress Stepper */}
              <div className="mb-3 py-4">
                <div className="flex items-start justify-between">
                  <Stepper
                    stepNumber={1}
                    label="Project Details"
                    isCompleted={true}
                  />
                  <Stepper
                    stepNumber={2}
                    label="Timeline & Budget"
                    isCompleted={true}
                  />
                  <Stepper
                    stepNumber={3}
                    label="Review & Submit"
                    isActive={true}
                  />
                </div>
              </div>

              {/* White Summary Card */}
              <div className="bg-white rounded-2xl shadow-lg p-8 mb-8">
                {/* Error Message */}
                {error && (
                  <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
                    {Array.isArray(error) ? (
                      <ul className="list-disc list-inside text-sm text-red-800 space-y-1">
                        {error.map((msg, index) => (
                          <li key={index}>{msg}</li>
                        ))}
                      </ul>
                    ) : (
                      <p className="text-sm text-red-800">{error}</p>
                    )}
                  </div>
                )}

                {/* Edit Button */}
                <div className="flex justify-end mb-6">
                  <button
                    onClick={handleEdit}
                    className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-gray-700 hover:text-gray-900 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                    </svg>
                    Edit
                  </button>
                </div>

                <div className="space-y-6">
                  {/* Client Industry */}
                  <div>
                    <h3 className="text-xs font-medium text-gray-500 uppercase tracking-wide mb-2">Client Industry</h3>
                    <p className="text-base text-gray-900 font-semibold">{getIndustryLabel(projectData.clientIndustry)}</p>
                  </div>

                  {/* Project Title */}
                  <div>
                    <h3 className="text-xs font-medium text-gray-500 uppercase tracking-wide mb-2">Project Title</h3>
                    <p className="text-base text-gray-900 font-semibold">{projectData.projectTitle}</p>
                  </div>

                  {/* Project Category */}
                  <div>
                    <h3 className="text-xs font-medium text-gray-500 uppercase tracking-wide mb-2">Project Category</h3>
                    <p className="text-base text-gray-900 font-semibold">{getProjectCategoryLabel(projectData.projectCategory, projectData.projectCategoryOther)}</p>
                  </div>

                  {/* System Name (conditional) */}
                  {projectData.systemName && (
                    <div>
                      <h3 className="text-xs font-medium text-gray-500 uppercase tracking-wide mb-2">System Name to be Implemented</h3>
                      <p className="text-base text-gray-900 font-semibold">{projectData.systemName}</p>
                    </div>
                  )}

                  {/* Project Objective */}
                  <div>
                    <h3 className="text-xs font-medium text-gray-500 uppercase tracking-wide mb-2">Project Objective</h3>
                    <p className="text-base text-gray-900 font-semibold leading-relaxed">{projectData.projectObjective}</p>
                  </div>

                  {/* Business Requirements */}
                  <div>
                    <h3 className="text-xs font-medium text-gray-500 uppercase tracking-wide mb-2">Business Requirements</h3>
                    <p className="text-base text-gray-900 font-semibold leading-relaxed">{projectData.businessRequirements}</p>
                  </div>

                  {/* Technical Requirements */}
                  {projectData.technicalRequirements && (
                    <div>
                      <h3 className="text-xs font-medium text-gray-500 uppercase tracking-wide mb-2">Technical Requirements</h3>
                      <p className="text-base text-gray-900 font-semibold leading-relaxed">{projectData.technicalRequirements}</p>
                    </div>
                  )}

                  {/* File Uploads */}
                  {projectData.fileUploads && projectData.fileUploads.length > 0 && (
                    <div>
                      <h3 className="text-xs font-medium text-gray-500 uppercase tracking-wide mb-2">Uploaded Files</h3>
                      <div className="flex flex-wrap gap-2">
                        {projectData.fileUploads.map((file, index) => (
                          <a
                            key={index}
                            href={file.fileUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-2 bg-blue-50 hover:bg-blue-100 text-blue-700 rounded-full px-3 py-1.5 text-sm font-medium shadow-sm hover:shadow-md transition-all duration-200"
                          >
                            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.414-6.586a4 4 0 00-5.656-5.656l-6.415 6.585a6 6 0 108.486 8.486L20.5 13" />
                            </svg>
                            <span className="font-semibold">{file.fileName}</span>
                            <span className="text-xs text-blue-600">
                              {(file.fileSize / 1024).toFixed(1)} KB
                            </span>
                          </a>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Start Date */}
                  <div>
                    <h3 className="text-xs font-medium text-gray-500 uppercase tracking-wide mb-2">Start Date</h3>
                    <p className="text-base text-gray-900 font-semibold">{projectData.startDate}</p>
                  </div>

                  {/* End Date */}
                  {projectData.endDate && (
                    <div>
                      <h3 className="text-xs font-medium text-gray-500 uppercase tracking-wide mb-2">End Date</h3>
                      <p className="text-base text-gray-900 font-semibold">{projectData.endDate}</p>
                    </div>
                  )}

                  {/* Flexible Dates */}
                  {projectData.flexibleDates && (
                    <div>
                      <h3 className="text-xs font-medium text-gray-500 uppercase tracking-wide mb-2">Timeline Flexibility</h3>
                      <p className="text-base text-gray-900 font-semibold">Flexible on dates</p>
                    </div>
                  )}

                  {/* Budget */}
                  <div>
                    <h3 className="text-xs font-medium text-gray-500 uppercase tracking-wide mb-2">Budget</h3>
                    {projectData.budgetType === 'single' ? (
                      <p className="text-base text-gray-900 font-semibold">${projectData.totalBudget}</p>
                    ) : (
                      <p className="text-base text-gray-900 font-semibold">
                        ${projectData.minBudget} - ${projectData.maxBudget}
                      </p>
                    )}
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="pt-6 mt-6 border-t border-gray-200 flex gap-4">
                  <Button
                    variant="secondary"
                    size="large"
                    fullWidth
                    onClick={handleSaveDraft}
                    disabled={isSubmitting}
                  >
                    Save Draft
                  </Button>
                  <Button
                    variant="primary"
                    size="large"
                    fullWidth
                    onClick={handleSubmit}
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? 'Finding vendors...' : 'Find Vendors'}
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Summary;
