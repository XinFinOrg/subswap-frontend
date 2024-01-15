import Image from 'next/image';

export function NetWorkSelect() {
  // TODO: networks that saved in local storage
  const savedNetworks: SavedNetwork[] = [
    { id: 1, name: 'Network1' },
    { id: 2, name: 'Network2' },
    { id: 3, name: 'Network3' },
  ];

  return (
    <div className="gap-0">
      <div className="border rounded-t-3xl border-section-border">
        <div className='px-4 pt-8 pb-4'>
          <SectionTitle title="Select Network" className='pl-3' />
          <NetworkSelectList networks={savedNetworks} className="mt-6" />

          <div className='text-center text-grey-9 pt-4'>or</div>
        </div>
      </div>
      <div className="border rounded-b-3xl border-section-border">
        <div className='px-4 pt-8 pb-4'>
          <SectionTitle title="Add new network" className='pl-3' />
        </div>
      </div>
    </div>
  );
}

type NetworkSelectListProps = {
  networks: SavedNetwork[];
  className?: string;
};

function NetworkSelectList({ networks, className }: NetworkSelectListProps) {
  return (
    <ul className={`${className ? className : ""} rounded-3xl bg-light/10 h-[180px] overflow-y-auto`}>
      {networks.map((network, i) => (
        <NetworkSelectItem key={i} name={network.name} />
      ))}
    </ul>
  );
}

type NetworkSelectItemProps = {
  name: string;
  selected?: boolean;
};

function NetworkSelectItem({ name, selected }: NetworkSelectItemProps) {
  return (
    <li className={`${selected ? "bg-light/10" : ""} flex py-4 px-4`}>
      <Image src="/coin.svg" width="24" height="24" alt="Coin icon" />
      <div className='pl-2 text-xl font-bold text-grey-9'>{name}</div>
    </li>
  );
}

type SectionTitleProps = {
  title: string;
  className?: string;
};

function SectionTitle({ title, className }: SectionTitleProps) {
  return <div className={`${className ? className : ""} text-xl font-bold text-grey-9`}>{title}</div>;
}

type SavedNetwork = {
  id: number;
  name: string;
};
