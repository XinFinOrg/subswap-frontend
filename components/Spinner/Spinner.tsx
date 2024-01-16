type SpinnerProps = {
  text?: string;
};


export default function Spinner({ text = 'Loading' }: SpinnerProps) {
  return (
    <div className='absolute top-0 left-0 right-0 bottom-0 w-full h-full flex items-center justify-center'>
      <div className="flex justify-center items-center relative h-20 w-20">
        {/* Absolute centered text */}
        <div className="absolute flex justify-center items-center">
          <div className="text-white text-xs">{text}</div>
        </div>

        {/* Spinner */}
        <div className="animate-spin rounded-full h-20 w-20 border-b-2 border-t-2">
        </div>
      </div>
    </div>
  );
}