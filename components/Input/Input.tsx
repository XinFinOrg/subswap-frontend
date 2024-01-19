import { ChangeEvent } from 'react';

type InputProps = {
  placeholder?: string;
  onChange: (e: ChangeEvent<HTMLInputElement>) => void;
};

export default function Input({ placeholder, onChange }: InputProps) {
  return (
    <>
      <input
        type="text"
        placeholder={placeholder}
        className="w-full rounded-full bg-grey-9/10 p-4 border border-grey-border dark:border-none"
        onChange={onChange}
      />
    </>
  );
}