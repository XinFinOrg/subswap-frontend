type SpinnerProps = {
  text?: string;
  textSize?: 'xs' | 'md' | 'lg';
};

const textSizeMap = {
  xs: 'text-xs',
  md: 'text-md',
  lg: 'text-lg',
};


export default function Spinner({ text = 'Loading', textSize = 'xs' }: SpinnerProps) {
  const textSizeClass = textSizeMap[textSize];

  return (
    <div className='absolute top-0 left-0 right-0 bottom-0 w-full h-full flex items-center justify-center z-10'>
      <div className="flex justify-center items-center relative h-20 w-20">
        {/* Absolute centered text */}
        <div className="absolute flex justify-center items-center">
          <div className={`text-black dark:text-white ${textSizeClass}`}>{text}</div>
        </div>

        {/* Spinner */}
        <div className="animate-spin rounded-full h-20 w-20 border-b-2 border-t-2 border-gray-400" />
      </div>
    </div>
  );
}