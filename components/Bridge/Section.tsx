import { PropsWithChildren } from 'react';

type SectionProps = PropsWithChildren & {
  className?: string;
};

export function Section({ className, children }: SectionProps) {
  return (
    <div className={`${className ? className : ""} flex border p-4 border-section-border rounded-3xl items-center`}>
      {children}
    </div>
  );
}