import { createContext, useContext, useState } from 'react';
import PropTypes from 'prop-types';

/**
 * ProjectContext
 * @description Global state management for project form data across pages
 */
const ProjectContext = createContext();

export const ProjectProvider = ({ children }) => {
  // Combined form data from all pages
  const [projectData, setProjectData] = useState({
    // Page 1 - Project Details
    clientIndustry: '',
    projectTitle: '',
    projectCategory: '',
    projectCategoryOther: '',
    systemName: '',
    projectObjective: '',
    businessRequirements: '',
    technicalRequirements: '',
    fileUploads: [],

    // Page 2 - Budget & Timeline
    startDate: '',
    endDate: '',
    flexibleDates: false,
    budgetType: 'single',
    totalBudget: '',
    minBudget: '',
    maxBudget: '',

    // Matched vendors from API response
    matchedVendors: [],
  });

  // Update specific fields - supports both object and function
  const updateProjectData = (updates) => {
    if (typeof updates === 'function') {
      setProjectData(updates);
    } else {
      setProjectData(prev => ({ ...prev, ...updates }));
    }
  };

  // Reset all data
  const resetProjectData = () => {
    setProjectData({
      clientIndustry: '',
      projectTitle: '',
      projectCategory: '',
      projectCategoryOther: '',
      systemName: '',
      projectObjective: '',
      businessRequirements: '',
      technicalRequirements: '',
      fileUploads: [],
      startDate: '',
      endDate: '',
      flexibleDates: false,
      budgetType: 'single',
      totalBudget: '',
      minBudget: '',
      maxBudget: '',
      matchedVendors: [],
    });
  };

  return (
    <ProjectContext.Provider value={{ projectData, updateProjectData, resetProjectData }}>
      {children}
    </ProjectContext.Provider>
  );
};

ProjectProvider.propTypes = {
  children: PropTypes.node.isRequired,
};

// Custom hook to use the project context
export const useProject = () => {
  const context = useContext(ProjectContext);
  if (!context) {
    throw new Error('useProject must be used within a ProjectProvider');
  }
  return context;
};

export default ProjectContext;
