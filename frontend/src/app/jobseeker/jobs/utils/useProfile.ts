import { useState, useEffect } from 'react';
import { toast } from 'sonner';
import { JobSeekerAPI } from './api';
import { JobSeekerProfile } from './types';

export const useProfile = () => {
  const [profile, setProfile] = useState<JobSeekerProfile | null>(null);
  const [error, setError] = useState<string | null>(null);

  const fetchProfile = async () => {
    setError(null);
    
    try {
      const response = await JobSeekerAPI.getProfile();
      if (response.success && response.data) {
        setProfile(response.data as JobSeekerProfile);
      } else {
        setError(response.message || 'Failed to fetch profile');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch profile');
    }
  };

  useEffect(() => {
    fetchProfile();
  }, []);

  return {
    profile,
    error,
    refetch: fetchProfile,
  };
};
