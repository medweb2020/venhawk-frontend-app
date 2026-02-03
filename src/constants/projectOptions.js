/**
 * Project Options Constants
 * @description Centralized configuration for industry and project category options
 */

export const INDUSTRY_OPTIONS = [
  { value: 'legal', label: 'Legal' },
];

export const PROJECT_CATEGORY_OPTIONS = [
  { value: 'legal-apps', label: 'Legal Application Implementations & Migrations (Intapp, iManage, NetDocuments, Elite, Aderant)' },
  { value: 'cloud-migration', label: 'Cloud Migrations & Modernization (Azure, AWS, GCP, hybrid cloud)' },
  { value: 'enterprise-it', label: 'Enterprise IT Implementations & Modernization (ServiceNow, Workday, M365 migrations, AV systems)' },
  { value: 'app-upgrades', label: 'Application Upgrades & Integrations (Legacy apps, custom systems, APIs)' },
];

/**
 * Get label for a given industry value
 */
export const getIndustryLabel = (value) => {
  const option = INDUSTRY_OPTIONS.find(opt => opt.value === value);
  return option?.label || value;
};

/**
 * Get label for a given project category value
 */
export const getProjectCategoryLabel = (value, otherText) => {
  if (value === 'other' && otherText) {
    return otherText;
  }
  const option = PROJECT_CATEGORY_OPTIONS.find(opt => opt.value === value);
  return option?.label || value;
};
