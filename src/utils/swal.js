import Swal from 'sweetalert2';

export function getSwal() {
  return Swal;
}

/**
 * Show a sleek SweetAlert2 confirmation dialog
 * @param {Object} options
 * @param {string} options.title
 * @param {string} options.text
 * @param {string} [options.confirmButtonText='Yes, Proceed']
 * @param {string} [options.cancelButtonText='Cancel']
 * @param {string} [options.icon='warning'] - 'warning' | 'error' | 'question' | 'info' | 'success'
 * @param {boolean} [options.isDanger=false]
 * @returns {Promise<boolean>} Resolves to true if confirmed, false otherwise
 */
export async function showConfirmDialog({
  title = 'Are you sure?',
  text = '',
  confirmButtonText = 'Yes, Proceed',
  cancelButtonText = 'Cancel',
  icon = 'warning',
  isDanger = false,
}) {
  const Swal = getSwal();
  if (!Swal) {
    return window.confirm(text || title);
  }

  const result = await Swal.fire({
    title,
    text,
    icon,
    showCancelButton: true,
    confirmButtonText,
    cancelButtonText,
    confirmButtonColor: isDanger ? '#e11d48' : '#0f172a',
    cancelButtonColor: '#64748b',
    reverseButtons: true,
    focusCancel: isDanger,
    customClass: {
      popup: 'rounded-2xl shadow-2xl',
      title: 'text-xl font-bold text-gray-900',
      htmlContainer: 'text-sm text-gray-600',
      confirmButton: 'rounded-xl px-5 py-2.5 font-semibold text-sm shadow-sm',
      cancelButton: 'rounded-xl px-5 py-2.5 font-semibold text-sm',
    },
  });

  return result.isConfirmed;
}

/**
 * Show SweetAlert2 error modal
 * @param {string} title
 * @param {string} [text='']
 */
export async function showErrorAlert(title = 'Error', text = '') {
  const Swal = getSwal();
  if (!Swal) {
    alert(text ? `${title}: ${text}` : title);
    return;
  }

  await Swal.fire({
    title,
    text,
    icon: 'error',
    confirmButtonText: 'OK',
    confirmButtonColor: '#0f172a',
    customClass: {
      popup: 'rounded-2xl shadow-2xl',
      title: 'text-xl font-bold text-gray-900',
      htmlContainer: 'text-sm text-gray-600',
      confirmButton: 'rounded-xl px-5 py-2.5 font-semibold text-sm',
    },
  });
}

/**
 * Show SweetAlert2 info or warning modal
 * @param {string} title
 * @param {string} [text='']
 */
export async function showWarningAlert(title = 'Notice', text = '') {
  const Swal = getSwal();
  if (!Swal) {
    alert(text ? `${title}: ${text}` : title);
    return;
  }

  await Swal.fire({
    title,
    text,
    icon: 'warning',
    confirmButtonText: 'Understood',
    confirmButtonColor: '#0f172a',
    customClass: {
      popup: 'rounded-2xl shadow-2xl',
      title: 'text-xl font-bold text-gray-900',
      htmlContainer: 'text-sm text-gray-600',
      confirmButton: 'rounded-xl px-5 py-2.5 font-semibold text-sm',
    },
  });
}

/**
 * Show SweetAlert2 dialog prompting unauthenticated users to log in
 * @param {Function} navigate - React Router navigate function
 * @param {string} [redirectPath='/sign-in'] - Path to redirect to on confirmation
 */
export async function showLoginRequiredAlert(
  navigate,
  redirectPath = '/sign-in',
) {
  const Swal = getSwal();
  if (!Swal) {
    const ok = window.confirm(
      'Please log in as a Job Seeker to apply for this job. Go to login?',
    );
    if (ok && navigate) navigate(redirectPath);
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
      popup: 'rounded-2xl shadow-2xl',
      title: 'text-xl font-bold text-gray-900',
      htmlContainer: 'text-sm text-gray-600',
      confirmButton: 'rounded-xl px-5 py-2.5 font-semibold text-sm',
      cancelButton: 'rounded-xl px-5 py-2.5 font-semibold text-sm',
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
    alert(
      'Company and Employer accounts cannot apply for jobs. Only Job Seeker accounts can submit applications.',
    );
    return;
  }

  await Swal.fire({
    title: 'Application Restricted',
    text: 'Company and Employer accounts cannot apply for jobs. Only Job Seeker accounts can submit applications.',
    icon: 'error',
    confirmButtonText: 'Understood',
    confirmButtonColor: '#0f172a',
    customClass: {
      popup: 'rounded-2xl shadow-2xl',
      title: 'text-xl font-bold text-gray-900',
      htmlContainer: 'text-sm text-gray-600',
      confirmButton: 'rounded-xl px-5 py-2.5 font-semibold text-sm',
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
