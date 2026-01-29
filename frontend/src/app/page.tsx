"use client";

import Link from "next/link";
import { useState } from "react";
import {
  User,
  Building2,
  Briefcase,
  Users,
  Target,
  CheckCircle,
  X,
} from "lucide-react";
import { useRouter } from "next/navigation";

export default function Home() {
  const [showRoleModal, setShowRoleModal] = useState(false);
  const router = useRouter();

  const closeRoleModal = () => setShowRoleModal(false);
  const openRoleModal = () => setShowRoleModal(true);

  const handleRoleSelection = (role: "jobseeker" | "employer") => {
    setShowRoleModal(false);
    if (role === "jobseeker") {
      router.push("/auth/login/jobseeker"); // Navigate to jobseeker login
    } else {
      router.push("/auth/login/employer"); // Navigate to employer login
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-2">
              <Briefcase className="h-8 w-8 text-blue-600" />
              <h1 className="text-2xl font-bold text-gray-900">JobSphere</h1>
            </div>
            <button
              onClick={openRoleModal}
              className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg font-medium transition-colors duration-200 shadow-md hover:shadow-lg"
            >
              Login
            </button>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center">
            <h2 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6">
              Welcome to{" "}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600">
                JobSphere
              </span>
            </h2>
            <p className="text-xl md:text-2xl text-gray-600 mb-8 max-w-3xl mx-auto">
              Your one-stop solution for job hunting and talent acquisition
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button
                onClick={openRoleModal}
                className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-4 rounded-lg text-lg font-semibold transition-all duration-200 transform hover:scale-105 shadow-lg hover:shadow-xl"
              >
                Get Started
              </button>
              <a
                href="#about"
                className="border-2 border-blue-600 text-blue-600 hover:bg-blue-600 hover:text-white px-8 py-4 rounded-lg text-lg font-semibold transition-all duration-200 transform hover:scale-105"
              >
                Learn More
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-white">
        <div className="max-w-7xl mx-auto">
          <h3 className="text-3xl font-bold text-center text-gray-900 mb-12">
            Why Choose JobSphere?
          </h3>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center p-6 rounded-xl bg-gradient-to-br from-blue-50 to-blue-100 hover:shadow-lg transition-shadow">
              <Users className="h-12 w-12 text-blue-600 mx-auto mb-4" />
              <h4 className="text-xl font-semibold text-gray-900 mb-3">
                Connect Talent
              </h4>
              <p className="text-gray-600">
                Bridge the gap between skilled professionals and top companies
              </p>
            </div>
            <div className="text-center p-6 rounded-xl bg-gradient-to-br from-purple-50 to-purple-100 hover:shadow-lg transition-shadow">
              <Target className="h-12 w-12 text-purple-600 mx-auto mb-4" />
              <h4 className="text-xl font-semibold text-gray-900 mb-3">
                Smart Matching
              </h4>
              <p className="text-gray-600">
                AI-powered algorithms to find the perfect job or candidate
              </p>
            </div>
            <div className="text-center p-6 rounded-xl bg-gradient-to-br from-green-50 to-green-100 hover:shadow-lg transition-shadow">
              <CheckCircle className="h-12 w-12 text-green-600 mx-auto mb-4" />
              <h4 className="text-xl font-semibold text-gray-900 mb-3">
                Easy Process
              </h4>
              <p className="text-gray-600">
                Streamlined application and hiring process for everyone
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* About Section */}
      <section id="about" className="py-16 px-4 sm:px-6 lg:px-8 bg-gray-50">
        <div className="max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <h3 className="text-3xl font-bold text-gray-900 mb-6">
                About JobSphere
              </h3>
              <p className="text-lg text-gray-600 mb-6">
                JobSphere is a comprehensive job portal designed to revolutionize the way people find jobs and companies hire talent.
              </p>
              <p className="text-lg text-gray-600 mb-6">
                Our platform provides intuitive tools, smart matching algorithms, and a user-friendly interface to make the entire process seamless and efficient.
              </p>
              <div className="space-y-3">
                {[
                  "Thousands of job opportunities",
                  "Verified company profiles",
                  "Advanced search filters",
                  "Real-time application tracking",
                ].map((item, idx) => (
                  <div key={idx} className="flex items-center space-x-3">
                    <CheckCircle className="h-5 w-5 text-green-600" />
                    <span className="text-gray-700">{item}</span>
                  </div>
                ))}
              </div>
            </div>
            <div className="bg-white p-8 rounded-2xl shadow-lg">
              <h4 className="text-2xl font-bold text-gray-900 mb-6 text-center">
                Ready to Get Started?
              </h4>
              <div className="space-y-4">
                <div className="flex items-center space-x-4 p-4 bg-blue-50 rounded-lg">
                  <User className="h-8 w-8 text-blue-600" />
                  <div>
                    <h5 className="font-semibold text-gray-900">For Job Seekers</h5>
                    <p className="text-sm text-gray-600">Find your dream job with ease</p>
                  </div>
                </div>
                <div className="flex items-center space-x-4 p-4 bg-purple-50 rounded-lg">
                  <Building2 className="h-8 w-8 text-purple-600" />
                  <div>
                    <h5 className="font-semibold text-gray-900">For Employers</h5>
                    <p className="text-sm text-gray-600">Hire the best talent efficiently</p>
                  </div>
                </div>
              </div>
              <button
                onClick={openRoleModal}
                className="w-full mt-6 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white py-3 rounded-lg font-semibold transition-all duration-200 transform hover:scale-105"
              >
                Join JobSphere Today
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto text-center">
          <div className="flex items-center justify-center space-x-2 mb-4">
            <Briefcase className="h-6 w-6" />
            <span className="text-xl font-bold">JobSphere</span>
          </div>
          <p className="text-gray-400 mb-4">
            Connecting talent with opportunities worldwide
          </p>
          <p className="text-gray-500 text-sm">© 2024 JobSphere. All rights reserved.</p>
        </div>
      </footer>

      {/* Role Selection Modal */}
      {showRoleModal && (
        <div className="fixed inset-0 bg-black/80 bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl p-8 max-w-md w-full mx-4 relative transform transition-all">
            <button
              onClick={closeRoleModal}
              className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition-colors"
            >
              <X className="h-6 w-6" />
            </button>

            <div className="text-center mb-6">
              <h3 className="text-2xl font-bold text-gray-900 mb-2">
                Choose Your Role
              </h3>
              <p className="text-gray-600">How would you like to use JobSphere?</p>
            </div>

            <div className="space-y-4">
              <button
                onClick={() => handleRoleSelection("jobseeker")}
                className="flex items-center space-x-4 p-6 border-2 border-gray-200 rounded-xl hover:border-blue-500 hover:bg-blue-50 transition-all cursor-pointer group w-full text-left"
              >
                <User className="h-12 w-12 text-blue-600 group-hover:scale-110 transition-transform" />
                <div className="flex-1">
                  <h4 className="text-lg font-semibold text-gray-900">Job Seeker</h4>
                  <p className="text-gray-600 text-sm">Find and apply for your dream job</p>
                </div>
              </button>

              <button
                onClick={() => handleRoleSelection("employer")}
                className="flex items-center space-x-4 p-6 border-2 border-gray-200 rounded-xl hover:border-purple-500 hover:bg-purple-50 transition-all cursor-pointer group w-full text-left"
              >
                <Building2 className="h-12 w-12 text-purple-600 group-hover:scale-110 transition-transform" />
                <div className="flex-1">
                  <h4 className="text-lg font-semibold text-gray-900">Employer</h4>
                  <p className="text-gray-600 text-sm">Post jobs and hire talented candidates</p>
                </div>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
