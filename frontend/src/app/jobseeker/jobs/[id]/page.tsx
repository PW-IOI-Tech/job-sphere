'use client';

import { useParams } from 'next/navigation';
import { JobDetail } from '../utils/JobDetails';

export default function JobDetailPage() {
  const params = useParams();
  const id = params?.id;

  if (!id || typeof id !== 'string') {
    return <div>Loading...</div>;
  }

  return <JobDetail jobId={id} />;
}
