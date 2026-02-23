import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useProject } from '../../context/ProjectContext';
import { INDUSTRY_OPTIONS, PROJECT_CATEGORY_OPTIONS } from '../../constants/projectOptions';
import Header from '../../components/layout/Header';
import LeftSidebar from '../../components/layout/LeftSidebar';
import Stepper from '../../components/common/Stepper';
import Input from '../../components/common/Input';
import Dropdown from '../../components/common/Dropdown';
import SearchableDropdown from '../../components/common/SearchableDropdown';
import Textarea from '../../components/common/Textarea';
import Button from '../../components/common/Button';
import FileUpload from './components/FileUpload';

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
    systemName: projectData.systemName,
    projectObjective: projectData.projectObjective,
    businessRequirements: projectData.businessRequirements,
    technicalRequirements: projectData.technicalRequirements,
    fileUploads: projectData.fileUploads,
  };

  const handleChange = (field, value) => {
    updateProjectData({ [field]: value });
  };

  // Set default industry if not already set
  useEffect(() => {
    if (!formData.clientIndustry && INDUSTRY_OPTIONS.length === 1) {
      updateProjectData({ clientIndustry: INDUSTRY_OPTIONS[0].value });
    }
  }, []);

  // Check if all mandatory fields are filled
  const isFormValid = () => {
    const mandatoryFieldsFilled =
      formData.clientIndustry &&
      formData.projectTitle &&
      formData.projectCategory &&
      formData.systemName &&
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
                    options={INDUSTRY_OPTIONS}
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
                      options={PROJECT_CATEGORY_OPTIONS}
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

                  <Input
                    label="System Name to be Implemented"
                    name="systemName"
                    placeholder="e.g., Intapp, iManage, ServiceNow, Workday"
                    value={formData.systemName}
                    onChange={(e) => handleChange('systemName', e.target.value)}
                    required
                  />

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

                  <FileUpload
                    fileUploads={formData.fileUploads}
                    updateProjectData={updateProjectData}
                  />

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
