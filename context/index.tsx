import { createContext, useContext } from "react";

const GlobalContext = createContext<any>({});

export function ContextProvider({ children, state }: any) {
  return (
    <GlobalContext.Provider value={state}>{children}</GlobalContext.Provider>
  );
}

export function useGlobalContext() {
  return useContext(GlobalContext);
}
