import { useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import {
  ApplyJobDialog,
  JobBreadcrumb,
  JobDescriptionSection,
  JobDetailHeader,
  JobDetailSidebar,
  JobOverview,
  JobSkillsSection,
  SimilarJobs,
} from '@/features/jobs/components';
import { getJobById, getSimilarJobs } from '@/features/jobs/data/mockJobs';
import { ROUTES } from '@/constants';

export function JobDetailPage() {
  const { jobId } = useParams();
  const job = getJobById(jobId);
  const [applyJob, setApplyJob] = useState(null);

  if (!job) {
    return (
      <section className="py-16 text-center">
        <h1 className="text-2xl font-bold">Job Not Found</h1>
        <p className="mt-2 text-gray-500">
          The job you are looking for does not exist or has been removed.
        </p>
        <Link
          to={ROUTES.HOME}
          className="mt-6 inline-block text-sm font-medium text-slate-900 hover:underline"
        >
          Back to Jobs
        </Link>
      </section>
    );
  }

  const similarJobs = getSimilarJobs(job.id);

  return (
    <>
      <JobBreadcrumb job={job} />

      <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
        <div className="space-y-6 lg:col-span-2">
          <JobDetailHeader job={job} />
          <JobOverview job={job} />
          <JobDescriptionSection job={job} />
          <JobSkillsSection skills={job.skills} />
          <SimilarJobs jobs={similarJobs} />
        </div>

        <div className="lg:col-span-1">
          <JobDetailSidebar job={job} onApply={setApplyJob} />
        </div>
      </div>

      <ApplyJobDialog
        isOpen={Boolean(applyJob)}
        job={applyJob}
        onClose={() => setApplyJob(null)}
      />
    </>
  );
}

export default JobDetailPage;
