import { useMemo, useState } from 'react';

/**
 * Calculateur de valeur acquise. L'apprenant saisit ses propres chiffres et lit
 * immédiatement les écarts, les indices et la projection à terminaison, avec
 * l'interprétation en toutes lettres — c'est cette lecture, plus que la
 * formule, qui manque à la plupart des chefs de projet.
 */
export default function ValeurAcquiseExercice() {
  const [budget, setBudget] = useState(500);
  const [vp, setVp] = useState(200);
  const [va, setVa] = useState(160);
  const [cr, setCr] = useState(210);

  const calcul = useMemo(() => {
    const ecartCout = va - cr;
    const ecartDelai = va - vp;
    const ipc = cr > 0 ? va / cr : 0;
    const ipd = vp > 0 ? va / vp : 0;
    const terminaisonStructurelle = ipc > 0 ? budget / ipc : 0;
    const terminaisonPonctuelle = budget - ecartCout;
    return { ecartCout, ecartDelai, ipc, ipd, terminaisonStructurelle, terminaisonPonctuelle };
  }, [budget, vp, va, cr]);

  const fmt = (n: number) => `${n >= 0 ? '' : '− '}${Math.abs(Math.round(n))} k€`;
  const fmtIndice = (n: number) => n.toFixed(2);

  const champs = [
    { id: 'budget', label: 'Budget total (BAC)', value: budget, set: setBudget, hint: 'Budget à l’achèvement.' },
    { id: 'vp', label: 'Valeur planifiée (VP)', value: vp, set: setVp, hint: 'Ce qui devait être produit à ce jour.' },
    { id: 'va', label: 'Valeur acquise (VA)', value: va, set: setVa, hint: 'Budget du travail réellement accompli.' },
    { id: 'cr', label: 'Coût réel (CR)', value: cr, set: setCr, hint: 'Ce que ce travail a réellement coûté.' },
  ];

  return (
    <div className="exercise">
      <p className="exercise__intro">
        Saisissez vos propres chiffres — ceux d’un projet en cours, ou ceux de l’exemple pré-rempli. Les écarts, les
        indices et la projection se recalculent immédiatement.
      </p>

      <div className="exercise__inputs">
        {champs.map((c) => (
          <div key={c.id} className="field">
            <label htmlFor={`ex-${c.id}`}>{c.label}</label>
            <input
              id={`ex-${c.id}`}
              type="number"
              min={0}
              step={5}
              value={c.value}
              onChange={(e) => c.set(Math.max(0, Number(e.target.value)))}
            />
            <p className="field__hint">{c.hint}</p>
          </div>
        ))}
      </div>

      <div className="exercise__results" role="status" aria-live="polite">
        <div className="exercise__row">
          <span className="exercise__key">Écart de coût (VA − CR)</span>
          <span className={`exercise__value mono ${calcul.ecartCout < 0 ? 'is-bad' : 'is-good'}`}>
            {fmt(calcul.ecartCout)}
          </span>
          <span className="exercise__read">
            {calcul.ecartCout < 0
              ? 'Le travail accompli a coûté plus cher que prévu.'
              : calcul.ecartCout > 0
                ? 'Le travail accompli a coûté moins cher que prévu.'
                : 'Le coût est conforme au budget prévu.'}
          </span>
        </div>

        <div className="exercise__row">
          <span className="exercise__key">Écart de délai (VA − VP)</span>
          <span className={`exercise__value mono ${calcul.ecartDelai < 0 ? 'is-bad' : 'is-good'}`}>
            {fmt(calcul.ecartDelai)}
          </span>
          <span className="exercise__read">
            {calcul.ecartDelai < 0
              ? 'Il manque de la production à cette date : le projet est en retard.'
              : calcul.ecartDelai > 0
                ? 'La production est en avance sur le planning.'
                : 'La production est conforme au planning.'}
          </span>
        </div>

        <div className="exercise__row">
          <span className="exercise__key">Indice de coût (IPC)</span>
          <span className={`exercise__value mono ${calcul.ipc < 1 ? 'is-bad' : 'is-good'}`}>
            {fmtIndice(calcul.ipc)}
          </span>
          <span className="exercise__read">
            Chaque euro dépensé produit {Math.round(calcul.ipc * 100)} centimes de la valeur prévue.
          </span>
        </div>

        <div className="exercise__row">
          <span className="exercise__key">Indice de délai (IPD)</span>
          <span className={`exercise__value mono ${calcul.ipd < 1 ? 'is-bad' : 'is-good'}`}>
            {fmtIndice(calcul.ipd)}
          </span>
          <span className="exercise__read">
            Le rythme de production atteint {Math.round(calcul.ipd * 100)} % de ce qui était planifié.
          </span>
        </div>
      </div>

      <div className="exercise__projection">
        <h4>Coût à terminaison — deux hypothèses</h4>
        <p>
          Le choix entre les deux dépend de la cause de la dérive, et c’est un jugement, pas un calcul.
        </p>
        <div className="exercise__row">
          <span className="exercise__key">Dérive structurelle</span>
          <span className="exercise__value mono">{fmt(calcul.terminaisonStructurelle)}</span>
          <span className="exercise__read">
            La performance observée se poursuit : budget ÷ IPC. À retenir si la cause persiste — sous-estimation
            initiale, complexité découverte.
          </span>
        </div>
        <div className="exercise__row">
          <span className="exercise__key">Dérive ponctuelle et traitée</span>
          <span className="exercise__value mono">{fmt(calcul.terminaisonPonctuelle)}</span>
          <span className="exercise__read">
            Le reste-à-faire tient le budget prévu : le dépassement se limite à l’écart déjà constaté.
          </span>
        </div>
      </div>

      {calcul.terminaisonStructurelle > budget * 1.1 && (
        <p className="exercise__alert">
          Avec ces chiffres, l’hypothèse structurelle projette un dépassement supérieur à 10 % du budget. C’est un
          seuil qui justifie presque toujours de remonter l’arbitrage au commanditaire, avec les deux scénarios et
          votre recommandation.
        </p>
      )}
    </div>
  );
}
