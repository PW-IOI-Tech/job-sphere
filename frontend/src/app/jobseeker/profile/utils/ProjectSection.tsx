// components/profile/ProjectsSection.tsx
'use client';
import { useState } from 'react';
import { Rocket, Plus, Edit3, Trash2, CheckCircle2, Calendar, Github, ExternalLink, Code, Zap, Lock, AlertCircle } from 'lucide-react';
import { Project, ProjectFormData } from './types';
import { addProject, updateProject, deleteProject } from './profileApi';
import ProjectModal from './ProjectModel';
import { promiseToast, showActionToast } from './toasts';


interface ProjectsSectionProps {
  data: Project[];
  onUpdate: () => void;
  isComplete: boolean;
  canAccess: boolean;
}

const ProjectsSection: React.FC<ProjectsSectionProps> = ({ 
  data, 
  onUpdate, 
  isComplete, 
  canAccess 
}) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProject, setEditingProject] = useState<Project | null>(null);

  const handleAdd = async (formData: ProjectFormData) => {
    const addPromise = addProject(formData);
    
    promiseToast(addPromise, {
      loading: 'Adding project...',
      success: 'Project added successfully! 🚀',
      error: 'Failed to add project'
    }).unwrap().then(() => {
      onUpdate();
      setIsModalOpen(false);
    }).catch(() => {
      // Error is handled by promiseToast
    });
  };

  const handleUpdate = async (formData: ProjectFormData) => {
    if (!editingProject) return;
    
    const updatePromise = updateProject(editingProject.id, formData);
    
    promiseToast(updatePromise, {
      loading: 'Updating project...',
      success: 'Project updated successfully! ✅',
      error: 'Failed to update project'
    }).unwrap().then(() => {
      onUpdate();
      setIsModalOpen(false);
      setEditingProject(null);
    }).catch(() => {
      // Error handled by promiseToast
    });
  };

  const handleDelete = async (id: number) => {
    showActionToast(
      'Delete Project',
      'Confirm',
      async () => {
        const deletePromise = deleteProject(id);
        promiseToast(deletePromise, {
          loading: 'Deleting project...',
          success: 'Project deleted successfully! 🗑️',
          error: 'Failed to delete project'
        }).unwrap().then(() => {
          onUpdate();
        }).catch(() => {
          // Error handled by promiseToast
        });
      },
      'Are you sure you want to delete this project?'
    );
  };

  const openAddModal = () => {
    if (!canAccess) return;
    setEditingProject(null);
    setIsModalOpen(true);
  };

  const openEditModal = (project: Project) => {
    if (!canAccess) return;
    setEditingProject(project);
    setIsModalOpen(true);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'short' 
    });
  };

  // If user can't access this section
  if (!canAccess) {
    return (
      <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl border border-white/20 overflow-hidden mb-8">
        {/* Section Header */}
        <div className="bg-gradient-to-r from-gray-50 to-white border-b border-gray-100 px-8 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="flex items-center justify-center w-12 h-12 bg-gradient-to-r from-gray-400 to-gray-500 rounded-xl shadow-lg">
                <Rocket className="w-6 h-6 text-white" />
              </div>
              <div>
                <div className="flex items-center space-x-3">
                  <h2 className="text-2xl font-bold text-gray-500">Projects</h2>
                  <div className="flex items-center space-x-1 bg-gray-100 px-3 py-1 rounded-full">
                    <Lock className="w-4 h-4 text-gray-600" />
                    <span className="text-xs font-medium text-gray-600">Locked</span>
                  </div>
                </div>
                <p className="text-gray-500 text-sm mt-1">Complete your professional profile first to unlock this section</p>
              </div>
            </div>
          </div>
        </div>

        {/* Locked Content */}
        <div className="p-8">
          <div className="text-center py-16">
            <div className="w-20 h-20 bg-gray-100 rounded-2xl flex items-center justify-center mx-auto mb-6">
              <Lock className="w-10 h-10 text-gray-400" />
            </div>
            <h3 className="text-lg font-semibold text-gray-700 mb-2">Projects Section Locked</h3>
            <p className="text-gray-500 mb-6 max-w-md mx-auto">
              Please create your professional profile (resume, LinkedIn, GitHub, and skills) first to access the projects section
            </p>
            <div className="inline-flex items-center px-4 py-2 bg-gray-100 text-gray-600 rounded-lg">
              <AlertCircle className="w-4 h-4 mr-2" />
              Professional Profile Required
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <>
      {/* Modern Section Container */}
      <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl border border-white/20 overflow-hidden mb-8">
        {/* Section Header */}
        <div className="bg-gradient-to-r from-gray-50 to-white border-b border-gray-100 px-8 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="flex items-center justify-center w-12 h-12 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-xl shadow-lg">
                <Rocket className="w-6 h-6 text-white" />
              </div>
              <div>
                <div className="flex items-center space-x-3">
                  <h2 className="text-2xl font-bold text-gray-900">Projects</h2>
                  {isComplete && (
                    <div className="flex items-center space-x-1 bg-green-100 px-3 py-1 rounded-full">
                      <CheckCircle2 className="w-4 h-4 text-green-600" />
                      <span className="text-xs font-medium text-green-700">Complete</span>
                    </div>
                  )}
                  {canAccess && (
                    <div className="flex items-center space-x-1 bg-blue-100 px-3 py-1 rounded-full">
                      <CheckCircle2 className="w-4 h-4 text-blue-600" />
                      <span className="text-xs font-medium text-blue-700">Available</span>
                    </div>
                  )}
                </div>
                <p className="text-gray-600 text-sm mt-1">Your portfolio projects and technical achievements</p>
              </div>
            </div>
            
            <button
              onClick={openAddModal}
              disabled={!canAccess}
              className={`inline-flex items-center px-6 py-3 rounded-xl font-medium shadow-lg transition-all duration-200 ${
                canAccess
                  ? 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white hover:from-indigo-700 hover:to-purple-700 hover:shadow-xl transform hover:scale-105'
                  : 'bg-gray-300 text-gray-500 cursor-not-allowed'
              }`}
            >
              <Plus className="w-4 h-4 mr-2" />
              Add Project
            </button>
          </div>
        </div>

        {/* Section Content */}
        <div className="p-8">
          {data && data.length > 0 ? (
            <div className="space-y-6">
              {data.map((project, index) => (
                <div 
                  key={project.id} 
                  className="bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 rounded-2xl border border-indigo-200 p-6 hover:shadow-lg transition-all duration-200 hover:border-indigo-300"
                >
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      {/* Header with title and status */}
                      <div className="flex items-start space-x-4 mb-4">
                        <div className="flex items-center justify-center w-12 h-12 bg-indigo-500 rounded-xl shadow-md flex-shrink-0">
                          <Code className="w-6 h-6 text-white" />
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center space-x-3 mb-1">
                            <h3 className="text-xl font-bold text-gray-900">
                              {project.title}
                            </h3>
                            {project.isActive && (
                              <span className="inline-flex items-center bg-green-100 text-green-800 px-3 py-1 rounded-full text-xs font-medium">
                                <Zap className="w-3 h-3 mr-1" />
                                Active
                              </span>
                            )}
                          </div>
                          <p className="text-gray-700 leading-relaxed">
                            {project.description}
                          </p>
                        </div>
                      </div>

                      {/* Technologies */}
                      {project.technologies && project.technologies.length > 0 && (
                        <div className="mb-4">
                          <p className="text-sm font-medium text-gray-600 mb-2">Technologies Used:</p>
                          <div className="flex flex-wrap gap-2">
                            {project.technologies.map((tech, index) => (
                              <span 
                                key={index}
                                className="inline-flex items-center bg-white/80 backdrop-blur-sm text-indigo-800 px-3 py-1 rounded-full text-xs font-medium shadow-sm border border-indigo-200 hover:shadow-md transition-all duration-200"
                              >
                                {tech}
                              </span>
                            ))}
                          </div>
                        </div>
                      )}

                      {/* Date range */}
                      <div className="flex items-center space-x-3 mb-4">
                        <Calendar className="w-4 h-4 text-indigo-600 flex-shrink-0" />
                        <span className="text-gray-700 font-medium">
                          {formatDate(project.startDate)} - {formatDate(project.endDate)}
                        </span>
                      </div>

                      {/* Project links */}
                      <div className="flex space-x-6">
                        {project.githubUrl && (
                          <a 
                            href={project.githubUrl} 
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="inline-flex items-center text-gray-700 hover:text-indigo-600 transition-colors font-medium text-sm"
                          >
                            <Github className="w-4 h-4 mr-2" />
                            View Code
                          </a>
                        )}
                        {project.liveUrl && (
                          <a 
                            href={project.liveUrl} 
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="inline-flex items-center text-gray-700 hover:text-indigo-600 transition-colors font-medium text-sm"
                          >
                            <ExternalLink className="w-4 h-4 mr-2" />
                            Live Demo
                          </a>
                        )}
                      </div>
                    </div>

                    {/* Action buttons */}
                    <div className="flex flex-col space-y-2 ml-4">
                      <button
                        onClick={() => openEditModal(project)}
                        disabled={!canAccess}
                        className={`inline-flex items-center px-3 py-2 rounded-lg text-sm font-medium shadow-sm transition-colors ${
                          canAccess
                            ? 'bg-blue-500 text-white hover:bg-blue-600'
                            : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                        }`}
                      >
                        <Edit3 className="w-3 h-3 mr-1" />
                        Edit
                      </button>
                      <button
                        onClick={() => handleDelete(project.id)}
                        disabled={!canAccess}
                        className={`inline-flex items-center px-3 py-2 rounded-lg text-sm font-medium shadow-sm transition-colors ${
                          canAccess
                            ? 'bg-red-500 text-white hover:bg-red-600'
                            : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                        }`}
                      >
                        <Trash2 className="w-3 h-3 mr-1" />
                        Delete
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-16">
              <div className="w-20 h-20 bg-gray-100 rounded-2xl flex items-center justify-center mx-auto mb-6">
                <Rocket className="w-10 h-10 text-gray-400" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">No Projects Added</h3>
              <p className="text-gray-600 mb-6 max-w-md mx-auto">
                {canAccess 
                  ? 'Showcase your technical projects, personal work, and development achievements to stand out to employers'
                  : 'Complete your professional profile first to add your project portfolio'
                }
              </p>
              <button
                onClick={openAddModal}
                disabled={!canAccess}
                className={`inline-flex items-center px-6 py-3 rounded-xl font-medium shadow-lg transition-all duration-200 ${
                  canAccess
                    ? 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white hover:from-indigo-700 hover:to-purple-700'
                    : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                }`}
              >
                <Rocket className="w-4 h-4 mr-2" />
                {canAccess ? 'Add Your First Project' : 'Professional Profile Required'}
              </button>
              
              {!canAccess && (
                <div className="mt-6 p-4 bg-yellow-50 border border-yellow-200 rounded-xl max-w-md mx-auto">
                  <div className="flex items-start space-x-3">
                    <AlertCircle className="w-5 h-5 text-yellow-600 flex-shrink-0 mt-0.5" />
                    <div className="text-left">
                      <p className="text-sm font-medium text-yellow-800 mb-1">Prerequisites</p>
                      <p className="text-sm text-yellow-700">
                        Create your professional profile with resume, LinkedIn, GitHub, and skills to unlock this section.
                      </p>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      <ProjectModal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setEditingProject(null);
        }}
        onSubmit={editingProject ? handleUpdate : handleAdd}
        data={editingProject}
        loading={false}
      />
    </>
  );
};

export default ProjectsSection;
