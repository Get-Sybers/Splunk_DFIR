import { createContext } from 'react';
import Toaster, { makeCreateToast } from '@splunk/react-toast-notifications/Toaster';

const createToast = makeCreateToast(Toaster);
export const ToastContext = createContext(createToast);
