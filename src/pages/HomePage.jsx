import { useState } from 'react';
import {
  ApplyJobDialog,
  HeroSection,
  JobCard,
  JobSearchSection,
  JobsResultsHeader,
} from '@/features/jobs/components';
import { mockJobs } from '@/features/jobs/data/mockJobs';

export function HomePage() {
  const [applyJob, setApplyJob] = useState(null);

  return (
    <>
      <HeroSection />
      <JobSearchSection />
      <JobsResultsHeader total={1247} />
      <div className="grid gap-4 md:gap-6">
        {mockJobs.map((job) => (
          <JobCard key={job.id} job={job} onApply={setApplyJob} />
        ))}
      </div>

      <ApplyJobDialog
        isOpen={Boolean(applyJob)}
        job={applyJob}
        onClose={() => setApplyJob(null)}
      />
    </>
  );
}

export default HomePage;
