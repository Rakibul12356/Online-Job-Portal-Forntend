import { Link } from 'react-router-dom';
import { ROUTES } from '@/constants';

const jobSeekerLinks = [
  { label: 'Browse Jobs', to: ROUTES.HOME },
  { label: 'Companies', to: ROUTES.COMPANIES },
  { label: 'Career Advice', to: '#' },
  { label: 'Salary Guide', to: '#' },
];

const employerLinks = [
  { label: 'Post a Job', to: '#' },
  { label: 'Browse Candidates', to: '#' },
  { label: 'Pricing', to: '#' },
  { label: 'Hiring Resources', to: '#' },
];

const companyLinks = [
  { label: 'About Us', to: '#' },
  { label: 'Contact', to: '#' },
  { label: 'Privacy Policy', to: '#' },
  { label: 'Terms of Service', to: '#' },
];

function FooterLink({ to, label }) {
  const className =
    'transition-colors hover:text-gray-900';

  if (to === '#') {
    return (
      <a href="#" className={className}>
        {label}
      </a>
    );
  }

  return (
    <Link to={to} className={className}>
      {label}
    </Link>
  );
}

export function Footer() {
  return (
    <footer className="mt-16 border-t border-gray-200 bg-gray-50/50">
      <div className="container mx-auto px-4 py-12 md:px-8">
        <div className="grid grid-cols-1 gap-8 md:grid-cols-4">
          <div>
            <h3 className="mb-4 font-semibold">Online Job Portal</h3>
            <p className="text-sm text-gray-500">
              Your trusted platform for finding the perfect job or the perfect
              candidate.
            </p>
          </div>

          <div>
            <h4 className="mb-4 font-semibold">For Job Seekers</h4>
            <ul className="space-y-2 text-sm text-gray-500">
              {jobSeekerLinks.map(({ label, to }) => (
                <li key={label}>
                  <FooterLink to={to} label={label} />
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="mb-4 font-semibold">For Employers</h4>
            <ul className="space-y-2 text-sm text-gray-500">
              {employerLinks.map(({ label, to }) => (
                <li key={label}>
                  <FooterLink to={to} label={label} />
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="mb-4 font-semibold">Company</h4>
            <ul className="space-y-2 text-sm text-gray-500">
              {companyLinks.map(({ label, to }) => (
                <li key={label}>
                  <FooterLink to={to} label={label} />
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="mt-8 border-t border-gray-200 pt-8 text-center text-sm text-gray-500">
          <p>&copy; 2025 Online Job Portal. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
