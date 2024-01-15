import { useState, useEffect } from 'react';

interface SliderProps {
  min: number;
  max: number;
  onChange: (value: number) => void;
}

export default function Slider({ min, max, onChange }: SliderProps) {
  const [value, setValue] = useState<number>(min);

  const handleSliderChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = Number(event.target.value);

    setValue(value);
    onChange(value);
  };

  const fillPercentage = ((value - min) / (max - min)) * 100;

  return (
    <div className="flex items-center">
      <input
        type="range"
        min={min}
        max={max}
        value={value}
        onChange={handleSliderChange}
        className="slider"
        style={{
          background: `linear-gradient(to right, #4E80EE ${fillPercentage}%, #ddd 0%)`
        }}
      />
    </div>
  );
};