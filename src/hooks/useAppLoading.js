import { useSyncExternalStore } from 'react';
import { appLoadingManager } from '../services/loadingManager';

export const useAppLoading = () => {
  return useSyncExternalStore(
    appLoadingManager.subscribe,
    appLoadingManager.getSnapshot,
    appLoadingManager.getServerSnapshot
  );
};

export default useAppLoading;

