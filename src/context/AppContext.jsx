import { createContext, useContext, useMemo, useReducer } from 'react';

const AppContext = createContext(null);

const initialState = {
  sidebarOpen: true,
};

function appReducer(state, action) {
  switch (action.type) {
    case 'TOGGLE_SIDEBAR':
      return { ...state, sidebarOpen: !state.sidebarOpen };
    default:
      return state;
  }
}

export function AppContextProvider({ children }) {
  const [state, dispatch] = useReducer(appReducer, initialState);

  const value = useMemo(
    () => ({
      state,
      dispatch,
      toggleSidebar: () => dispatch({ type: 'TOGGLE_SIDEBAR' }),
    }),
    [state],
  );

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}

export function useAppContext() {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useAppContext must be used within AppContextProvider');
  }
  return context;
}

export default AppContext;
