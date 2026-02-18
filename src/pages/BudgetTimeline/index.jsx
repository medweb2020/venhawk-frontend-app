import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useProject } from '../../context/ProjectContext';
import Header from '../../components/layout/Header';
import LeftSidebar from '../../components/layout/LeftSidebar';
import Stepper from '../../components/common/Stepper';
import Input from '../../components/common/Input';
import DatePicker from '../../components/common/DatePicker';
import Button from '../../components/common/Button';

/**
 * Check if project data has required fields filled
 * @param {Object} data - Project data object
 * @returns {boolean} - True if required fields are filled
 */
const hasRequiredProjectData = (data) => {
  return data &&
         data.clientIndustry &&
         data.projectTitle &&
         data.projectObjective &&
         data.businessRequirements;
};

/**
 * Budget & Timeline Page Component
 * @description Step 2: Collect budget and timeline information
 */
const BudgetTimeline = () => {
  const navigate = useNavigate();
  const { projectData, updateProjectData } = useProject();
  const [errors, setErrors] = useState({});

  // Redirect to landing page if no project data from step 1 exists
  useEffect(() => {
    if (!hasRequiredProjectData(projectData)) {
      navigate('/');
    }
  }, [projectData, navigate]);

  // Local state for this page's fields
  const formData = {
    startDate: projectData.startDate,
    endDate: projectData.endDate,
    flexibleDates: projectData.flexibleDates,
    budgetType: projectData.budgetType,
    totalBudget: projectData.totalBudget,
    minBudget: projectData.minBudget,
    maxBudget: projectData.maxBudget,
  };

  const formatCurrency = (value) => {
    // Remove all non-digit characters
    const numericValue = value.replace(/\D/g, '');

    // Format with commas
    if (numericValue === '') return '';
    return Number(numericValue).toLocaleString('en-US');
  };

  const handleChange = (field, value) => {
    updateProjectData({ [field]: value });
  };

  const handleBudgetChange = (field) => (e) => {
    const rawValue = e.target.value;
    const formattedValue = formatCurrency(rawValue);
    updateProjectData({ [field]: formattedValue });
  };

  // Check if all mandatory fields are filled (for enabling/disabling button)
  const isFormValid = () => {
    // Start date is required
    if (!formData.startDate) {
      return false;
    }

    // Validate end date is after start date (if provided)
    if (formData.endDate && formData.startDate) {
      const startDate = new Date(formData.startDate);
      const endDate = new Date(formData.endDate);

      if (endDate <= startDate) {
        return false;
      }
    }

    // Validate budget based on type
    if (formData.budgetType === 'single') {
      const totalBudget = parseFloat(formData.totalBudget?.replace(/,/g, '') || '0');
      if (!formData.totalBudget || totalBudget <= 0) {
        return false;
      }
    } else {
      // Budget range validation
      const minBudget = parseFloat(formData.minBudget?.replace(/,/g, '') || '0');
      const maxBudget = parseFloat(formData.maxBudget?.replace(/,/g, '') || '0');

      if (!formData.minBudget || minBudget <= 0) {
        return false;
      }

      if (!formData.maxBudget || maxBudget <= 0) {
        return false;
      }

      if (minBudget > 0 && maxBudget > 0 && maxBudget <= minBudget) {
        return false;
      }
    }

    return true;
  };

  const validateForm = () => {
    const newErrors = {};

    // Validate start date is required
    if (!formData.startDate) {
      newErrors.startDate = 'Start date is required';
    }

    // Validate end date is after start date (if provided)
    if (formData.endDate && formData.startDate) {
      const startDate = new Date(formData.startDate);
      const endDate = new Date(formData.endDate);

      if (endDate <= startDate) {
        newErrors.endDate = 'End date must be after start date';
      }
    }

    // Validate budget based on type
    if (formData.budgetType === 'single') {
      const totalBudget = parseFloat(formData.totalBudget?.replace(/,/g, '') || '0');

      if (!formData.totalBudget || totalBudget <= 0) {
        newErrors.totalBudget = 'Total budget must be greater than 0';
      }
    } else {
      // Budget range validation
      const minBudget = parseFloat(formData.minBudget?.replace(/,/g, '') || '0');
      const maxBudget = parseFloat(formData.maxBudget?.replace(/,/g, '') || '0');

      if (!formData.minBudget || minBudget <= 0) {
        newErrors.minBudget = 'Minimum budget must be greater than 0';
      }

      if (!formData.maxBudget || maxBudget <= 0) {
        newErrors.maxBudget = 'Maximum budget must be greater than 0';
      }

      if (minBudget > 0 && maxBudget > 0 && maxBudget <= minBudget) {
        newErrors.maxBudget = 'Maximum budget must be greater than minimum budget';
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleBack = () => {
    navigate('/');
  };

  const handleNext = () => {
    if (validateForm()) {
      console.log('Page 2 Data:', formData);
      navigate('/summary');
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
                    isCompleted={true}
                  />
                  <Stepper
                    stepNumber={2}
                    label="Timeline & Budget"
                    isActive={true}
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
                  {/* Start Date */}
                  <div>
                    <DatePicker
                      label="Start Date"
                      name="startDate"
                      value={formData.startDate}
                      onChange={(e) => handleChange('startDate', e.target.value)}
                      required
                    />
                    {errors.startDate && (
                      <p className="mt-1 text-sm text-red-600">{errors.startDate}</p>
                    )}
                  </div>

                  {/* End Date */}
                  <div>
                    <DatePicker
                      label="End Date (Optional)"
                      name="endDate"
                      value={formData.endDate}
                      onChange={(e) => handleChange('endDate', e.target.value)}
                    />
                    {errors.endDate && (
                      <p className="mt-1 text-sm text-red-600">{errors.endDate}</p>
                    )}
                  </div>

                  {/* Flexible Dates Toggle */}
                  <div className="flex items-center">
                    <input
                      id="flexibleDates"
                      name="flexibleDates"
                      type="checkbox"
                      checked={formData.flexibleDates}
                      onChange={(e) => handleChange('flexibleDates', e.target.checked)}
                      className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 focus:ring-2"
                    />
                    <label
                      htmlFor="flexibleDates"
                      className="ml-3 text-sm font-normal text-gray-700"
                    >
                      I'm flexible on these dates
                    </label>
                  </div>

                  {/* Budget Type */}
                  <div>
                    <label className="block text-sm font-normal text-gray-700 mb-2">
                      Budget Type <span className="text-red-500">*</span>
                    </label>
                    <div className="flex gap-4">
                      <button
                        type="button"
                        onClick={() => handleChange('budgetType', 'single')}
                        className={`flex-1 px-4 py-3 border-2 rounded-lg transition-all duration-200 ${
                          formData.budgetType === 'single'
                            ? 'border-[#1a3a52] bg-blue-50 text-[#1a3a52] font-medium'
                            : 'border-gray-300 bg-white text-gray-700 hover:border-gray-400'
                        }`}
                      >
                        Single Total Budget
                      </button>
                      <button
                        type="button"
                        onClick={() => handleChange('budgetType', 'range')}
                        className={`flex-1 px-4 py-3 border-2 rounded-lg transition-all duration-200 ${
                          formData.budgetType === 'range'
                            ? 'border-[#1a3a52] bg-blue-50 text-[#1a3a52] font-medium'
                            : 'border-gray-300 bg-white text-gray-700 hover:border-gray-400'
                        }`}
                      >
                        Budget Range
                      </button>
                    </div>
                  </div>

                  {/* Budget Amount(s) - Conditional */}
                  {formData.budgetType === 'single' ? (
                    <div>
                      <label
                        htmlFor="totalBudget"
                        className="block text-sm font-normal text-gray-700 mb-2"
                      >
                        Total Budget Amount <span className="text-red-500">*</span>
                      </label>
                      <div className="relative">
                        <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-900 font-medium">
                          $
                        </span>
                        <input
                          id="totalBudget"
                          name="totalBudget"
                          type="text"
                          placeholder="150,000"
                          value={formData.totalBudget}
                          onChange={handleBudgetChange('totalBudget')}
                          className={`w-full pl-8 pr-4 py-3 border rounded-lg transition-all duration-200 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-gray-50 text-gray-900 ${
                            errors.totalBudget ? 'border-red-500' : 'border-gray-200'
                          }`}
                        />
                      </div>
                      {errors.totalBudget && (
                        <p className="mt-1 text-sm text-red-600">{errors.totalBudget}</p>
                      )}
                    </div>
                  ) : (
                    <div className="space-y-4">
                      <div>
                        <label
                          htmlFor="minBudget"
                          className="block text-sm font-normal text-gray-700 mb-2"
                        >
                          Minimum Budget <span className="text-red-500">*</span>
                        </label>
                        <div className="relative">
                          <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-900 font-medium">
                            $
                          </span>
                          <input
                            id="minBudget"
                            name="minBudget"
                            type="text"
                            placeholder="100,000"
                            value={formData.minBudget}
                            onChange={handleBudgetChange('minBudget')}
                            className={`w-full pl-8 pr-4 py-3 border rounded-lg transition-all duration-200 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-gray-50 text-gray-900 ${
                              errors.minBudget ? 'border-red-500' : 'border-gray-200'
                            }`}
                          />
                        </div>
                        {errors.minBudget && (
                          <p className="mt-1 text-sm text-red-600">{errors.minBudget}</p>
                        )}
                      </div>
                      <div>
                        <label
                          htmlFor="maxBudget"
                          className="block text-sm font-normal text-gray-700 mb-2"
                        >
                          Maximum Budget <span className="text-red-500">*</span>
                        </label>
                        <div className="relative">
                          <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-900 font-medium">
                            $
                          </span>
                          <input
                            id="maxBudget"
                            name="maxBudget"
                            type="text"
                            placeholder="200,000"
                            value={formData.maxBudget}
                            onChange={handleBudgetChange('maxBudget')}
                            className={`w-full pl-8 pr-4 py-3 border rounded-lg transition-all duration-200 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-gray-50 text-gray-900 ${
                              errors.maxBudget ? 'border-red-500' : 'border-gray-200'
                            }`}
                          />
                        </div>
                        {errors.maxBudget && (
                          <p className="mt-1 text-sm text-red-600">{errors.maxBudget}</p>
                        )}
                      </div>
                    </div>
                  )}

                  <div className="pt-4 flex gap-4">
                    <Button
                      variant="secondary"
                      size="large"
                      fullWidth
                      onClick={handleBack}
                    >
                      Go Back
                    </Button>
                    <Button
                      variant="primary"
                      size="large"
                      fullWidth
                      onClick={handleNext}
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

export default BudgetTimeline;
