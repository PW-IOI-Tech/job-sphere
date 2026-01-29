"use client";

import React, { useEffect, useState } from "react";
import axios from "axios";
import {toast} from "sonner"

const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL;

interface Job {
  id: number;
  title: string;
  createdAt: string;
}

interface JobSeekerUser {
  id: number;
  name: string;
  email: string;
  phone?: string;
  location?: string;
  profilePicture?: string;
}

interface ApplicationResponse {
  id: number;
  field: {
    label: string;
  };
  answer: string;
}

interface Application {
  id: number;
  status: string;
  appliedAt: string;
  jobSeeker: {
    user: JobSeekerUser;
  };
  responses: ApplicationResponse[];
}

const STATUS_OPTIONS = [
  "PENDING",
  "REVIEWING",
  "SHORTLISTED",
  "INTERVIEWED",
  "ACCEPTED",
  "REJECTED",
];

export default function JobApplicantsPage() {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [selectedJobId, setSelectedJobId] = useState<number | null>(null);
  const [applications, setApplications] = useState<Application[]>([]);
  const [loadingJobs, setLoadingJobs] = useState(false);
  const [loadingApplications, setLoadingApplications] = useState(false);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [viewingApplicant, setViewingApplicant] = useState<Application | null>(null);
  const [updatingStatusId, setUpdatingStatusId] = useState<number | null>(null);

  // Fetch jobs
useEffect(() => {
  const fetchJobs = async () => {
    setLoadingJobs(true);
    try {
      await toast.promise(
        axios.get(`${backendUrl}/api/jobs/employer`, {
          withCredentials: true,
          params: { page: 1, limit: 1000 },
        }),
        {
          loading: "Loading jobs... ⏳",
          success: (res) => {
            if (res.data.success) {
              setJobs(res.data.data.jobs);
              return "Jobs loaded ✅";
            }
            throw new Error("Failed to load jobs");
          },
          error: "Error loading jobs ❌",
        }
      );
    } finally {
      setLoadingJobs(false);
    }
  };
  fetchJobs();
}, []);


  // Fetch applications
useEffect(() => {
  if (!selectedJobId) {
    setApplications([]);
    setTotalPages(1);
    return;
  }

  const fetchApplications = async () => {
    setLoadingApplications(true);
    try {
      await toast.promise(
        axios.get(`${backendUrl}/api/jobs/${selectedJobId}/applications`, {
          withCredentials: true,
          params: { page, limit: 10 },
        }),
        {
          loading: "Loading applications... ⏳",
          success: (res) => {
            if (res.data.success) {
              setApplications(res.data.data.applications);
              setTotalPages(res.data.data.pagination.pages);
              return "Applications loaded ✅";
            }
            throw new Error("Failed to load applications");
          },
          error: "Error loading applications ❌",
        }
      );
    } finally {
      setLoadingApplications(false);
    }
  };

  fetchApplications();
}, [selectedJobId, page]);


  // Update application status
  async function updateApplicationStatus(applicationId: number, newStatus: string) {
    if (!selectedJobId) return;
    setUpdatingStatusId(applicationId);
    try {
      const response = await axios.patch(
        `${backendUrl}/api/jobs/${selectedJobId}/applications/${applicationId}/status`,
        { status: newStatus },
        { withCredentials: true }
      );
      if (response.data.success) {
        const refreshedApps = await axios.get(
          `${backendUrl}/api/jobs/${selectedJobId}/applications`,
          { withCredentials: true, params: { page, limit: 10 } }
        );
        setApplications(refreshedApps.data.data.applications);
      } else {
        toast.error("Failed to update status");
      }
    } catch (err) {
      console.error(err);
      toast.error("Error updating status");
    } finally {
      setUpdatingStatusId(null);
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 p-6">
  {/* Header */}
  <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-900 to-blue-700 bg-clip-text text-transparent mb-6">
    Job Applicants
  </h1>

  {/* Job Selector */}
  <div className="mb-6 max-w-md">
    {loadingJobs ? (
      <div className="flex items-center justify-center bg-white/90 backdrop-blur-sm rounded-2xl p-6 border border-blue-300 shadow-lg">
        <div className="w-6 h-6 border-4 border-blue-500 border-t-transparent rounded-full animate-spin" />
        <p className="ml-4 text-blue-800 font-medium">Loading Jobs...</p>
      </div>
    ) : (
      <select
        className="w-full rounded-2xl p-3 bg-white border border-blue-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition text-black font-medium cursor-pointer"
        value={selectedJobId ?? ""}
        onChange={(e) => {
          const val = e.target.value;
          setPage(1);
          setSelectedJobId(val ? Number(val) : null);
        }}
        aria-label="Select a job"
      >
        <option value="">Select a job</option>
        {jobs.map((job) => (
          <option key={job.id} value={job.id}>
            {job.title}
          </option>
        ))}
      </select>
    )}
  </div>

  {/* Applications Table */}
  {loadingApplications ? (
    <p className="text-blue-700 font-medium">Loading applicants...</p>
  ) : !selectedJobId ? (
    <p className="text-blue-700 font-medium">Please select a job to view applicants.</p>
  ) : applications.length === 0 ? (
    <p className="text-blue-700 font-medium">No applicants found for this job.</p>
  ) : (
    <div className="overflow-x-auto rounded-2xl bg-white/90 backdrop-blur-sm border border-blue-200 shadow-lg">
      <table className="min-w-full divide-y divide-blue-200">
        <thead className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white">
          <tr>
            <th className="p-4 text-left w-40 rounded-tl-2xl">Applicant</th>
            <th className="p-4 text-left">Email</th>
            <th className="p-4 text-left w-20">Phone</th>
            <th className="p-4 text-left w-28">Location</th>
            <th className="p-4 text-left w-36">Applied On</th>
            <th className="p-4 text-center w-36">Status</th>
            <th className="p-4 text-center w-32 rounded-tr-2xl"></th>
          </tr>
        </thead>
        <tbody className="divide-y divide-blue-100">
          {applications.map((app) => (
            <tr key={app.id} className="hover:bg-blue-50 transition">
              <td className="p-4 flex items-center space-x-3">
                {app.jobSeeker.user.profilePicture ? (
                  <img
                    src={app.jobSeeker.user.profilePicture}
                    alt={app.jobSeeker.user.name}
                    className="w-10 h-10 rounded-full object-cover border border-blue-300"
                  />
                ) : (
                  <div className="w-10 h-10 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-full flex items-center justify-center font-bold uppercase text-lg border border-blue-700">
                    {app.jobSeeker.user.name.charAt(0)}
                  </div>
                )}
                <span className="font-semibold text-blue-900">{app.jobSeeker.user.name}</span>
              </td>
              <td className="p-4 truncate text-blue-800 font-medium">{app.jobSeeker.user.email}</td>
              <td className="p-4 text-blue-700">{app.jobSeeker.user.phone || "-"}</td>
              <td className="p-4 text-blue-700">{app.jobSeeker.user.location || "-"}</td>
              <td className="p-4 text-blue-700">{new Date(app.appliedAt).toLocaleDateString()}</td>
              <td className="p-4 text-center">
                <select
                  disabled={updatingStatusId === app.id}
                  value={app.status}
                  onChange={(e) => updateApplicationStatus(app.id, e.target.value)}
                  className="rounded-md px-2 py-1 font-semibold bg-white border border-blue-300 focus:ring-2 focus:ring-blue-500 transition disabled:opacity-50 text-blue-900 cursor-pointer"
                  aria-label={`Update status for ${app.jobSeeker.user.name}`}
                >
                  {STATUS_OPTIONS.map((status) => (
                    <option key={status} value={status}>
                      {status.charAt(0).toUpperCase() + status.slice(1).toLowerCase()}
                    </option>
                  ))}
                </select>
              </td>
              <td className="p-4 text-center">
                <button
                  onClick={() => setViewingApplicant(app)}
                  className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-4 py-1 rounded-lg font-semibold hover:from-blue-700 hover:to-indigo-700 transition cursor-pointer"
                  type="button"
                  aria-label={`View profile of ${app.jobSeeker.user.name}`}
                >
                  View Profile
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex justify-center gap-4 p-4">
          <button
            disabled={page <= 1}
            onClick={() => setPage((p) => Math.max(1, p - 1))}
            className="px-5 py-2 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-lg font-semibold hover:from-blue-700 hover:to-indigo-700 transition disabled:opacity-50"
            aria-label="Previous page"
          >
            Previous
          </button>
          <span className="text-blue-900 font-semibold flex items-center">
            Page {page} of {totalPages}
          </span>
          <button
            disabled={page >= totalPages}
            onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
            className="px-5 py-2 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-lg font-semibold hover:from-blue-700 hover:to-indigo-700 transition disabled:opacity-50"
            aria-label="Next page"
          >
            Next
          </button>
        </div>
      )}
    </div>
  )}

  {/* Applicant Modal */}
  {viewingApplicant && (
    <div
      className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
      role="dialog"
      aria-modal="true"
      aria-labelledby="applicant-modal-title"
    >
      <div className="bg-white/95 backdrop-blur-sm rounded-3xl max-w-3xl w-full max-h-[90vh] overflow-y-auto p-8 relative shadow-2xl border border-blue-200">
        <button
          className="absolute top-5 right-5 text-blue-700 hover:text-blue-900 text-3xl font-bold focus:outline-none"
          onClick={() => setViewingApplicant(null)}
          aria-label="Close profile modal"
        >
          ×
        </button>

        <div className="flex flex-col items-center mb-6">
          {viewingApplicant.jobSeeker.user.profilePicture ? (
            <img
              src={viewingApplicant.jobSeeker.user.profilePicture}
              alt={viewingApplicant.jobSeeker.user.name}
              className="w-24 h-24 rounded-full object-cover mb-4 border-4 border-blue-600"
            />
          ) : (
            <div className="w-24 h-24 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-full flex items-center justify-center text-5xl font-extrabold mb-4 border-4 border-blue-700">
              {viewingApplicant.jobSeeker.user.name.charAt(0)}
            </div>
          )}
          <h2
            id="applicant-modal-title"
            className="text-3xl font-extrabold text-blue-900 mb-1 text-center"
          >
            {viewingApplicant.jobSeeker.user.name}
          </h2>
          <p className="text-blue-700 font-medium">{viewingApplicant.jobSeeker.user.email}</p>
          {viewingApplicant.jobSeeker.user.phone && (
            <p className="text-blue-700 font-medium">Phone: {viewingApplicant.jobSeeker.user.phone}</p>
          )}
          {viewingApplicant.jobSeeker.user.location && (
            <p className="text-blue-700 font-medium">Location: {viewingApplicant.jobSeeker.user.location}</p>
          )}
        </div>

        <div>
          <h3 className="text-xl font-semibold text-blue-900 mb-4 text-center border-b border-blue-200 pb-2">
            Application Responses
          </h3>
          {viewingApplicant.responses.length === 0 ? (
            <p className="text-blue-700 text-center font-medium">No responses provided.</p>
          ) : (
            <ul className="list-disc list-inside text-blue-800 space-y-2 max-w-lg mx-auto">
              {viewingApplicant.responses.map((resp) => (
                <li key={resp.id}>
                  <span className="font-semibold">{resp.field.label}:</span> {resp.answer}
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  )}
  </div>

  );
}
