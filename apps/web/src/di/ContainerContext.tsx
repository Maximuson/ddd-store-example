import { createContext, useContext, ReactNode } from 'react';
import { container, Container } from './container';

const ContainerContext = createContext<Container>(container);

export function ContainerProvider({ children }: { children: ReactNode }) {
  return <ContainerContext.Provider value={container}>{children}</ContainerContext.Provider>;
}

export function useContainer(): Container {
  return useContext(ContainerContext);
}
