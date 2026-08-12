const probabilites = ['Rare', 'Possible', 'Probable', 'Quasi certain'];
const impacts = ['Mineur', 'Modéré', 'Majeur', 'Critique'];

/** Zone de criticité en fonction du produit probabilité × impact. */
function zone(p: number, i: number): 'acceptable' | 'traiter' | 'inacceptable' {
  const score = (p + 1) * (i + 1);
  if (score <= 4) return 'acceptable';
  if (score <= 9) return 'traiter';
  return 'inacceptable';
}

const zoneLabels = {
  acceptable: 'Acceptable — surveillance simple',
  traiter: 'À traiter — plan d’action requis',
  inacceptable: 'Inacceptable — action immédiate ou escalade',
};

/**
 * Matrice probabilité × impact. Les seuils reprennent ceux de la leçon :
 * trois zones, déterminées par le produit des deux cotations.
 */
export default function MatriceRisques() {
  const cell = 92;
  const originX = 130;
  const originY = 40;

  return (
    <svg viewBox="0 0 620 480" role="img" className="chart chart--matrix" aria-labelledby="matrice-desc">
      <desc id="matrice-desc">
        Matrice de criticité à seize cases croisant quatre niveaux de probabilité (rare, possible, probable, quasi
        certain) et quatre niveaux d’impact (mineur, modéré, majeur, critique). Les combinaisons faibles sont
        acceptables et se surveillent ; les combinaisons intermédiaires exigent un plan d’action ; les combinaisons
        fortes, en haut à droite, sont inacceptables et imposent une action immédiate ou une escalade.
      </desc>

      {probabilites.map((_, p) =>
        impacts.map((_, i) => {
          const z = zone(p, i);
          return (
            <g key={`${p}-${i}`}>
              <rect
                x={originX + i * cell}
                y={originY + (probabilites.length - 1 - p) * cell}
                width={cell - 4}
                height={cell - 4}
                rx="4"
                className={`matrix__cell matrix__cell--${z}`}
              />
              <text
                x={originX + i * cell + (cell - 4) / 2}
                y={originY + (probabilites.length - 1 - p) * cell + (cell - 4) / 2 + 5}
                textAnchor="middle"
                className="matrix__score mono"
              >
                {(p + 1) * (i + 1)}
              </text>
            </g>
          );
        }),
      )}

      {impacts.map((label, i) => (
        <text
          key={label}
          x={originX + i * cell + (cell - 4) / 2}
          y={originY + probabilites.length * cell + 16}
          textAnchor="middle"
          className="chart__tick"
        >
          {label}
        </text>
      ))}

      {probabilites.map((label, p) => (
        <text
          key={label}
          x={originX - 12}
          y={originY + (probabilites.length - 1 - p) * cell + (cell - 4) / 2 + 4}
          textAnchor="end"
          className="chart__tick"
        >
          {label}
        </text>
      ))}

      <text x={originX + (impacts.length * cell) / 2} y={originY + probabilites.length * cell + 42} textAnchor="middle" className="chart__label">
        Impact
      </text>
      <text
        x={-(originY + (probabilites.length * cell) / 2)}
        y="24"
        transform="rotate(-90)"
        textAnchor="middle"
        className="chart__label"
      >
        Probabilité
      </text>

      <g className="chart__legend">
        {(['acceptable', 'traiter', 'inacceptable'] as const).map((z, idx) => (
          <g key={z}>
            <rect x={originX} y={440 + idx * 0} width="0" height="0" />
            <rect x={20 + idx * 200} y={456} width="13" height="13" rx="2" className={`matrix__cell matrix__cell--${z}`} />
            <text x={40 + idx * 200} y={466}>
              {zoneLabels[z].split(' — ')[0]}
            </text>
          </g>
        ))}
      </g>
    </svg>
  );
}
