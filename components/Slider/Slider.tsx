import { useState, useEffect } from 'react';

interface SliderProps {
  min: number;
  max: number;
  onChange: (value: number) => void;
}

export default function Slider({ min, max, onChange }: SliderProps) {
  const [value, setValue] = useState<number>(min);

  useEffect(() => {
    onChange(value);
  }, [value, onChange]);

  const handleSliderChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setValue(Number(event.target.value));
  };

  return (
    <div className="flex items-center">
      <input
        type="range"
        min={min}
        max={max}
        value={value}
        onChange={handleSliderChange}
        className="slider-thumb w-full h-2 rounded-full cursor-pointer accent-primary"
      />
      <div className="ml-2 text-sm">{value}</div>
    </div>
  );
};
