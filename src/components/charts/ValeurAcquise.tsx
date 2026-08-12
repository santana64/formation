/**
 * Les trois courbes de la valeur acquise, sur l'exemple chiffré de la leçon :
 * projet budgété 500 k€, mesuré au sixième mois, VP 200, VA 160, CR 210.
 * Le graphique matérialise les deux écarts, de coût et de délai.
 */
export default function ValeurAcquise() {
  const x = (mois: number) => 70 + (mois / 12) * 480;
  const y = (k: number) => 250 - (k / 500) * 200;

  const vp = [0, 15, 45, 85, 130, 168, 200, 245, 300, 355, 410, 460, 500];
  const va = [0, 10, 32, 62, 100, 132, 160];
  const cr = [0, 14, 44, 84, 132, 172, 210];

  const path = (values: number[]) =>
    values.map((v, i) => `${i === 0 ? 'M' : 'L'} ${x(i)} ${y(v)}`).join(' ');

  return (
    <svg viewBox="0 0 620 320" role="img" className="chart" aria-labelledby="va-desc">
      <desc id="va-desc">
        Trois courbes sur douze mois pour un projet budgété 500 000 euros. Au sixième mois, la valeur planifiée
        atteint 200 000 euros, la valeur acquise seulement 160 000 euros et le coût réel 210 000 euros. L’écart de
        coût vaut donc moins 50 000 euros et l’écart de délai moins 40 000 euros : le projet est à la fois en
        dépassement et en retard.
      </desc>

      {[0, 125, 250, 375, 500].map((k) => (
        <g key={k}>
          <line x1="70" y1={y(k)} x2="550" y2={y(k)} className="chart__grid" />
          <text x="60" y={y(k) + 4} textAnchor="end" className="chart__tick">
            {k} k€
          </text>
        </g>
      ))}

      <line x1={x(6)} y1="50" x2={x(6)} y2="250" className="chart__marker" />
      <text x={x(6)} y="42" textAnchor="middle" className="chart__tick">
        date d’analyse
      </text>

      <path d={path(vp)} className="chart__line chart__line--planned" />
      <path d={path(cr)} className="chart__line chart__line--cost" />
      <path d={path(va)} className="chart__line chart__line--earned" />

      <circle cx={x(6)} cy={y(200)} r="5" className="chart__dot chart__dot--planned" />
      <circle cx={x(6)} cy={y(210)} r="5" className="chart__dot chart__dot--cost" />
      <circle cx={x(6)} cy={y(160)} r="5" className="chart__dot chart__dot--earned" />

      {/* Écart de coût : entre coût réel et valeur acquise. */}
      <line x1={x(6) + 22} y1={y(210)} x2={x(6) + 22} y2={y(160)} className="chart__gap" />
      <text x={x(6) + 30} y={(y(210) + y(160)) / 2 + 4} className="chart__annotation">
        écart de coût − 50 k€
      </text>

      {/* Écart de délai : entre valeur planifiée et valeur acquise. */}
      <line x1={x(6) - 22} y1={y(200)} x2={x(6) - 22} y2={y(160)} className="chart__gap" />
      <text x={x(6) - 30} y={(y(200) + y(160)) / 2 + 4} textAnchor="end" className="chart__annotation">
        écart de délai − 40 k€
      </text>

      <line x1="70" y1="250" x2="550" y2="250" className="chart__axis" />
      <line x1="70" y1="50" x2="70" y2="250" className="chart__axis" />
      <text x="310" y="275" textAnchor="middle" className="chart__label">
        Mois du projet
      </text>

      <g className="chart__legend">
        <rect x="70" y="292" width="14" height="3" className="chart__swatch chart__swatch--planned" />
        <text x="92" y="298">Valeur planifiée</text>
        <rect x="220" y="292" width="14" height="3" className="chart__swatch chart__swatch--earned" />
        <text x="242" y="298">Valeur acquise</text>
        <rect x="365" y="292" width="14" height="3" className="chart__swatch chart__swatch--cost" />
        <text x="387" y="298">Coût réel</text>
      </g>
    </svg>
  );
}
