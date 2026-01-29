import React, { useEffect, useState } from "react";
import { Job, JobForm } from "./types";
import { FiX, FiLoader, FiAlertCircle, FiCheckCircle } from "react-icons/fi";

const JOB_TYPES = [
  { value: "FULL_TIME", label: "Full Time" },
  { value: "PART_TIME", label: "Part Time" },
  { value: "INTERNSHIP", label: "Internship" },
  { value: "CONTRACT", label: "Contract" },
];

const JOB_ROLES = [
  { value: "SOFTWARE_ENGINEER", label: "Software Engineer" },
  { value: "BACKEND_DEVELOPER", label: "Backend Developer" },
  { value: "FRONTEND_DEVELOPER", label: "Frontend Developer" },
  { value: "FULLSTACK_DEVELOPER", label: "Fullstack Developer" },
  { value: "DATA_SCIENTIST", label: "Data Scientist" },
  { value: "DATA_ANALYST", label: "Data Analyst" },
  { value: "DEVOPS_ENGINEER", label: "DevOps Engineer" },
  { value: "CLOUD_ENGINEER", label: "Cloud Engineer" },
  { value: "ML_ENGINEER", label: "ML Engineer" },
  { value: "AI_ENGINEER", label: "AI Engineer" },
  { value: "MOBILE_DEVELOPER", label: "Mobile Developer" },
  { value: "ANDROID_DEVELOPER", label: "Android Developer" },
  { value: "IOS_DEVELOPER", label: "iOS Developer" },
  { value: "UI_UX_DESIGNER", label: "UI/UX Designer" },
  { value: "PRODUCT_MANAGER", label: "Product Manager" },
  { value: "PROJECT_MANAGER", label: "Project Manager" },
  { value: "BUSINESS_ANALYST", label: "Business Analyst" },
  { value: "QA_ENGINEER", label: "QA Engineer" },
  { value: "TEST_AUTOMATION_ENGINEER", label: "Test Automation Engineer" },
  { value: "CYBERSECURITY_ANALYST", label: "Cybersecurity Analyst" },
  { value: "NETWORK_ENGINEER", label: "Network Engineer" },
  { value: "SYSTEM_ADMIN", label: "System Admin" },
  { value: "DATABASE_ADMIN", label: "Database Admin" },
  { value: "BLOCKCHAIN_DEVELOPER", label: "Blockchain Developer" },
  { value: "GAME_DEVELOPER", label: "Game Developer" },
  { value: "TECH_SUPPORT", label: "Tech Support" },
  { value: "CONTENT_WRITER", label: "Content Writer" },
  { value: "DIGITAL_MARKETER", label: "Digital Marketer" },
  { value: "SALES_ASSOCIATE", label: "Sales Associate" },
  { value: "HR_MANAGER", label: "HR Manager" },
];

interface ValidationErrors {
  title?: string;
  role?: string;
  description?: string;
  location?: string;
  salaryMin?: string;
  salaryMax?: string;
  noOfOpenings?: string;
  general?: string;
}

interface JobCreateModalProps {
  open: boolean;
  onClose: () => void;
  onSave: (form: JobForm) => void;
  editingJob?: Job | null;
}

