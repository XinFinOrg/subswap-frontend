interface EllipseBgProps {
  className?: string;
}

export const EllipseBgLeft: React.FC<EllipseBgProps> = ({ className }) => {
  return (
    <div
      className={`${className} -z-10 absolute h-[752px] w-[752px] shrink-0 rounded-[752px] bg-[#0050FF] blur-[1200px] dark:bg-primary`}
    ></div>
  );
};

export const EllipseBgMidBottom: React.FC<EllipseBgProps> = ({ className }) => {
  return (
    <div
      className={`${className} -z-10 absolute h-[686px] w-[686px] shrink-0 rounded-[686px] bg-[#00FFFF] blur-[1200px] dark:bg-[#00FFFF]`}
    ></div>
  );
};

export const EllipseBgRight: React.FC<EllipseBgProps> = ({ className }) => {
  return (
    <div
      className={`${className} -z-10 absolute h-[608px] w-[608px] shrink-0 rounded-[608px] bg-[#FF00CF]/75 blur-[1200px] dark:bg-[#FF00CF]`}
    ></div>
  );
};
