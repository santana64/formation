interface Props {
  done: number;
  total: number;
  label?: string;
}

export default function ProgressBar({ done, total, label }: Props) {
  const pct = total ? Math.round((done / total) * 100) : 0;
  return (
    <div className="progressbar">
      {label && <span className="progressbar__label">{label}</span>}
      <div
        className="progressbar__track"
        role="progressbar"
        aria-valuenow={pct}
        aria-valuemin={0}
        aria-valuemax={100}
        aria-label={label ?? 'Progression'}
      >
        <div className="progressbar__fill" style={{ width: `${pct}%` }} />
      </div>
      <span className="progressbar__value mono">
        {done}/{total} · {pct} %
      </span>
    </div>
  );
}
