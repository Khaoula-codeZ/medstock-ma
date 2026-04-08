import { useState } from 'react';

// Real Morocco outline from world-atlas topojson data (ISO 504)
// Projected using equirectangular projection, bounds: lon[-17,-1] lat[21.4,35.9]
const MOROCCO_OUTLINE = 'M371,29.6 L371.7,32.3 L373.2,34.4 L378.5,39.3 L381.7,42.2 L381.8,43.3 L380.7,45.7 L380.3,47.4 L381.1,49.2 L383,51.4 L383.2,52.4 L382.7,53.7 L381.8,56 L383.8,62.9 L384.2,69.6 L383.6,74.3 L383.6,77 L383.6,79.8 L384.9,82.5 L385.6,90.1 L385.6,94.9 L386.3,99.8 L389.3,104.4 L391.2,107.1 L393.4,109.7 L397.6,112.4 L400,115 L400,119.6 L400,124.3 L398.3,127.6 L397.3,132.4 L396.9,135.4 L395.6,140.9 L384.3,143.3 L377.3,143.1 L369.5,144.5 L364.9,145.6 L362.9,149.5 L361.4,154.3 L345.7,159.7 L341.5,159.6 L339.4,162.2 L339.7,166.2 L340.9,172.2 L340.1,176.2 L340.3,179.6 L342.3,180.8 L345.2,183.4 L344.1,187.2 L339.1,188.5 L331.6,192.9 L321.5,199.8 L315.2,202.5 L308,210.8 L302.1,220.5 L295.1,225 L284.9,227.9 L279.6,228.7 L274.4,228.5 L272.4,228.8 L272.2,232 L270.8,236.6 L269.2,237.8 L263.6,236.6 L256.1,235.9 L253.6,237.6 L248.7,243.7 L243.7,245.6 L235.4,253 L227.1,260.2 L223.7,264 L217.1,270.3 L216.5,274.1 L216.5,285.7 L216.5,302.4 L213.1,311.8 L213.2,313.4 L214.2,319.8 L213.4,323.9 L214.2,328.2 L214.8,332.1 L211.3,334 L206.2,334.5 L200.9,334.3 L197.6,334.6 L193.4,338.4 L189,343.4 L184.5,343.8 L181.2,341.7 L178.9,342.8 L175.6,343.6 L169.7,340 L165,338.6 L160.6,338.3 L155.1,339.8 L148.7,342.2 L145.9,347 L147,351.1 L144.9,354.8 L141.7,359.7 L139.8,364 L136.7,370.1 L135.7,374.3 L131.4,375.6 L127.5,377.1 L126.6,378.6 L126.1,383.4 L124.7,389 L122.7,397.5 L120.9,408.1 L118.4,419.7 L116.4,425.4 L112.9,429.2 L109.1,433.1 L103.6,437.4 L101.5,439.3 L98.2,445.3 L95.6,453.8 L93.5,466.2 L92.3,474.8 L91.1,485.3 L90.4,493.2 L88.8,498.1 L83.6,504.1 L75.4,509.1 L72.8,511 L69.5,517.5 L66.5,525.9 L64.5,530.3 L59.8,533.2 L54.7,536.4 L49.7,539.6 L47,544.8 L44.6,553.3 L42.4,566.1 L41.2,575.4 L39.9,586.5 L39.3,595.2 L37.6,600.5 L34.5,605.4 L32.2,608.6 L28.7,614 L27.6,617.6 L27.1,623.3 L23.9,630.8 L17.6,633.3 L8.4,632.9 L-0.6,632 L-9.3,630.8 L-17.3,631.7 L-31.7,632 L-40,634 L-35.1,604.4 L-27.4,597.4 L-21.3,576.4 L-17.4,568.2 L-15.7,560.3 L-10.9,546.7 L-6.5,537 L-8.5,536.7 L-12.1,542 L-9.6,534.7 L-0.5,525.2 L15.7,505.3 L21.1,491.7 L22.9,469.2 L28.5,452.2 L32.5,437.4 L37.2,431.7 L48.0,423.7 L59.2,413.3 L64.2,396.1 L71.2,374.5 L75.2,369.5 L82.8,360.7 L107.2,354.2 L123.8,343.3 L134.3,329.3 L152.6,314.3 L167.0,289.7 L175.1,276.2 L178.7,259.5 L174.4,248.8 L171.3,243.9 L172.5,228.8 L177.4,201.3 L189.3,178.4 L190.3,164.2 L210.2,137.8 L219.1,130.0 L254.4,110.3 L266.3,97.4 L290.7,29.9 L297.1,24.1 L303.9,22.2 L311.3,20.5 L309.7,27.2 L316.6,39.3 L331.1,50.4 L350.6,49.0 L359.6,47.5 L368.5,50.3 L377.7,45.9 L380.9,43.9 L381.9,47.2 L384.4,53.9 L390.4,54.6 L403.2,53.2 Z';

