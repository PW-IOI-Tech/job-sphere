import { Job } from './types';
import { JobCard } from './JobCard';

interface JobListProps {
  jobs: Job[];
  error: string | null;
}

export const JobList: React.FC<JobListProps> = ({ jobs, error }) => {
  if (error) {
    return (
      <div style={{
        textAlign: 'center',
        padding: '40px',
        color: '#dc3545',
        backgroundColor: '#f8d7da',
        borderRadius: '8px',
      }}>
        <h3>Error Loading Jobs</h3>
        <p>{error}</p>
      </div>
    );
  }

  if (jobs.length === 0) {
    return (
      <div style={{
        textAlign: 'center',
        padding: '40px',
        color: '#666',
        backgroundColor: '#f8f9fa',
        borderRadius: '8px',
      }}>
        <h3>No Jobs Found</h3>
        <p>Try adjusting your filters to see more results.</p>
      </div>
    );
  }

  return (
    <div>
      <div style={{ marginBottom: '20px', color: '#666' }}>
        Found {jobs.length} job{jobs.length !== 1 ? 's' : ''}
      </div>
      {jobs.map((job) => (
        <JobCard key={job.id} job={job} />
      ))}
    </div>
  );
};
