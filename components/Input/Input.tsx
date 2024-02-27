import { ChangeEvent } from 'react';

type InputProps = {
  onChange: (e: ChangeEvent<HTMLInputElement>) => void;
  value?: string;
  placeholder?: string;
};

export default function Input({ placeholder, value, onChange }: InputProps) {
  return (
    <>
      <input
        type="text"
        value={value}
        placeholder={placeholder}
        className="w-full rounded-full bg-grey-9/10 p-4 border border-grey-border dark:border-none"
        onChange={onChange}
      />
    </>
  );
}