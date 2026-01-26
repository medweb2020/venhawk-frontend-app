import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useProject } from '../context/ProjectContext';
import Header from '../components/layout/Header';
import LeftSidebar from '../components/layout/LeftSidebar';
import Stepper from '../components/common/Stepper';
import Input from '../components/common/Input';
import Dropdown from '../components/common/Dropdown';
import SearchableDropdown from '../components/common/SearchableDropdown';
import Textarea from '../components/common/Textarea';
import Button from '../components/common/Button';

/**
 * Landing Page Component
 * @description Single-page questionnaire form to collect project requirements
 */
const Landing = () => {
  const navigate = useNavigate();
  const { projectData, updateProjectData } = useProject();

  // Local state for this page's fields
  const formData = {
    clientIndustry: projectData.clientIndustry,
    projectTitle: projectData.projectTitle,
    projectCategory: projectData.projectCategory,
    projectCategoryOther: projectData.projectCategoryOther,
    projectObjective: projectData.projectObjective,
    businessRequirements: projectData.businessRequirements,
    technicalRequirements: projectData.technicalRequirements,
    fileUploads: projectData.fileUploads,
  };

  const industryOptions = [
    // { value: 'financial', label: 'Financial Services' },
    // { value: 'healthcare', label: 'Healthcare' },
    { value: 'legal', label: 'Legal' },
    // { value: 'saas', label: 'SaaS' },
    // { value: 'technology', label: 'Technology' },
    // { value: 'government', label: 'Government Agency' },
  ];

  const projectCategoryOptions = [
    { value: 'erp', label: 'ERP Implementations (SAP, Oracle, Microsoft Dynamics)' },
    { value: 'app-upgrades', label: 'Application Upgrades (Legacy systems, custom apps, feature rollouts)' },
    { value: 'cloud-migration', label: 'Cloud Migrations (AWS, Azure, GCP, hybrid cloud)' },
    { value: 'network', label: 'Network Infrastructure (LAN/WAN, SD-WAN, VPN)' },
    { value: 'security', label: 'Security Initiatives (IAM, SOC2 compliance, vulnerability management)' },
    // { value: 'collaboration', label: 'Collaboration Tools Deployment (Microsoft Teams, SharePoint, Slack, Google Workspace)' },
    { value: 'data-analytics', label: 'Data & Analytics / BI (Data warehouses, dashboards, AI/ML pipelines)' },
    { value: 'disaster-recovery', label: 'Disaster Recovery / Business Continuity (DR planning, backup, failover systems)' },
    { value: 'itsm', label: 'IT Service Management / ITSM (ServiceNow, ticketing system)' },
    { value: 'endpoint', label: 'Endpoint Management / Device Upgrades (laptops, desktops, MDM)' },
    // { value: 'database', label: 'Database Migration / Optimization (SQL/NoSQL migration, tuning)' },
    // { value: 'virtualization', label: 'Infrastructure Virtualization (VMware, Hyper-V, containers)' },
    { value: 'cloud-security', label: 'Cloud Security / Compliance (cloud governance, policies, regulatory compliance)' },
    { value: 'other', label: 'Other' },
  ];

  const handleChange = (field, value) => {
    updateProjectData({ [field]: value });
  };

  // Set default industry if not already set
  useEffect(() => {
    if (!formData.clientIndustry && industryOptions.length === 1) {
      updateProjectData({ clientIndustry: industryOptions[0].value });
    }
  }, []);

  // Check if all mandatory fields are filled
  const isFormValid = () => {
    const mandatoryFieldsFilled =
      formData.clientIndustry &&
      formData.projectTitle &&
      formData.projectCategory &&
      formData.projectObjective &&
      formData.businessRequirements;

    // If "Other" is selected for project category, projectCategoryOther is also required
    if (formData.projectCategory === 'other') {
      return mandatoryFieldsFilled && formData.projectCategoryOther;
    }

    return mandatoryFieldsFilled;
  };

  const handleSubmit = () => {
    if (isFormValid()) {
      console.log('Page 1 Data:', formData);
      // Navigate to Timeline & Budget page
      navigate('/budget-timeline');
    }
  };

  return (
    <div className="h-screen flex flex-col overflow-hidden">
      <Header />

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
                    isActive={true}
                  />
                  <Stepper
                    stepNumber={2}
                    label="Timeline & Budget"
                  />
                  <Stepper
                    stepNumber={3}
                    label="Review & Submit"
                  />
                </div>
              </div>

              {/* White Form Card */}
              <div className="bg-white rounded-2xl shadow-lg p-8 mb-8">
                <div className="space-y-6">
                  <Dropdown
                    label="Client Industry"
                    name="clientIndustry"
                    options={industryOptions}
                    value={formData.clientIndustry}
                    onChange={(e) => handleChange('clientIndustry', e.target.value)}
                    placeholder="Select industry"
                    required
                  />

                  <Input
                    label="Project Title"
                    name="projectTitle"
                    placeholder="Intapp Cloud Migration"
                    value={formData.projectTitle}
                    onChange={(e) => handleChange('projectTitle', e.target.value)}
                    required
                  />

                  <div>
                    <SearchableDropdown
                      label="Project Category"
                      name="projectCategory"
                      options={projectCategoryOptions}
                      value={formData.projectCategory}
                      onChange={(e) => handleChange('projectCategory', e.target.value)}
                      placeholder="Search for project category..."
                      required
                    />
                    {formData.projectCategory === 'other' && (
                      <div className="mt-4">
                        <Input
                          name="projectCategoryOther"
                          placeholder="Please specify your project category"
                          value={formData.projectCategoryOther}
                          onChange={(e) => handleChange('projectCategoryOther', e.target.value)}
                          required
                        />
                      </div>
                    )}
                  </div>

                  <Textarea
                    label="Project Objective"
                    name="projectObjective"
                    rows={3}
                    placeholder="Migrate our existing on-prem Intapp application to the cloud to improve scalability, reliability, and performance while reducing infrastructure maintenance and operational risk."
                    value={formData.projectObjective}
                    onChange={(e) => handleChange('projectObjective', e.target.value)}
                    tooltip="What is the primary outcome of this project? Describe the business goal and success criteria. Avoid technical implementation details."
                    required
                  />

                  <Textarea
                    label="Business Requirements"
                    name="businessRequirements"
                    rows={4}
                    placeholder="The solution must support legal and finance teams across multiple offices, minimize downtime during migration, meet data security and retention requirements, and align with internal IT governance and change-management processes."
                    value={formData.businessRequirements}
                    onChange={(e) => handleChange('businessRequirements', e.target.value)}
                    tooltip="What does the business need from this project? Include scope, users, compliance needs, and operational constraints. Exclude technical specifics."
                    required
                  />

                  <Textarea
                    label="Technical Requirements"
                    name="technicalRequirements"
                    rows={4}
                    placeholder="Preference for Azure cloud environment. Must integrate with Microsoft Entra ID, Exchange Online, and existing monitoring tools. Hybrid deployment acceptable during transition."
                    value={formData.technicalRequirements}
                    onChange={(e) => handleChange('technicalRequirements', e.target.value)}
                    tooltip="List known technical constraints or preferences. If unsure, leave this blank—vendors can help define the approach."
                  />

                  <div>
                    <label className="block text-sm font-normal text-gray-700 mb-2">
                      File Uploads (Optional)
                    </label>
                    <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 bg-gray-50 hover:bg-gray-100 transition-colors cursor-pointer">
                      <input
                        type="file"
                        id="fileUploads"
                        name="fileUploads"
                        multiple
                        accept=".pdf,.doc,.docx,.png,.jpg,.jpeg"
                        className="hidden"
                        onChange={(e) => handleChange('fileUploads', Array.from(e.target.files))}
                      />
                      <label htmlFor="fileUploads" className="cursor-pointer">
                        <div className="flex flex-col items-center gap-3 text-gray-600">
                          <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                          </svg>
                          <div className="text-center">
                            <span className="text-sm font-medium">Click to upload files</span>
                            <p className="text-xs text-gray-500 mt-1">PDFs, diagrams, specifications, or other relevant documents</p>
                          </div>
                        </div>
                      </label>
                    </div>
                    {formData.fileUploads.length > 0 && (
                      <div className="mt-3 space-y-2">
                        {formData.fileUploads.map((file, index) => (
                          <div key={index} className="flex items-center gap-2 text-sm text-gray-700 bg-blue-50 px-3 py-2 rounded">
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                            </svg>
                            <span className="flex-1">{file.name}</span>
                            <button
                              type="button"
                              onClick={() => {
                                const newFiles = formData.fileUploads.filter((_, i) => i !== index);
                                handleChange('fileUploads', newFiles);
                              }}
                              className="text-red-600 hover:text-red-800"
                            >
                              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                              </svg>
                            </button>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>

                  <div className="pt-4">
                    <Button
                      variant="primary"
                      size="large"
                      fullWidth
                      onClick={handleSubmit}
                      disabled={!isFormValid()}
                    >
                      Next
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Landing;
