const DEFAULT_LOADING_MESSAGE = 'Loading...';
const SERVER_SNAPSHOT = Object.freeze({ isLoading: false, message: '' });

let nextRequestId = 0;
const activeRequests = new Map();
const listeners = new Set();
let currentSnapshot = SERVER_SNAPSHOT;

const notifyListeners = () => {
  listeners.forEach((listener) => listener());
};

const getLatestMessage = () => {
  if (activeRequests.size === 0) {
    return '';
  }

  let latestMessage = DEFAULT_LOADING_MESSAGE;
  activeRequests.forEach((message) => {
    latestMessage = message || DEFAULT_LOADING_MESSAGE;
  });

  return latestMessage;
};

const refreshSnapshot = () => {
  const nextSnapshot = {
    isLoading: activeRequests.size > 0,
    message: activeRequests.size > 0 ? getLatestMessage() : '',
  };

  if (
    currentSnapshot.isLoading === nextSnapshot.isLoading &&
    currentSnapshot.message === nextSnapshot.message
  ) {
    return false;
  }

  currentSnapshot = nextSnapshot;
  return true;
};

const getSnapshot = () => currentSnapshot;

const subscribe = (listener) => {
  listeners.add(listener);
  return () => {
    listeners.delete(listener);
  };
};

const start = (message = DEFAULT_LOADING_MESSAGE) => {
  nextRequestId += 1;
  const requestId = nextRequestId;
  activeRequests.set(requestId, message || DEFAULT_LOADING_MESSAGE);
  if (refreshSnapshot()) {
    notifyListeners();
  }
  return requestId;
};

const stop = (requestId) => {
  if (typeof requestId === 'number') {
    const didDelete = activeRequests.delete(requestId);
    if (didDelete && refreshSnapshot()) {
      notifyListeners();
    }
    return;
  }

  if (activeRequests.size > 0) {
    const firstKey = activeRequests.keys().next().value;
    activeRequests.delete(firstKey);
    if (refreshSnapshot()) {
      notifyListeners();
    }
  }
};

export const appLoadingManager = {
  subscribe,
  getSnapshot,
  getServerSnapshot: () => SERVER_SNAPSHOT,
  start,
  stop,
};

export const withAppLoader = async (task, options = {}) => {
  const { enabled = true, message = DEFAULT_LOADING_MESSAGE } = options;

  if (!enabled) {
    return task();
  }

  const requestId = appLoadingManager.start(message);

  try {
    return await task();
  } finally {
    appLoadingManager.stop(requestId);
  }
};
