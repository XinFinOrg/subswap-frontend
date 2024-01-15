type NetworkSelectListProps = {
  networks: SavedNetwork[];
};

function NetworkSelectList({ networks }: NetworkSelectListProps) {
  return (
    <ul>
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
    <li className={`${selected ? "bg-light/10" : ""}`}>
      {name}
    </li>
  );
}

type SectionTitleProps = {
  title: string;
};

function SectionTitle({ title }: SectionTitleProps) {
  return <div className="text-xl font-bold text-grey-9">{title}</div>;
}

type SavedNetwork = {
  id: number;
  name: string;
};

export function SelectNetWork() {
  const networks: SavedNetwork[] = [
    { id: 1, name: 'Network1' },
    { id: 2, name: 'Network2' },
    { id: 3, name: 'Network3' },
  ];

  return (
    <div className="gap-0">
      <div className="border rounded-t-3xl border-section-border">
        <SectionTitle title="Select Network" />
        <NetworkSelectList networks={networks} />

        <div className='text-center'>or</div>
      </div>
      <div className="border rounded-b-3xl border-section-border">
        <SectionTitle title="Add new network" />
      </div>
    </div>
  );
}