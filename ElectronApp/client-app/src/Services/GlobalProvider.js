import React, { createContext, useReducer } from 'react';
import appReducer, { initialState } from './ContextStateManagement/Reducer/reducer'; // Ensure this path is correct

export const GlobalContext = createContext();

export const GlobalProvider = ({ children }) => {
  const [state, dispatch] = useReducer(appReducer, initialState);

  return (
    <GlobalContext.Provider value={{ state, dispatch }}>
      {children}
    </GlobalContext.Provider>
  );
};

