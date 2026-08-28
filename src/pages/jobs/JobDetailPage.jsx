import { useEffect, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
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
import { jobsService } from '@/services';
import { ROUTES } from '@/constants';
import { LoadingSpinner } from '@/components';
import { useAuth } from '@/context';
import { checkCanApplyJob } from '@/utils';

export function JobDetailPage() {
  const { jobId } = useParams();
  const navigate = useNavigate();
  const { user, isAuthenticated } = useAuth();
  const [job, setJob] = useState(null);
  const [similarJobs, setSimilarJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [applyJob, setApplyJob] = useState(null);

  const handleApply = (jobToApply) => {
    if (checkCanApplyJob({ user, isAuthenticated, navigate })) {
      setApplyJob(jobToApply);
    }
  };


  useEffect(() => {
    async function loadJobDetails() {
      setLoading(true);
      setError(null);
      try {
        const [jobRes, similarRes] = await Promise.all([
          jobsService.getJobDetails(jobId),
          jobsService.getSimilarJobs(jobId).catch((err) => {
            console.error('Failed to fetch similar jobs:', err);
            return { success: true, data: [] };
          }),
        ]);

        if (jobRes.success && jobRes.data) {
          setJob(jobRes.data);
        } else {
          setError('Job not found');
        }

        if (similarRes.success && similarRes.data) {
          setSimilarJobs(similarRes.data);
        }
      } catch (err) {
        console.error('Error fetching job details:', err);
        setError(err.message || 'Error loading job details');
      } finally {
        setLoading(false);
      }
    }

    if (jobId) {
      loadJobDetails();
    }
  }, [jobId]);

  if (loading) {
    return (
      <div className="flex min-h-[50vh] items-center justify-center">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  if (error || !job) {
    return (
      <section className="py-16 text-center">
        <h1 className="text-2xl font-bold">Job Not Found</h1>
        <p className="mt-2 text-gray-500">
          {error || 'The job you are looking for does not exist or has been removed.'}
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

  return (
    <>
      <JobBreadcrumb job={job} />

      <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
        <div className="space-y-6 lg:col-span-2">
          <JobDetailHeader job={job} />
          <JobOverview job={job} />
          <JobDescriptionSection job={job} />
          <JobSkillsSection skills={job.skills || []} />
          {similarJobs.length > 0 && <SimilarJobs jobs={similarJobs} />}
        </div>

        <div className="lg:col-span-1">
          <JobDetailSidebar job={job} onApply={handleApply} />
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

