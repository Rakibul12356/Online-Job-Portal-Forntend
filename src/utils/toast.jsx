import {
  toast as rtToast,
  ToastContainer as rtToastContainer,
} from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const getOptions = (options) => ({
  autoClose: 3500,
  ...options,
});

export const toast = (message, options = {}) => {
  return rtToast(message, getOptions(options));
};

toast.success = (message, options = {}) => {
  return rtToast.success(message, getOptions(options));
};

toast.error = (message, options = {}) => {
  return rtToast.error(message, getOptions(options));
};

toast.info = (message, options = {}) => {
  return rtToast.info(message, getOptions(options));
};

toast.warning = (message, options = {}) => {
  return rtToast.warn(message, getOptions(options));
};

toast.dismiss = (id) => {
  rtToast.dismiss(id);
};

export const ToastContainer = rtToastContainer;

export default toast;
