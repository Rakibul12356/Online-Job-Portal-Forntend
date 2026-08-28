// Helper function to safely get the Swal instance
export function getSwal() {
  if (typeof window !== 'undefined' && window.Swal) {
    return window.Swal;
  }
  return null;
}

/**
 * Show SweetAlert2 dialog prompting unauthenticated users to log in
 * @param {Function} navigate - React Router navigate function
 * @param {string} [redirectPath='/signin'] - Path to redirect to on confirmation
 */
export async function showLoginRequiredAlert(navigate, redirectPath = '/signin') {
  const Swal = getSwal();
  if (!Swal) {
    alert('Please log in as a Job Seeker to apply for this job.');
    if (navigate) navigate(redirectPath);
    return;
  }

  const result = await Swal.fire({
    title: 'Login Required',
    text: 'You must be logged in as a Job Seeker to apply for this job.',
    icon: 'warning',
    showCancelButton: true,
    confirmButtonText: 'Login Now',
    cancelButtonText: 'Cancel',
    confirmButtonColor: '#0f172a',
    cancelButtonColor: '#64748b',
    reverseButtons: true,
    customClass: {
      popup: 'swal2-border-radius',
    },
  });

  if (result.isConfirmed && navigate) {
    navigate(redirectPath);
  }
}

/**
 * Show SweetAlert2 dialog alerting company accounts that they cannot apply
 */
export async function showCompanyCannotApplyAlert() {
  const Swal = getSwal();
  if (!Swal) {
    alert('Company accounts cannot apply for jobs. Only Job Seekers can apply.');
    return;
  }

  await Swal.fire({
    title: 'Application Restricted',
    text: 'Company and Employer accounts cannot apply for jobs. Only Job Seeker accounts can submit applications.',
    icon: 'error',
    confirmButtonText: 'OK',
    confirmButtonColor: '#0f172a',
    customClass: {
      popup: 'swal2-border-radius',
    },
  });
}

/**
 * Check if the user is authorized to apply for a job.
 * Shows appropriate SweetAlert2 popups if unauthorized.
 *
 * @param {Object} params
 * @param {Object|null} params.user - Current user object
 * @param {boolean} params.isAuthenticated - Authentication state
 * @param {Function} [params.navigate] - React router navigate function
 * @returns {boolean} true if permitted to apply, false otherwise
 */
export function checkCanApplyJob({ user, isAuthenticated, navigate }) {
  if (!isAuthenticated || !user) {
    showLoginRequiredAlert(navigate);
    return false;
  }

  if (user?.role === 'company') {
    showCompanyCannotApplyAlert();
    return false;
  }

  return true;
}
