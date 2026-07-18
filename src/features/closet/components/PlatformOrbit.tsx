import type { ShoppingPlatform } from '../types';

interface PlatformOrbitProps {
  platforms: ShoppingPlatform[];
  selectedId?: string;
  onSelect: (id: string) => void;
}

/** 원형 궤도 위 좌표 (중심 기준 %) — 최대 6개까지 배치 */
const ORBIT_POSITIONS = [
  { top: '8%', left: '62%' },
  { top: '30%', left: '82%' },
  { top: '60%', left: '78%' },
  { top: '80%', left: '52%' },
  { top: '58%', left: '18%' },
  { top: '26%', left: '16%' },
];

/**
 * 연동할 쇼핑몰 로고를 원형으로 배치, 선택 시 중앙 강조.
 * 사용처: 쇼핑몰 플랫폼 선택 화면.
 */
const PlatformOrbit = ({ platforms, selectedId, onSelect }: PlatformOrbitProps) => {
  const selected = platforms.find((p) => p.id === selectedId);
  const others = platforms.filter((p) => p.id !== selectedId).slice(0, ORBIT_POSITIONS.length);

  return (
    <div className="relative w-full aspect-square max-w-[320px] mx-auto">
      {/* 주변 로고 */}
      {others.map((p, i) => (
        <button
          key={p.id}
          type="button"
          onClick={() => onSelect(p.id)}
          className="absolute -translate-x-1/2 -translate-y-1/2 flex items-center justify-center w-12 h-12 rounded-2xl bg-neutral-100 text-[10px] font-medium text-neutral-500 shadow-sm cursor-pointer"
          style={ORBIT_POSITIONS[i]}
        >
          {p.logoUrl ? (
            <img src={p.logoUrl} alt={p.name} className="w-full h-full object-contain rounded-2xl" />
          ) : (
            p.name
          )}
        </button>
      ))}

      {/* 중앙 선택 로고 */}
      {selected && (
        <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 flex items-center gap-2">
          <div className="flex items-center justify-center w-16 h-16 rounded-2xl bg-black overflow-hidden">
            {selected.logoUrl ? (
              <img src={selected.logoUrl} alt={selected.name} className="w-full h-full object-contain" />
            ) : (
              <span className="text-white text-xs font-bold">{selected.name.slice(0, 2)}</span>
            )}
          </div>
          <span className="text-lg font-bold text-black">{selected.name}</span>
        </div>
      )}
    </div>
  );
};

export default PlatformOrbit;
