import { createPortal } from 'react-dom';
import Header from '@/components/layout/Header';
import type { TermsBlock, TermsDoc } from '@/features/onboarding/termsData';

interface TermsDetailViewProps {
  doc: TermsDoc;
  onClose: () => void;
}

/** 문단/리스트/표 한 블록 렌더 */
const Block = ({ block }: { block: TermsBlock }) => {
  if (block.type === 'paragraph') {
    return <p className="text-sm leading-relaxed text-neutral-600">{block.text}</p>;
  }

  if (block.type === 'list') {
    return (
      <ul className="flex flex-col gap-1.5 text-sm leading-relaxed text-neutral-600">
        {block.items.map((item, i) => {
          const text = typeof item === 'string' ? item : item.text;
          const sub = typeof item === 'string' ? undefined : item.sub;
          return (
            <li key={i}>
              <span>· {text}</span>
              {sub && (
                <ul className="mt-1 flex flex-col gap-1 text-xs text-neutral-500">
                  {sub.map((s, j) => (
                    <li key={j}>· {s}</li>
                  ))}
                </ul>
              )}
            </li>
          );
        })}
      </ul>
    );
  }

  // table
  return (
    <div className="mx-auto w-full max-w-[280px] overflow-hidden rounded-lg border border-neutral-200">
      <table className="w-full text-xs">
        <thead>
          <tr className="bg-neutral-100 text-neutral-700">
            {block.headers.map((h, i) => (
              <th key={i} className="border-b border-neutral-200 px-3 py-2 font-medium">
                {h}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {block.rows.map((row, i) => (
            <tr key={i} className="text-neutral-600">
              {row.map((cell, j) => (
                <td
                  key={j}
                  className={`px-3 py-2 ${i < block.rows.length - 1 ? 'border-b border-neutral-200' : ''} ${
                    j > 0 ? 'border-l border-neutral-200' : ''
                  }`}
                >
                  {cell}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

/** 약관 상세 풀스크린 오버레이 (app-container 안에 portal) */
const TermsDetailView = ({ doc, onClose }: TermsDetailViewProps) => {
  const container = document.getElementById('app-container') ?? document.body;

  return createPortal(
    <div className="absolute inset-0 z-50 flex flex-col bg-white">
      <Header title={doc.title} showBack onBack={onClose} />

      <div className="flex-1 overflow-y-auto px-6 py-6 text-center">
        {doc.sections.map((section, i) => (
          <section key={i} className={i > 0 ? 'mt-8' : ''}>
            <h2 className="mb-3 text-sm font-semibold text-black">{section.heading}</h2>
            <div className="flex flex-col gap-3">
              {section.blocks.map((block, j) => (
                <Block key={j} block={block} />
              ))}
            </div>
          </section>
        ))}

        {doc.footer && (
          <section className="mt-10">
            <h2 className="mb-2 text-sm font-semibold text-black">부칙</h2>
            <p className="text-sm leading-relaxed text-neutral-600">{doc.footer}</p>
          </section>
        )}
      </div>
    </div>,
    container,
  );
};

export default TermsDetailView;
