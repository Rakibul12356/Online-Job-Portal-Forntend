import { useCallback, useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  ApplyJobDialog,
  HeroSection,
  JobCard,
  JobSearchSection,
  JobsResultsHeader,
} from '@/features/jobs/components';
import { jobsService } from '@/services';
import { LoadingSpinner } from '@/components';
import { useAuth } from '@/context';
import { animateHero, animateStaggerCards, checkCanApplyJob } from '@/utils';

export function HomePage() {
  const containerRef = useRef(null);
  const navigate = useNavigate();
  const { user, isAuthenticated } = useAuth();
  const [applyJob, setApplyJob] = useState(null);
  const [jobs, setJobs] = useState([]);


  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [total, setTotal] = useState(0);

  const [searchQuery, setSearchQuery] = useState('');
  const [filters, setFilters] = useState({
    jobType: [],
    experienceLevel: [],
    salaryRange: [],
    skills: [],
  });

  const fetchJobs = useCallback(async (queryStr, currentFilters) => {
    setLoading(true);
    setError(null);
    try {
      const params = {
        q: queryStr || undefined,
        limit: 20,
      };

      if (currentFilters.jobType?.length > 0) {
        params.jobType = currentFilters.jobType.map((t) => t.toLowerCase());
      }

      if (currentFilters.experienceLevel?.length > 0) {
        params.experienceLevel = currentFilters.experienceLevel.map((lvl) => {
          if (lvl.includes('Entry')) return 'entry';
          if (lvl.includes('Mid')) return 'mid';
          if (lvl.includes('Senior')) return 'senior';
          if (lvl.includes('Lead')) return 'lead';
          return lvl.toLowerCase();
        });
      }

      if (currentFilters.salaryRange?.length > 0) {
        const mins = [];
        const maxs = [];
        currentFilters.salaryRange.forEach((range) => {
          if (range.includes('150k+')) {
            mins.push(150000);
          } else if (range.includes('100k - $150k')) {
            mins.push(100000);
            maxs.push(150000);
          } else if (range.includes('50k - $100k')) {
            mins.push(50000);
            maxs.push(100000);
          } else if (range.includes('0 - $50k')) {
            mins.push(0);
            maxs.push(50000);
          }
        });
        if (mins.length > 0) params.salaryMin = Math.min(...mins);
        if (maxs.length > 0) params.salaryMax = Math.max(...maxs);
      }

      if (currentFilters.skills?.length > 0) {
        const skillTerms = currentFilters.skills.join(' ');
        params.q = params.q ? `${params.q} ${skillTerms}` : skillTerms;
      }

      const response = await jobsService.listJobs(params);
      if (response.success && response.data) {
        setJobs(response.data.items || []);
        setTotal(
          response.data.pagination?.total ??
            response.data.items?.length ??
            0,
        );
      } else {
        setError('Failed to fetch jobs');
      }
    } catch (err) {
      console.error('Error loading jobs:', err);
      setError(err.message || 'Error fetching jobs from server');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchJobs(searchQuery, filters);
  }, [searchQuery, filters, fetchJobs]);

  useEffect(() => {
    const revert = animateHero(containerRef.current);
    return () => revert?.();
  }, []);

  useEffect(() => {
    if (!loading && jobs.length > 0) {
      animateStaggerCards('.job-card-item');
    }
  }, [jobs, loading]);

  function handleSearch(query, updatedFilters) {
    setSearchQuery(query);
    setFilters(updatedFilters);
  }

  const handleApply = (job) => {
    if (checkCanApplyJob({ user, isAuthenticated, navigate })) {
      setApplyJob(job);
    }
  };

  return (
    <div ref={containerRef}>
      <HeroSection />
      <JobSearchSection
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        filters={filters}
        setFilters={setFilters}
        onSearch={handleSearch}
      />
      <JobsResultsHeader total={total} />

      {error && (
        <div className="mb-6 rounded-lg bg-red-50 p-4 text-center text-red-600">
          {error}
        </div>
      )}

      {loading ? (
        <div className="flex justify-center py-12">
          <LoadingSpinner size="lg" />
        </div>
      ) : jobs.length === 0 ? (
        <div className="rounded-lg border border-dashed border-gray-300 py-16 text-center">
          <p className="text-gray-500">No jobs found matching your criteria.</p>
        </div>
      ) : (
        <div className="grid gap-4 md:gap-6">
          {jobs.map((job) => (
            <JobCard key={job.id} job={job} onApply={handleApply} />
          ))}
        </div>
      )}

      <ApplyJobDialog
        isOpen={Boolean(applyJob)}
        job={applyJob}
        onClose={() => setApplyJob(null)}
      />
    </div>
  );
}

export default HomePage;

