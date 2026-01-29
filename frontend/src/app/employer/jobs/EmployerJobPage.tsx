"use client";

import React, { useEffect, useState } from "react";
import axios from "axios";
import { toast } from 'sonner';
import {
  FiPlus,
  FiMoreVertical,
  FiMapPin,
  FiDollarSign,
  FiUsers,
  FiTrash2,
  FiEdit,
  FiPlayCircle,
  FiPauseCircle,
  FiCheckCircle,
  FiSearch,
  FiFilter,
  FiCalendar,
  FiBriefcase,
  FiEye,
} from "react-icons/fi";
import JobCreateModal from "./JobCreateModal";
import JobFormModal from "./JobFormModal";
import { Job, JobFormField, JobForm, ApiResponse, JobsResponse, JobFormResponse } from "./types";

const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL;

// Helper Components
function JobFormPreviewModal({
  open,
  onClose,
  fields,
}: {
  open: boolean;
  onClose: () => void;
  fields: JobFormField[] | null;
}) {
  if (!open || !fields) return null;

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-60 p-4">
      <div className="bg-white rounded-2xl w-full max-w-3xl max-h-[90vh] overflow-auto shadow-2xl">
        <div className="sticky top-0 bg-white border-b border-gray-100 p-6 rounded-t-2xl">
          <h2 className="text-2xl font-bold text-gray-900">Job Form Preview</h2>
          <p className="text-gray-600 mt-1">Preview how the form will appear to applicants</p>
        </div>
        <div className="p-6 space-y-4">
          {fields.map((field, index) => (
            <div key={field.id} className="bg-gray-50 rounded-xl p-4 border border-gray-200 hover:shadow-sm transition-shadow">
              <div className="flex items-start justify-between mb-2">
                <div className="font-semibold text-gray-900 flex items-center gap-2">
                  <span className="bg-blue-100 text-blue-600 text-xs px-2 py-1 rounded-full font-medium">
                    {index + 1}
                  </span>
                  {field.label}
                  {field.isRequired && <span className="text-red-500 text-sm">*</span>}
                </div>
                <span className="text-xs bg-gray-200 text-gray-700 px-2 py-1 rounded-full font-medium">
                  {field.fieldType}
                </span>
              </div>
              {field.options && field.options.length > 0 && (
                <div className="mt-3 p-3 bg-white rounded-lg border border-gray-200">
                  <p className="text-sm font-medium text-gray-700 mb-2">Available options:</p>
                  <div className="flex flex-wrap gap-2">
                    {field.options.map((option, optIndex) => (
                      <span
                        key={optIndex}
                        className="text-xs bg-blue-50 text-blue-700 px-2 py-1 rounded-md border border-blue-200"
                      >
                        {option}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
        <div className="sticky bottom-0 bg-white border-t border-gray-100 p-6 rounded-b-2xl">
          <button
            onClick={onClose}
            className="w-full px-6 py-3 bg-red-600 text-white rounded-xl hover:bg-red-700 transition-colors font-semibold"
          >
            Close Preview
          </button>
        </div>
      </div>
    </div>
  );
}

function JobDropdownActions({
  job,
  isOpen,
  onToggle,
  onEdit,
  onUpdateStatus,
  onUpdateForm,
  onPreviewForm,
  onDelete,
}: {
  job: Job;
  isOpen: boolean;
  onToggle: () => void;
  onEdit: () => void;
  onUpdateStatus: () => void;
  onUpdateForm: () => void;
  onPreviewForm: () => void;
  onDelete: () => void;
}) {
  return (
    <div className="relative">
      <button
        onClick={onToggle}
        className="p-2 rounded-xl hover:bg-gray-100 transition-colors"
      >
        <FiMoreVertical className="w-5 h-5 text-gray-600" />
      </button>
      {isOpen && (
        <div className="absolute right-10 top-0 w-64 bg-white border border-gray-200 rounded-2xl shadow-2xl z-50 overflow-hidden">
          <div className="py-0">
            <button
              className="w-full px-4 py-3 flex items-center gap-3 text-left hover:bg-blue-50 transition-colors"
              onClick={onEdit}
            >
              <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                <FiEdit className="w-4 h-4 text-blue-600" />
              </div>
              <span className="font-medium text-gray-700">Update Job</span>
            </button>
            <button
              className="w-full px-4 py-3 flex items-center gap-3 text-left hover:bg-green-50 transition-colors"
              onClick={onUpdateStatus}
            >
              <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center">
                <FiPlayCircle className="w-4 h-4 text-green-600" />
              </div>
              <span className="font-medium text-gray-700">Update Status</span>
            </button>
            <button
              className="w-full px-4 py-3 flex items-center gap-3 text-left hover:bg-indigo-50 transition-colors"
              onClick={onUpdateForm}
            >
              <div className="w-8 h-8 bg-indigo-100 rounded-lg flex items-center justify-center">
                <FiEdit className="w-4 h-4 text-indigo-600" />
              </div>
              <span className="font-medium text-gray-700">Update Form</span>
            </button>
            <button
              className="w-full px-4 py-2 flex items-center gap-3 text-left hover:bg-gray-50 transition-colors"
              onClick={onPreviewForm}
            >
              <div className="w-8 h-8 bg-gray-100 rounded-lg flex items-center justify-center">
                <FiEye className="w-4 h-4 text-gray-600" />
              </div>
              <span className="font-medium text-gray-700">Preview Form</span>
            </button>
            <hr className="my-2" />
            <button
              className="w-full px-4 pb-2 flex items-center gap-3 text-left hover:bg-red-50 transition-colors text-red-600"
              onClick={onDelete}
            >
              <div className="w-8 h-8 bg-red-100 rounded-lg flex items-center justify-center">
                <FiTrash2 className="w-4 h-4 text-red-600" />
              </div>
              <span className="font-medium">Delete Job</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default function EmployerJobsPage() {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [allJobs, setAllJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("All Status");
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [dropdownOpen, setDropdownOpen] = useState<number | null>(null);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [editingJob, setEditingJob] = useState<Job | null>(null);
  const [formModalOpen, setFormModalOpen] = useState(false);
  const [currentJobId, setCurrentJobId] = useState<number | null>(null);
  const [editingJobForm, setEditingJobForm] = useState<JobFormField[] | null>(null);
  const [statusModalOpen, setStatusModalOpen] = useState(false);
  const [statusUpdateJob, setStatusUpdateJob] = useState<Job | null>(null);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [jobToDelete, setJobToDelete] = useState<Job | null>(null);
  const [previewFormOpen, setPreviewFormOpen] = useState(false);
  const [previewFormFields, setPreviewFormFields] = useState<JobFormField[] | null>(null);

const fetchJobs = async () => {
  setLoading(true);
  try {
    await toast.promise(
      axios.get<ApiResponse<JobsResponse>>(
        `${backendUrl}/api/jobs/employer`,
        {
          params: statusFilter !== "All Status" 
            ? { page, status: statusFilter.toUpperCase() } 
            : { page },
          withCredentials: true,
        }
      ),
      {
        loading: "Fetching jobs... ⏳",
        success: (response) => {
          const data = response.data;
          if (data.success) {
            setAllJobs(data.data.jobs);
            setTotalPages(data.data.pagination.pages);
            return `Loaded ${data.data.jobs.length} jobs successfully ✅`;
          } else {
            throw new Error("Failed to load jobs");
          }
        },
        error: (err) => {
          let errorMessage = "Error fetching jobs ❌";
          if (axios.isAxiosError(err)) {
            if (err.code === "ECONNABORTED") {
              errorMessage = "Request timed out. Please try again.";
            } else if (err.response) {
              errorMessage = `Server error: ${err.response.status}`;
            } else if (err.request) {
              errorMessage = "Network error. Please check your connection.";
            }
          } else if (err instanceof Error) {
            errorMessage = err.message;
          }
          return errorMessage;
        },
      }
    );
  } finally {
    setLoading(false);
  }
};


  useEffect(() => {
    let filteredJobs = allJobs;
    if (searchTerm.trim()) {
      filteredJobs = filteredJobs.filter((job) =>
        job.title.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    if (statusFilter !== "All Status") {
      filteredJobs = filteredJobs.filter(
        (job) => job.status === statusFilter.toUpperCase()
      );
    }
    setJobs(filteredJobs);
  }, [searchTerm, statusFilter, allJobs]);

  useEffect(() => {
    fetchJobs();
    // eslint-disable-next-line
  }, [page]);

  const handleSaveJob = async (form: JobForm) => {
    try {
      const payload = {
        title: form.title,
        role: form.role,
        description: form.description,
        requirements: form.requirements,
        location: form.location,
        jobType: form.jobType,
        salaryMin: form.salaryMin ? Number(form.salaryMin) : null,
        salaryMax: form.salaryMax ? Number(form.salaryMax) : null,
        noOfOpenings: form.noOfOpenings ? Number(form.noOfOpenings) : 1,
      };

      let response;
      if (editingJob) {
        response = await axios.put<ApiResponse<Job>>(
          `${backendUrl}/api/jobs/${editingJob.id}`,
          payload,
          { withCredentials: true }
        );
      } else {
        response = await axios.post<ApiResponse<Job>>(
          `${backendUrl}/api/jobs/create`,
          payload,
          { withCredentials: true }
        );
      }

      if (response.data.success) {
        setDrawerOpen(false);
        setEditingJob(null);
        fetchJobs();
        toast.success(
            editingJob ? "Job updated successfully!" : "Job created successfully! Default form fields have been created automatically."
          );
        } else {
          toast.error("Failed to save job");
        }
      } catch (err) {
        console.error("Error saving job:", err);
        toast.error("Error saving job");
      }
  };

  const handleUpdateJobStatus = async (jobId: number, newStatus: string) => {
    try {
      const response = await axios.patch<ApiResponse<Job>>(
        `${backendUrl}/api/jobs/${jobId}/status`,
        { status: newStatus },
        { withCredentials: true }
      );
      if (response.data.success) {
        toast.success("Job status updated successfully!");
        fetchJobs();
        setStatusModalOpen(false);
        setStatusUpdateJob(null);
      } else {
        toast.error("Failed to update job status");
      }
    } catch (err) {
      console.error("Error updating job status:", err);
      toast.error("Error updating job status");
    }
  };

  const handleDeleteJob = async (jobId: number) => {
    try {
      const response = await axios.delete<ApiResponse<{ message: string }>>(
        `${backendUrl}/api/jobs/${jobId}`,
        { withCredentials: true }
      );
      if (response.data.success) {
        toast.success("Job deleted successfully!");
        fetchJobs();
        setDeleteModalOpen(false);
        setJobToDelete(null);
      } else {
        toast.error("Failed to delete job");
      }
    } catch (err) {
      console.error("Error deleting job:", err);
      toast.error("Error deleting job");
    }
  };

  const fetchJobForm = async (jobId: number): Promise<JobFormField[]> => {
    try {
      const response = await axios.get<ApiResponse<JobFormResponse>>(
        `${backendUrl}/api/jobs/${jobId}/form`,
        { withCredentials: true }
      );
      if (response.data.success) {
        return response.data.data.fields;
      }
      return [];
    } catch (err) {
      console.error("Error fetching job form:", err);
      return [];
    }
  };

const handleSaveJobForm = async (fields: JobFormField[]): Promise<void> => {
  if (!currentJobId) return;

  try {
    const validFields = fields.filter(f => f.label && f.label.trim() !== "");
    const seenLabels = new Set<string>();
    const uniqueFields = validFields.filter(f => {
      const label = f.label.trim().toLowerCase();
      if (seenLabels.has(label)) return false;
      seenLabels.add(label);
      return true;
    });

    if (uniqueFields.length === 0) {
      toast.error("No valid fields to save. Please add at least one unique field.");
      return;
    }

    const apiFields = uniqueFields.map((f, idx) => ({
      label: f.label.trim(),
      fieldType: f.fieldType,
      isRequired: f.isRequired ?? false,
      order: f.order ?? idx + 1,
      options: Array.isArray(f.options) ? f.options.filter(opt => opt?.trim() !== "") : [],
    }));

    // API call
    const response = await axios.post<ApiResponse<JobFormResponse>>(
      `${backendUrl}/api/jobs/${currentJobId}/form`,
      { fields: apiFields },
      { withCredentials: true }
    );

    if (response.data.success) {
      toast.success("Job form saved successfully!");
      setFormModalOpen(false);
      setEditingJobForm(null);
      setCurrentJobId(null);
    } else {
      toast.error("Failed to save job form");
    }

  } catch (err) {
    // Ensure `err` is typed safely
    const error = err as { message?: string; response?: { data?: { message?: string } } };
    const errorMessage = error.response?.data?.message ?? error.message ?? "Unknown error occurred";

    if (errorMessage.includes("Unique constraint failed") || errorMessage.includes("duplicate key")) {
      toast.error("Error: Duplicate field labels detected. Please ensure all field labels are unique.");
    } else {
      toast.error("Error saving job form: ");
    }
  }
};


  const handleDeleteJobFormField = async (jobId: number, fieldId: number) => {
    try {
      const response = await axios.delete<ApiResponse<{ message: string }>>(
        `${backendUrl}/api/jobs/${jobId}/form/field/${fieldId}`,
        { withCredentials: true }
      );
      if (response.data.success) {
        toast.success("Job form field deleted successfully!");
        if (formModalOpen && currentJobId === jobId) {
          const updatedFields = await fetchJobForm(jobId);
          setEditingJobForm(updatedFields);
        }
      } else {
        toast.error("Failed to delete job form field");
      }
    } catch (err) {
      console.error("Error deleting job form field:", err);
      toast.error("Error deleting job form field");
    }
  };

  const toggleDropdown = (jobId: number) => {
    setDropdownOpen(dropdownOpen === jobId ? null : jobId);
  };

  const handleOpenJobFormModal = async (jobId: number, isEdit: boolean = false) => {
    setCurrentJobId(jobId);
    if (isEdit) {
      const existingFields = await fetchJobForm(jobId);
      setEditingJobForm(existingFields);
    } else {
      setEditingJobForm(null);
    }
    setFormModalOpen(true);
    setDropdownOpen(null);
  };

  const handlePreviewJobForm = async (jobId: number) => {
    const fields = await fetchJobForm(jobId);
    if (fields.length === 0) {
      toast.error("No form exists for this job yet.");
      return;
    }
    setPreviewFormFields(fields);
    setPreviewFormOpen(true);
    setDropdownOpen(null);
  };

  const formatSalary = (min: number | null, max: number | null) => {
    if (!min && !max) return "Salary not disclosed";
    if (!min) return `Up to $${(max! / 1000).toFixed(0)}k`;
    if (!max) return `From $${(min / 1000).toFixed(0)}k`;
    return `$${(min / 1000).toFixed(0)}k - $${(max / 1000).toFixed(0)}k`;
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "ACTIVE": return "bg-green-100 text-green-800 border-green-200";
      case "PAUSED": return "bg-yellow-100 text-yellow-800 border-yellow-200";
      case "COMPLETED": return "bg-gray-100 text-gray-800 border-gray-200";
      default: return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
      <div className="max-w-7xl mx-auto px-4 py-1">
        {/* Header Section */}
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 sticky top-0 py-4 z-50 bg-white px-8 shadow rounded-2xl mb-1">
          <div>
            <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">Job Postings</h1>
            <p className="text-gray-600 mt-2">Manage your job listings and applications</p>
          </div>
          <button
            className="flex items-center gap-3 px-8 py-4 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-2xl hover:from-blue-700 hover:to-indigo-700 shadow-lg hover:shadow-xl transition-all duration-200 font-semibold"
            onClick={() => {
              setEditingJob(null);
              setDrawerOpen(true);
            }}
          >
            <FiPlus className="text-xl" />
            Create New Job
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Search and Filter Section */}
          <div className="lg:col-span-1">
            <div className="bg-white/90 backdrop-blur-lg rounded-2xl shadow-lg border border-white/20 p-6 sticky top-28">
              <div className="flex items-center gap-3 mb-6">
                <div className="p-2 bg-blue-100 rounded-lg">
                  <FiSearch className="text-blue-600" />
                </div>
                <h3 className="font-semibold text-gray-900">Search & Filter</h3>
              </div>

              <div className="space-y-6">
                {/* Search Input */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Search Jobs</label>
                  <div className="relative">
                    <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                    <input
                      type="text"
                      placeholder="Search by title, role..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="w-full pl-10 pr-4 py-3 rounded-xl border border-gray-200 bg-gray-50 text-gray-900 focus:bg-white focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all"
                    />
                  </div>
                </div>

                {/* Status Filter */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Status</label>
                  <div className="relative">
                    <FiFilter className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                    <select
                      value={statusFilter}
                      onChange={(e) => {
                        setStatusFilter(e.target.value);
                        setPage(1);
                      }}
                      className="w-full pl-10 pr-4 py-3 rounded-xl border border-gray-200 bg-gray-50 text-gray-900 focus:bg-white focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all appearance-none cursor-pointer"
                    >
                      <option value="All Status">All Status</option>
                      <option value="ACTIVE">Active</option>
                      <option value="PAUSED">Paused</option>
                      <option value="COMPLETED">Completed</option>
                    </select>
                  </div>
                </div>

                {/* Search Button */}
                <button
                  onClick={() => {
                    setPage(1);
                    fetchJobs();
                  }}
                  className="w-full py-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-colors font-semibold flex items-center justify-center gap-2"
                >
                  <FiSearch />
                  Apply Filters
                </button>
              </div>
            </div>
          </div>

          {/* Jobs List */}
          <div className="lg:col-span-3">
            {loading ? (
              <div className="flex items-center justify-center min-h-[50vh]">
                <div className="text-center">
                  <div className="w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                  <p className="text-gray-600 text-lg font-medium">Loading your jobs...</p>
                </div>
              </div>
            ) : jobs.length === 0 ? (
              <div className="bg-white/90 backdrop-blur-lg rounded-2xl shadow-lg border border-white/20 p-12 text-center">
                <div className="w-24 h-24 bg-gray-100 rounded-2xl flex items-center justify-center mx-auto mb-6">
                  <FiBriefcase className="w-12 h-12 text-gray-400" />
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-3">No jobs found</h3>
                <p className="text-gray-600 mb-6 max-w-md mx-auto">
                  {searchTerm || statusFilter !== "All Status"
                    ? "No jobs match your current filters. Try adjusting your search criteria."
                    : "You haven't created any job postings yet. Create your first job to get started."}
                </p>
                <button
                  onClick={() => {
                    setEditingJob(null);
                    setDrawerOpen(true);
                  }}
                  className="px-6 py-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-colors font-semibold"
                >
                  Create Your First Job
                </button>
              </div>
            ) : (
              <div className="space-y-6">
                {jobs.map((job) => (
                  <div
                    key={job.id}
                    className="bg-white/90 backdrop-blur-lg border border-white/30 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-200 overflow-hidden group"
                  >
                    <div className="p-6">
                      {/* Top Row */}
                      <div className="flex items-start justify-between mb-4">
                        <div className="flex-1">
                          <div className="flex items-start gap-4">
                            <div className="p-3 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl text-white">
                              <FiBriefcase className="w-5 h-5" />
                            </div>
                            <div className="flex flex-col">
                              <div className="text-sm text-gray-500">
                                Posted {new Date(job.createdAt).toLocaleDateString("en-US", { month: "short", day: "numeric" })}
                              </div>
                            </div>
                          </div>
                        </div>

                        {/* Actions Dropdown */}
                        <JobDropdownActions
                          job={job}
                          isOpen={dropdownOpen === job.id}
                          onToggle={() => toggleDropdown(job.id)}
                          onEdit={() => {
                            setEditingJob(job);
                            setDrawerOpen(true);
                            setDropdownOpen(null);
                          }}
                          onUpdateStatus={() => {
                            setStatusUpdateJob(job);
                            setStatusModalOpen(true);
                            setDropdownOpen(null);
                          }}
                          onUpdateForm={() => handleOpenJobFormModal(job.id, true)}
                          onPreviewForm={() => handlePreviewJobForm(job.id)}
                          onDelete={() => {
                            setJobToDelete(job);
                            setDeleteModalOpen(true);
                            setDropdownOpen(null);
                          }}
                        />
                      </div>

                      {/* Job Info */}
                      <div className="flex-1">
                        <h3 className="text-xl font-bold text-gray-900 mb-1 group-hover:text-blue-600 transition-colors">
                          {job.title}
                        </h3>
                        {job.role && <p className="text-gray-600 font-medium mb-2">{job.role}</p>}
                        <div className="flex items-center gap-4 text-sm text-gray-500">
                          {job.location && (
                            <span className="flex items-center gap-1">
                              <FiMapPin className="text-blue-500" />
                              {job.location}
                            </span>
                          )}
                          <span className="flex items-center gap-1">
                            <FiCalendar className="text-blue-500" />
                            {new Date(job.createdAt).toLocaleDateString()}
                          </span>
                        </div>
                      </div>

                      <p className="text-gray-700 leading-relaxed mb-6 line-clamp-3">{job.description}</p>

                      {/* Stat Cards */}
                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
                        <div className="bg-blue-50 rounded-xl p-4 border border-blue-100">
                          <div className="flex items-center gap-3">
                            <div className="p-2 bg-blue-100 rounded-lg">
                              <FiDollarSign className="w-4 h-4 text-blue-600" />
                            </div>
                            <div>
                              <p className="text-xs font-medium text-blue-600 uppercase tracking-wide">Salary Range</p>
                              <p className="font-semibold text-blue-900">{formatSalary(job.salaryMin ?? 0, job.salaryMax ?? 0)}</p>
                            </div>
                          </div>
                        </div>
                        <div className="bg-green-50 rounded-xl p-4 border border-green-100">
                          <div className="flex items-center gap-3">
                            <div className="p-2 bg-green-100 rounded-lg">
                              <FiUsers className="w-4 h-4 text-green-600" />
                            </div>
                            <div>
                              <p className="text-xs font-medium text-green-600 uppercase tracking-wide">Applications</p>
                              <p className="font-semibold text-green-900">{job.totalApplications}</p>
                            </div>
                          </div>
                        </div>
                        <div className="bg-purple-50 rounded-xl p-4 border border-purple-100">
                          <div className="flex items-center gap-3">
                            <div className="p-2 bg-purple-100 rounded-lg">
                              <FiBriefcase className="w-4 h-4 text-purple-600" />
                            </div>
                            <div>
                              <p className="text-xs font-medium text-purple-600 uppercase tracking-wide">Openings</p>
                              <p className="font-semibold text-purple-900">{job.noOfOpenings}</p>
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Job Footer */}
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <span className={`px-3 py-1 rounded-full text-xs font-semibold border ${getStatusColor(job.status)}`}>
                            {job.status.charAt(0).toUpperCase() + job.status.slice(1).toLowerCase()}
                          </span>
                          <span className="px-3 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-700 border border-gray-200">
                            {job.jobType.replace("_", " ")}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* PAGINATION */}
            {totalPages > 1 && (
              <div className="mt-8">
                <div className="bg-white/90 backdrop-blur-lg rounded-2xl shadow-lg border border-white/20 p-6">
                  <div className="flex items-center justify-between">
                    <button
                      onClick={() => setPage(Math.max(1, page - 1))}
                      disabled={page === 1}
                      className="flex items-center gap-2 px-6 py-3 bg-gray-100 text-gray-700 rounded-xl hover:bg-gray-200 transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      Previous
                    </button>
                    <div className="flex items-center gap-2">
                      {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                        let pageNum;
                        if (totalPages <= 5) {
                          pageNum = i + 1;
                        } else if (page <= 3) {
                          pageNum = i + 1;
                        } else if (page >= totalPages - 2) {
                          pageNum = totalPages - 4 + i;
                        } else {
                          pageNum = page - 2 + i;
                        }
                        return (
                          <button
                            key={pageNum}
                            onClick={() => setPage(pageNum)}
                            className={`w-10 h-10 rounded-xl font-semibold transition-colors ${
                              page === pageNum
                                ? "bg-blue-600 text-white"
                                : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                            }`}
                          >
                            {pageNum}
                          </button>
                        );
                      })}
                    </div>
                    <button
                      onClick={() => setPage(Math.min(totalPages, page + 1))}
                      disabled={page === totalPages}
                      className="flex items-center gap-2 px-6 py-3 bg-gray-100 text-gray-700 rounded-xl hover:bg-gray-200 transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      Next
                    </button>
                  </div>
                  <div className="mt-4 text-center text-sm text-gray-600">
                    Showing page {page} of {totalPages} ({jobs.length} jobs)
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* MODALS */}
        <JobCreateModal
          open={drawerOpen}
          onClose={() => {
            setDrawerOpen(false);
            setEditingJob(null);
          }}
          onSave={handleSaveJob}
          editingJob={editingJob}
        />

        <JobFormModal
          open={formModalOpen}
          onClose={() => {
            setFormModalOpen(false);
            setEditingJobForm(null);
            setCurrentJobId(null);
          }}
          onSave={handleSaveJobForm}
          existingFields={editingJobForm}
          jobId={currentJobId}
          onDeleteField={handleDeleteJobFormField}
        />

        <JobFormPreviewModal
          open={previewFormOpen}
          onClose={() => {
            setPreviewFormOpen(false);
            setPreviewFormFields(null);
          }}
          fields={previewFormFields}
        />

        {/* Status Modal */}
        {statusModalOpen && statusUpdateJob && (
          <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-2xl p-8 w-full max-w-md shadow-2xl">
              <div className="text-center mb-6">
                <div className="w-16 h-16 bg-blue-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <FiPlayCircle className="w-8 h-8 text-blue-600" />
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-2">Update Job Status</h3>
                <p className="text-gray-600">
                  Change status for <span className="font-semibold">{statusUpdateJob.title}</span>
                </p>
              </div>
              <div className="space-y-3 mb-6">
                <button
                  onClick={() => handleUpdateJobStatus(statusUpdateJob.id, "ACTIVE")}
                  disabled={statusUpdateJob.status === "ACTIVE"}
                  className="w-full flex items-center gap-3 px-4 py-3 bg-green-50 border border-green-200 rounded-xl hover:bg-green-100 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <div className="w-10 h-10 bg-green-500 rounded-xl flex items-center justify-center">
                    <FiPlayCircle className="w-5 h-5 text-white" />
                  </div>
                  <div className="text-left">
                    <p className="font-semibold text-green-900">Set as Active</p>
                    <p className="text-sm text-green-600">Job will be visible to candidates</p>
                  </div>
                </button>
                <button
                  onClick={() => handleUpdateJobStatus(statusUpdateJob.id, "PAUSED")}
                  disabled={statusUpdateJob.status === "PAUSED"}
                  className="w-full flex items-center gap-3 px-4 py-3 bg-yellow-50 border border-yellow-200 rounded-xl hover:bg-yellow-100 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <div className="w-10 h-10 bg-yellow-500 rounded-xl flex items-center justify-center">
                    <FiPauseCircle className="w-5 h-5 text-white" />
                  </div>
                  <div className="text-left">
                    <p className="font-semibold text-yellow-900">Set as Paused</p>
                    <p className="text-sm text-yellow-600">Temporarily hide from candidates</p>
                  </div>
                </button>
                <button
                  onClick={() => handleUpdateJobStatus(statusUpdateJob.id, "COMPLETED")}
                  disabled={statusUpdateJob.status === "COMPLETED"}
                  className="w-full flex items-center gap-3 px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl hover:bg-gray-100 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <div className="w-10 h-10 bg-gray-500 rounded-xl flex items-center justify-center">
                    <FiCheckCircle className="w-5 h-5 text-white" />
                  </div>
                  <div className="text-left">
                    <p className="font-semibold text-gray-900">Set as Completed</p>
                    <p className="text-sm text-gray-600">Mark as filled/closed</p>
                  </div>
                </button>
              </div>
              <button
                onClick={() => {
                  setStatusModalOpen(false);
                  setStatusUpdateJob(null);
                }}
                className="w-full px-4 py-3 border border-gray-300 rounded-xl hover:bg-gray-50 transition-colors font-semibold text-gray-700"
              >
                Cancel
              </button>
            </div>
          </div>
        )}

        {/* Delete Modal */}
        {deleteModalOpen && jobToDelete && (
          <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-2xl p-8 w-full max-w-md shadow-2xl">
              <div className="text-center mb-6">
                <div className="w-16 h-16 bg-red-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <FiTrash2 className="w-8 h-8 text-red-600" />
                </div>
                <h3 className="text-2xl font-bold text-red-600 mb-2">Delete Job</h3>
                <p className="text-gray-600 mb-4">
                  Are you sure you want to delete <span className="font-semibold">{jobToDelete.title}</span>?
                </p>
                <div className="bg-red-50 border border-red-200 rounded-xl p-4">
                  <p className="text-sm text-red-700">
                    <strong>Warning:</strong> This action cannot be undone. All applications and related data will be permanently deleted.
                  </p>
                </div>
              </div>
              <div className="flex gap-3">
                <button
                  onClick={() => {
                    setDeleteModalOpen(false);
                    setJobToDelete(null);
                  }}
                  className="flex-1 px-4 py-3 border border-gray-300 rounded-xl hover:bg-gray-50 transition-colors font-semibold text-gray-700"
                >
                  Cancel
                </button>
                <button
                  onClick={() => handleDeleteJob(jobToDelete.id)}
                  className="flex-1 px-4 py-3 bg-red-600 text-white rounded-xl hover:bg-red-700 transition-colors font-semibold"
                >
                  Delete Job
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