const REGIONS = [
  {
    id: 'tanger', name: 'Tanger-Tétouan-Al Hoceïma', cx: 323, cy: 35,
    path: 'M276.1,0 L401.6,0 L401.6,51.3 L338.9,62 L301.2,54.9 L271.1,44.1 L268.6,29.8 Z'
  },
  {
    id: 'oriental', name: 'Oriental', cx: 370, cy: 90,
    path: 'M338.9,0 L401.6,0 L401.6,140.9 L364,140.9 L338.9,123 L326.3,97.9 L338.9,62 Z'
  },
  {
    id: 'fes-meknes', name: 'Fès-Meknès', cx: 301, cy: 100,
    path: 'M271.1,44.1 L301.2,54.9 L338.9,62 L326.3,97.9 L338.9,123 L313.8,140.9 L288.7,133.7 L268.6,112.2 L263.6,87.1 Z'
  },
  {
    id: 'rabat', name: 'Rabat-Salé-Kénitra', cx: 253, cy: 82,
    path: 'M251,33.4 L271.1,44.1 L263.6,87.1 L268.6,112.2 L251,123 L238.5,105 L246,69.2 L253.6,40.5 Z'
  },
  {
    id: 'beni-mellal', name: 'Béni Mellal-Khénifra', cx: 308, cy: 150,
    path: 'M268.6,112.2 L288.7,133.7 L313.8,140.9 L338.9,123 L364,140.9 L351.4,176.7 L313.8,183.9 L276.1,176.7 L263.6,148 L251,123 Z'
  },
  {
    id: 'casablanca', name: 'Casablanca-Settat', cx: 242, cy: 130,
    path: 'M246,69.2 L238.5,105 L251,123 L263.6,148 L276.1,176.7 L246,176.7 L226,158.8 L213.4,123 L226,87.1 L238.5,76.4 Z'
  },
  {
    id: 'marrakech', name: 'Marrakech-Safi', cx: 238, cy: 180,
    path: 'M213.4,123 L226,158.8 L246,176.7 L276.1,176.7 L313.8,183.9 L301.2,212.5 L251,230.5 L200.9,212.5 L175.8,183.9 L188.3,148 L205.9,112.2 Z'
  },
  {
    id: 'draa', name: 'Drâa-Tafilalet', cx: 328, cy: 228,
    path: 'M313.8,183.9 L351.4,176.7 L364,140.9 L389.1,212.5 L389.1,266.3 L338.9,284.2 L288.7,266.3 L263.6,248.4 L251,230.5 L301.2,212.5 Z'
  },
  {
    id: 'souss', name: 'Souss-Massa', cx: 220, cy: 248,
    path: 'M175.8,183.9 L200.9,212.5 L251,230.5 L263.6,248.4 L288.7,266.3 L276.1,284.2 L226,284.2 L188.3,266.3 L163.2,230.5 L150.7,205.4 Z'
  },
  {
    id: 'guelmim', name: 'Guelmim-Oued Noun', cx: 188, cy: 278,
    path: 'M150.7,205.4 L163.2,230.5 L188.3,266.3 L226,284.2 L276.1,284.2 L288.7,320.1 L226,338 L163.2,320.1 L113,284.2 L100.5,248.4 L125.6,212.5 Z'
  },
  {
    id: 'laayoune', name: 'Laâyoune-Sakia El Hamra', cx: 160, cy: 332,
    path: 'M100.5,248.4 L113,284.2 L163.2,320.1 L226,338 L288.7,320.1 L288.7,373.8 L200.9,391.7 L125.6,373.8 L75.4,355.9 L55.3,302.1 L75.4,266.3 Z'
  },
  {
    id: 'dakhla', name: 'Dakhla-Oued Ed-Dahab', cx: 150, cy: 435,
    path: 'M55.3,302.1 L75.4,355.9 L125.6,373.8 L200.9,391.7 L288.7,373.8 L295,460 L200.9,480 L87.9,480 L0.1,480 L0.1,400 L25.2,355.9 L50.3,320 Z'
  },
];

function getSeverityColor(count) {
  if (!count || count === 0) return '#bfdbfe';
  if (count <= 2) return '#fde047';
  if (count <= 5) return '#fb923c';
  return '#ef4444';
}


