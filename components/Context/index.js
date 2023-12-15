import { createContext, useContext, useState } from "react";

const GlobalContext = createContext();

export function ContextProvider({ children, state }) {
  return (
    <GlobalContext.Provider value={state}>{children}</GlobalContext.Provider>
  );
}

export function useGlobalContext() {
  return useContext(GlobalContext);
}
