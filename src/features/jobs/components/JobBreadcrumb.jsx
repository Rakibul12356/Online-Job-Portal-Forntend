import { Link } from 'react-router-dom';
import { ChevronRight } from 'lucide-react';
import { ROUTES } from '@/constants';

export function JobBreadcrumb({ job }) {
  return (
    <nav className="mb-6 flex flex-wrap items-center gap-2 text-sm text-gray-500">
      <Link to={ROUTES.HOME} className="transition-colors hover:text-gray-900">
        Jobs
      </Link>
      <ChevronRight className="h-4 w-4" />
      <Link to={ROUTES.HOME} className="transition-colors hover:text-gray-900">
        {job.category}
      </Link>
      <ChevronRight className="h-4 w-4" />
      <span className="text-gray-900">{job.title}</span>
    </nav>
  );
}

export default JobBreadcrumb;
