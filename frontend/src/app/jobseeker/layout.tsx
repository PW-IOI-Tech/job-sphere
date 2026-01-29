'use client';
import Link from 'next/link';
import { ReactNode, useState } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { useAuth } from '../contexts/AuthContext';
import { toast } from 'sonner';
import {
  HomeIcon,
  BriefcaseIcon,
  BuildingOfficeIcon,
  UserIcon,
  ArrowLeftIcon,
  ClockIcon
} from '@heroicons/react/24/outline';

const navItems = [
  { label: 'Dashboard', href: '/jobseeker', icon: HomeIcon },
  { label: 'Jobs', href: '/jobseeker/jobs', icon: BriefcaseIcon },
  { label: 'History', href: '/jobseeker/history', icon: ClockIcon },
  { label: 'Companies', href: '/jobseeker/companies', icon: BuildingOfficeIcon },
  { label: 'Profile', href: '/jobseeker/profile', icon: UserIcon },
];

export default function EmployerLayout({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const { logout } = useAuth();

  const [showModal, setShowModal] = useState(false);
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  const handleLogout = async () => {
    try {
      setIsLoggingOut(true);
      await logout();
      router.push('/');
      toast.success('Logged out successfully!');
    } catch (error) {
      console.error('Logout error:', error);
      toast.error('Failed to logout.');
    } finally {
      setIsLoggingOut(false);
      setShowModal(false);
    }
  };

  return (
    <div className="flex min-h-screen bg-blue-500 font-sans">
      {/* Sidebar */}
      <aside className="fixed top-0 left-0 h-screen w-56 flex flex-col bg-blue-600 text-white z-20">
        {/* Logo */}
        <div className="py-8 px-6 text-center border-b border-white/10">
          <h1 className="text-2xl font-extrabold tracking-wide select-none">JobSphere</h1>
          <p className="text-xs font-light text-white mt-1 select-none">Hiring Platform</p>
        </div>

        {/* Navigation */}
        <nav className="flex-1 px-2 py-6 space-y-1">
          {navItems.map(({ label, href, icon: Icon }) => {
            const isActive = pathname === href || (href === '/employer' && pathname === '/employer/');
            return (
              <Link
                key={label}
                href={href}
                className={`group flex items-center rounded-md px-4 py-3 text-sm font-medium select-none
                  ${isActive ? 'bg-blue-600 text-white' : 'hover:bg-blue-400 text-white'}
                `}
              >
                <Icon
                  className={`mr-3 h-6 w-6 ${isActive ? 'text-white' : 'text-white group-hover:text-white'}`}
                  aria-hidden="true"
                />
                <span>{label}</span>
              </Link>
            );
          })}
        </nav>

        {/* Sign Out Link - bottom */}
        <div className="px-6 pb-6 mt-auto select-none">
          <button
            type="button"
            className="flex w-full items-center justify-center gap-2 rounded-md bg-red-600 px-3 py-2 font-semibold text-white hover:bg-red-700 active:bg-red-400 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-600"
            onClick={() => setShowModal(true)}
          >
            <ArrowLeftIcon className="h-5 w-5" aria-hidden="true" />
            Logout
          </button>
        </div>
      </aside>

      {/* Main content */}
      <main className="ml-56 flex-1">{children}</main>

      {/* Confirmation Modal */}
      {showModal && (
        <div className="fixed inset-0 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-lg p-6 w-80">
            {isLoggingOut ? (
              <div className="flex flex-col items-center justify-center">
                <svg
                  className="animate-spin h-8 w-8 text-green-600 mb-3"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  />
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8v4l3-3-3-3v4a12 12 0 100 24v-4l-3 3 3 3v-4a8 8 0 01-8-8z"
                  />
                </svg>
                <p className="text-gray-700 font-medium">Logging out...</p>
              </div>
            ) : (
              <>
                <h2 className="text-lg font-semibold text-gray-800">Confirm Logout</h2>
                <p className="text-sm text-gray-600 mt-2">Are you sure you want to log out?</p>
                <div className="flex justify-end gap-3 mt-6">
                  <button
                    className="px-4 py-2 bg-gray-200 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-300"
                    onClick={() => setShowModal(false)}
                  >
                    Cancel
                  </button>
                  <button
                    className="px-4 py-2 bg-red-600 text-white rounded-md text-sm font-medium hover:bg-red-700"
                    onClick={handleLogout}
                  >
                    Logout
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
