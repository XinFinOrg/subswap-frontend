import { EllipseBgLeft, EllipseBgMidBottom, EllipseBgRight } from "./EllipseBg";

interface EllipseBgsProps {
  className?: string;
}

export const EllipseBgs: React.FC<EllipseBgsProps> = () => {
  return (
    <>
      <EllipseBgLeft className="-left-[279px] top-[0px]" />
      <EllipseBgMidBottom className="left-[377px] top-[648px]" />
      <EllipseBgRight className="left-[1136px] top-[416px]" />
    </>
  );
};
