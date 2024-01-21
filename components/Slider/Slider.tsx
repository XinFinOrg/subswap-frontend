interface SliderProps {
  min: number;
  max: number;
  value: number | undefined;
  onChange: (value: number) => void;
}

export default function Slider({ min, max, value = 0, onChange }: SliderProps) {
  const handleSliderChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = Number(event.target.value);
    onChange(value);
  };

  const fillPercentage = ((value - min) / (Number(max) - Number(min))) * 100;

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