export default function MoroccoMap({ shortages = [] }) {
  const [tooltip, setTooltip] = useState(null);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });

  const countByRegion = {};
  shortages.forEach(s => {
    if (!s.wilaya) return;
    const w = s.wilaya.toLowerCase().trim();
    const region = REGIONS.find(r =>
      w === r.name.toLowerCase() ||
      r.name.toLowerCase().split('-').some(part => w.includes(part.trim().toLowerCase())) ||
      w.split('-').some(part => r.name.toLowerCase().includes(part.trim().toLowerCase()))
    );
    if (region) countByRegion[region.id] = (countByRegion[region.id] || 0) + 1;
  });

  const handleMouseMove = (e) => {
    const rect = e.currentTarget.getBoundingClientRect();
    setMousePos({ x: e.clientX - rect.left, y: e.clientY - rect.top });
  };

  return (
    <div className="bg-white rounded-xl border border-gray-200 p-4">
      <h3 className="text-sm font-semibold text-gray-800 mb-1">Carte des pénuries par région</h3>
      <p className="text-xs text-gray-400 mb-2">Survolez une région pour le détail</p>

      <div className="relative select-none" onMouseMove={handleMouseMove}>
        <svg viewBox="-5 0 420 490" className="w-full" style={{ maxHeight: '340px' }}>
          <defs>
            <clipPath id="morocco-clip">
              <path d={MOROCCO_OUTLINE} />
            </clipPath>
          </defs>

          {/* Region fills clipped to real Morocco outline */}
          <g clipPath="url(#morocco-clip)">
            {REGIONS.map(region => {
              const count = countByRegion[region.id] || 0;
              const isHovered = tooltip?.id === region.id;
              return (
                <path
                  key={region.id}
                  d={region.path}
                  fill={getSeverityColor(count)}
                  opacity={isHovered ? 0.75 : 1}
                  style={{ transition: 'opacity 0.15s ease' }}
                />
              );
            })}
          </g>

          {/* Real Morocco outline border on top */}
          <path
            d={MOROCCO_OUTLINE}
            fill="none"
            stroke="#64748b"
            strokeWidth="1.2"
          />

          {/* Internal region borders clipped */}
          <g clipPath="url(#morocco-clip)">
            {REGIONS.map(region => (
              <path
                key={`border-${region.id}`}
                d={region.path}
                fill="none"
                stroke="rgba(100,116,139,0.4)"
                strokeWidth="0.8"
              />
            ))}
          </g>

          {/* Invisible hit targets + count labels */}
          {REGIONS.map(region => {
            const count = countByRegion[region.id] || 0;
            return (
              <g
                key={`hit-${region.id}`}
                onMouseEnter={() => setTooltip({ id: region.id, name: region.name, count })}
                onMouseLeave={() => setTooltip(null)}
                style={{ cursor: 'pointer' }}
              >
                <path d={region.path} fill="transparent" />
                {count > 0 && (
                  <text
                    x={region.cx}
                    y={region.cy}
                    textAnchor="middle"
                    dominantBaseline="middle"
                    fontSize="10"
                    fontWeight="800"
                    fill="#1e293b"
                    style={{ pointerEvents: 'none', userSelect: 'none' }}
                  >
                    {count}
                  </text>
                )}
              </g>
            );
          })}
        </svg>

        {tooltip && (
          <div
            className="absolute z-10 bg-gray-900 text-white text-xs rounded-lg px-3 py-2 shadow-xl pointer-events-none"
            style={{
              left: Math.min(mousePos.x + 14, 220),
              top: Math.max(mousePos.y - 45, 0),
            }}
          >
            <p className="font-semibold whitespace-nowrap">{tooltip.name}</p>
            <p className="text-gray-300 mt-0.5">
              {tooltip.count} pénurie{tooltip.count !== 1 ? 's' : ''} signalée{tooltip.count !== 1 ? 's' : ''}
            </p>
          </div>
        )}
      </div>

      <div className="flex items-center gap-3 mt-1 justify-center flex-wrap">
        {[
          { color: '#bfdbfe', stroke: '#93c5fd', label: 'Aucune' },
          { color: '#fde047', stroke: '#b45309', label: '1–2' },
          { color: '#fb923c', stroke: '#c2410c', label: '3–5' },
          { color: '#ef4444', stroke: '#991b1b', label: '6+' },
        ].map(({ color, stroke, label }) => (
          <div key={label} className="flex items-center gap-1">
            <div className="w-3 h-3 rounded-sm" style={{ backgroundColor: color, border: `1px solid ${stroke}` }} />
            <span className="text-xs text-gray-500">{label}</span>
          </div>
        ))}
      </div>
    </div>
  );
}