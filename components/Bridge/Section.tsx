import { PropsWithChildren } from 'react';

export function Section({ children }: PropsWithChildren) {
  return (
    <div className="flex border p-4 border-section-border rounded-3xl items-center">
      {children}
    </div>
  );
}