export default function JobCreateModal({
  open,
  onClose,
  onSave,
  editingJob,
}: JobCreateModalProps) {
  const [form, setForm] = useState<JobForm>({
    title: "",
    role: "",
    description: "",
    requirements: "",
    location: "",
    jobType: "FULL_TIME",
    salaryMin: "",
    salaryMax: "",
    noOfOpenings: "",
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState<ValidationErrors>({});
  const [touched, setTouched] = useState<Set<string>>(new Set());

  useEffect(() => {
    if (editingJob) {
      setForm({
        title: editingJob.title || "",
        role: editingJob.role || "",
        description: editingJob.description || "",
        requirements: editingJob.requirements || "",
        location: editingJob.location || "",
        jobType: editingJob.jobType || "FULL_TIME",
        salaryMin: editingJob.salaryMin || "",
        salaryMax: editingJob.salaryMax || "",
        noOfOpenings: editingJob.noOfOpenings || "",
      });
    } else {
      setForm({
        title: "",
        role: "",
        description: "",
        requirements: "",
        location: "",
        jobType: "FULL_TIME",
        salaryMin: "",
        salaryMax: "",
        noOfOpenings: "",
      });
    }
    setErrors({});
    setTouched(new Set());
  }, [editingJob, open]);

const validateField = (name: string, value: string | number | undefined): string | undefined => {
  switch (name) {
    case "title":
      if (!value || (value as string).trim().length < 3) {
        return "Job title must be at least 3 characters long";
      }
      if ((value as string).trim().length > 100) {
        return "Job title must be less than 100 characters";
      }
      break;
    case "role":
      if (!value) return "Please select a job role";
      break;
    case "description":
      if (!value || (value as string).trim().length < 20) {
        return "Job description must be at least 20 characters long";
      }
      if ((value as string).trim().length > 2000) {
        return "Job description must be less than 2000 characters";
      }
      break;
    case "location":
      if (value && (value as string).trim().length > 100) {
        return "Location must be less than 100 characters";
      }
      break;
    case "salaryMin":
    case "salaryMax":
      if (value !== "" && (isNaN(Number(value)) || Number(value) < 0)) {
        return `${name === "salaryMin" ? "Minimum" : "Maximum"} salary must be a valid positive number`;
      }
      if (name === "salaryMin" && value && form.salaryMax && Number(value) > Number(form.salaryMax)) {
        return "Minimum salary cannot be higher than maximum salary";
      }
      if (name === "salaryMax" && value && form.salaryMin && Number(value) < Number(form.salaryMin)) {
        return "Maximum salary cannot be lower than minimum salary";
      }
      break;
    case "noOfOpenings":
      if (value && (isNaN(Number(value)) || Number(value) < 1)) {
        return "Number of openings must be at least 1";
      }
      if (value && Number(value) > 100) {
        return "Number of openings cannot exceed 100";
      }
      break;
  }
  return undefined;
};


  const validateForm = (): boolean => {
    const newErrors: ValidationErrors = {};
    
    // Validate all required fields
    Object.keys(form).forEach((key) => {
    const value = form[key as keyof JobForm];
    if (typeof value === 'string' || typeof value === 'number' || value === undefined) {
      const error = validateField(key, value);
      if (error) {
        newErrors[key as keyof ValidationErrors] = error;
      }
    }
  });

    // Cross-field validation
    if (form.salaryMin && form.salaryMax && Number(form.salaryMin) > Number(form.salaryMax)) {
      newErrors.salaryMax = 'Maximum salary must be higher than minimum salary';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  if (!open) return null;

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    
    // Real-time validation for touched fields
    if (touched.has(name)) {
      const error = validateField(name, value);
      setErrors(prev => ({
        ...prev,
        [name]: error
      }));
    }
  };

  const handleBlur = (e: React.FocusEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setTouched(prev => new Set(prev.add(name)));
    
    const error = validateField(name, value);
    setErrors(prev => ({
      ...prev,
      [name]: error
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault();

  if (!validateForm()) {
    setErrors(prev => ({
      ...prev,
      general: 'Please fix the errors above before submitting'
    }));
    return;
  }

  setIsSubmitting(true);
  setErrors({});

  try {
    await onSave(form);
  } catch (error: unknown) {
    let message = 'An error occurred while saving the job';

    // Safely extract message if error is an Error instance
    if (error instanceof Error) {
      message = error.message;
    }

    setErrors({
      general: message
    });
  } finally {
    setIsSubmitting(false);
  }
};


  const getInputClassName = (fieldName: string, baseClassName: string) => {
    const hasError = errors[fieldName as keyof ValidationErrors];
    const errorClasses = hasError ? 'border-red-500 focus:border-red-500 focus:ring-red-500/20' : 'border-gray-300 focus:border-blue-500 focus:ring-blue-500/20';
    return `${baseClassName} ${errorClasses}`;
  };

  const renderFieldError = (fieldName: string) => {
    const error = errors[fieldName as keyof ValidationErrors];
    if (!error) return null;
    
    return (
      <div className="flex items-center gap-1 mt-1 text-red-600 text-sm">
        <FiAlertCircle className="w-4 h-4 flex-shrink-0" />
        <span>{error}</span>
      </div>
    );
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex justify-center items-center z-50 p-4">
      <div className="bg-white rounded-2xl w-full max-w-2xl max-h-[95vh] overflow-hidden shadow-2xl">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200 bg-gradient-to-r from-blue-50 to-indigo-50">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">
              {editingJob ? "Update Job Posting" : "Create New Job"}
            </h2>
            <p className="text-gray-600 mt-1">
              {editingJob ? "Make changes to your job posting" : "Fill in the details for your new job posting"}
            </p>
          </div>
          <button
            onClick={onClose}
            disabled={isSubmitting}
            className="p-2 hover:bg-gray-200 rounded-xl transition-colors disabled:opacity-50"
          >
            <FiX className="w-6 h-6 text-gray-600" />
          </button>
        </div>

        {/* Form Content */}
        <div className="overflow-y-auto max-h-[calc(90vh-140px)]">
          <form onSubmit={handleSubmit} className="p-6 space-y-6">
            {/* General Error */}
            {errors.general && (
              <div className="bg-red-50 border border-red-200 rounded-xl p-4">
                <div className="flex items-center gap-2 text-red-700">
                  <FiAlertCircle className="w-5 h-5" />
                  <span className="font-medium">Error</span>
                </div>
                <p className="text-red-600 mt-1">{errors.general}</p>
              </div>
            )}

            {/* Job Title */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Job Title <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="title"
                value={form.title}
                onChange={handleChange}
                onBlur={handleBlur}
                placeholder="e.g. Senior Frontend Developer"
                disabled={isSubmitting}
                className={getInputClassName('title', 'w-full px-4 py-3 rounded-xl border focus:ring-2 transition-all disabled:opacity-50 disabled:cursor-not-allowed placeholder:text-gray-400 text-gray-900')}
                required
              />
              {renderFieldError('title')}
            </div>

            {/* Role */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Job Role <span className="text-red-500">*</span>
              </label>
              <select
                name="role"
                value={form.role}
                onChange={handleChange}
                onBlur={handleBlur}
                disabled={isSubmitting}
                className={getInputClassName('role', 'w-full px-4 py-3 rounded-xl border focus:ring-2 transition-all disabled:opacity-50 disabled:cursor-not-allowed text-gray-900')}
                required
              >
                <option value="">Select a role</option>
                {JOB_ROLES.map((role) => (
                  <option key={role.value} value={role.value}>
                    {role.label}
                  </option>
                ))}
              </select>
              {renderFieldError('role')}
            </div>

            {/* Description */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Job Description <span className="text-red-500">*</span>
              </label>
              <textarea
                name="description"
                value={form.description}
                onChange={handleChange}
                onBlur={handleBlur}
                placeholder="Describe the role, responsibilities, and what you're looking for..."
                rows={4}
                disabled={isSubmitting}
                className={getInputClassName('description', 'w-full px-4 py-3 rounded-xl border focus:ring-2 transition-all resize-none disabled:opacity-50 disabled:cursor-not-allowed placeholder:text-gray-400 text-gray-900')}
                required
              />
              <div className="flex justify-between items-center mt-1">
                <div>{renderFieldError('description')}</div>
                <span className="text-xs text-gray-500">
                  {form.description.length}/2000 characters
                </span>
              </div>
            </div>

            {/* Requirements */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Requirements
              </label>
              <textarea
                name="requirements"
                value={form.requirements}
                onChange={handleChange}
                onBlur={handleBlur}
                placeholder="List the skills, experience, and qualifications needed..."
                rows={3}
                disabled={isSubmitting}
                className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all resize-none disabled:opacity-50 disabled:cursor-not-allowed placeholder:text-gray-400 text-gray-900"
              />
            </div>

            {/* Location and Job Type Row */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Location
                </label>
                <input
                  type="text"
                  name="location"
                  value={form.location}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  placeholder="e.g. San Francisco, CA or Remote"
                  disabled={isSubmitting}
                  className={getInputClassName('location', 'w-full px-4 py-3 rounded-xl border focus:ring-2 transition-all disabled:opacity-50 disabled:cursor-not-allowed placeholder:text-gray-400 text-gray-900')}
                />
                {renderFieldError('location')}
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Job Type
                </label>
                <select
                  name="jobType"
                  value={form.jobType}
                  onChange={handleChange}
                  disabled={isSubmitting}
                  className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all disabled:opacity-50 disabled:cursor-not-allowed text-gray-900 "
                >
                  {JOB_TYPES.map((type) => (
                    <option key={type.value} value={type.value}>
                      {type.label}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Salary Range */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Salary Range (Optional)
              </label>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <input
                    type="number"
                    name="salaryMin"
                    value={form.salaryMin}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    placeholder="Minimum salary"
                    min="0"
                    disabled={isSubmitting}
                    className={getInputClassName('salaryMin', 'w-full px-4 py-3 rounded-xl border focus:ring-2 transition-all disabled:opacity-50 disabled:cursor-not-allowed placeholder:text-gray-400 text-gray-900')}
                  />
                  {renderFieldError('salaryMin')}
                </div>
                <div>
                  <input
                    type="number"
                    name="salaryMax"
                    value={form.salaryMax}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    placeholder="Maximum salary"
                    min="0"
                    disabled={isSubmitting}
                    className={getInputClassName('salaryMax', 'w-full px-4 py-3 rounded-xl border focus:ring-2 transition-all disabled:opacity-50 disabled:cursor-not-allowed placeholder:text-gray-400 text-gray-900')}
                  />
                  {renderFieldError('salaryMax')}
                </div>
              </div>
            </div>

            {/* Number of Openings */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Number of Openings
              </label>
              <input
                type="number"
                name="noOfOpenings"
                value={form.noOfOpenings}
                onChange={handleChange}
                onBlur={handleBlur}
                placeholder="How many positions are available?"
                min="1"
                max="100"
                disabled={isSubmitting}
                className={getInputClassName('noOfOpenings', 'w-full px-4 py-3 rounded-xl border focus:ring-2 transition-all disabled:opacity-50 disabled:cursor-not-allowed placeholder:text-gray-400 text-gray-900')}
              />
              {renderFieldError('noOfOpenings')}
            </div>
          </form>
        </div>

        {/* Footer */}
        <div className="flex justify-end gap-4 p-6 pt-2 border-t border-gray-200 bg-gray-50">
          <button
            type="button"
            onClick={onClose}
            disabled={isSubmitting}
            className="px-6 py-3 bg-red-500 border border-gray-300 text-gray-100 rounded-xl hover:bg-red-400 transition-colors font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Cancel
          </button>
          <button
            type="submit"
            onClick={handleSubmit}
            disabled={isSubmitting}
            className="px-8 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-xl hover:from-blue-700 hover:to-indigo-700 transition-all font-semibold flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isSubmitting ? (
              <>
                <FiLoader className="w-4 h-4 animate-spin" />
                {editingJob ? "Updating..." : "Creating..."}
              </>
            ) : (
              <>
                <FiCheckCircle className="w-4 h-4" />
                {editingJob ? "Update Job" : "Create Job"}
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
