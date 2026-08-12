import type { Block } from '../data/types';

const calloutMeta = {
  repere: { label: 'À retenir', className: 'callout--repere' },
  terrain: { label: 'Vu sur le terrain', className: 'callout--terrain' },
  attention: { label: 'Attention', className: 'callout--attention' },
} as const;

export default function LessonBlocks({ blocks }: { blocks: Block[] }) {
  return (
    <>
      {blocks.map((block, i) => {
        switch (block.type) {
          case 'p':
            return <p key={i}>{block.text}</p>;
          case 'h2':
            return <h2 key={i}>{block.text}</h2>;
          case 'list': {
            const items = block.items.map((item, j) => <li key={j}>{item}</li>);
            return block.ordered ? <ol key={i}>{items}</ol> : <ul key={i}>{items}</ul>;
          }
          case 'definition':
            return (
              <div key={i} className="definition">
                <span className="definition__term">{block.term}</span>
                <p>{block.text}</p>
              </div>
            );
          case 'callout': {
            const meta = calloutMeta[block.variant];
            return (
              <aside key={i} className={`callout ${meta.className}`}>
                <p className="callout__title">{block.title}</p>
                <p>{block.text}</p>
              </aside>
            );
          }
          case 'table':
            return (
              <div key={i} className="table-scroll">
                <table>
                  <caption>{block.caption}</caption>
                  <thead>
                    <tr>
                      {block.head.map((h, j) => (
                        <th key={j} scope="col">
                          {h}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {block.rows.map((row, j) => (
                      <tr key={j}>
                        {row.map((cell, k) => (
                          <td key={k}>{cell}</td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            );
        }
      })}
    </>
  );
}
