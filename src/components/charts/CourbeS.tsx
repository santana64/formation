/**
 * Courbe en S : répartition cumulée du budget prévu dans le temps.
 * Les valeurs sont illustratives et servent à faire comprendre la forme —
 * lente au démarrage, rapide au milieu, lente en fin.
 */
export default function CourbeS() {
  const points = [
    { mois: 0, pct: 0 },
    { mois: 1, pct: 3 },
    { mois: 2, pct: 9 },
    { mois: 3, pct: 20 },
    { mois: 4, pct: 36 },
    { mois: 5, pct: 54 },
    { mois: 6, pct: 70 },
    { mois: 7, pct: 83 },
    { mois: 8, pct: 92 },
    { mois: 9, pct: 97 },
    { mois: 10, pct: 100 },
  ];

  const x = (mois: number) => 60 + (mois / 10) * 520;
  const y = (pct: number) => 250 - (pct / 100) * 200;

  const line = points.map((p, i) => `${i === 0 ? 'M' : 'L'} ${x(p.mois)} ${y(p.pct)}`).join(' ');
  const area = `${line} L ${x(10)} ${y(0)} L ${x(0)} ${y(0)} Z`;

  return (
    <svg viewBox="0 0 620 300" role="img" className="chart" aria-labelledby="courbe-s-desc">
      <desc id="courbe-s-desc">
        Courbe cumulée du budget prévu sur dix mois : la consommation est lente les deux premiers mois (moins de
        10 %), s’accélère fortement entre le troisième et le septième mois pour atteindre 83 %, puis ralentit
        jusqu’à 100 % au dixième mois. Cette forme en S est caractéristique des projets.
      </desc>

      {[0, 25, 50, 75, 100].map((pct) => (
        <g key={pct}>
          <line x1="60" y1={y(pct)} x2="580" y2={y(pct)} className="chart__grid" />
          <text x="50" y={y(pct) + 4} textAnchor="end" className="chart__tick">
            {pct} %
          </text>
        </g>
      ))}

      <path d={area} className="chart__area" />
      <path d={line} className="chart__line" />

      {points.filter((p) => p.mois % 2 === 0).map((p) => (
        <g key={p.mois}>
          <circle cx={x(p.mois)} cy={y(p.pct)} r="4" className="chart__dot" />
          <text x={x(p.mois)} y="275" textAnchor="middle" className="chart__tick">
            M{p.mois}
          </text>
        </g>
      ))}

      <line x1="60" y1="250" x2="580" y2="250" className="chart__axis" />
      <line x1="60" y1="50" x2="60" y2="250" className="chart__axis" />

      <text x="320" y="295" textAnchor="middle" className="chart__label">
        Mois du projet
      </text>
      <text x="120" y="70" className="chart__annotation">
        Budget cumulé prévu
      </text>
    </svg>
  );
}
