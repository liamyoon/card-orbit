interface Props {
  number: string;
  title: string;
  badge?: string;
}

export function SettingHeading({ number, title, badge }: Props) {
  return (
    <div className="setting-heading">
      <span className="step-number">{number}</span>
      <h3>{title}</h3>
      {badge && <span className="all-badge">{badge}</span>}
    </div>
  );
}
