export function AreaChart({
  points,
  height = 210,
}: {
  points: { label: string; value: number }[];
  height?: number;
}) {
  const w = 660;
  const h = height;
  const pad = { t: 14, r: 12, b: 26, l: 34 };
  const max = Math.max(...points.map((p) => p.value), 1);
  const innerW = w - pad.l - pad.r;
  const innerH = h - pad.t - pad.b;
  const stepX = points.length > 1 ? innerW / (points.length - 1) : innerW;
  const xy = points.map((p, i) => [
    pad.l + i * stepX,
    pad.t + innerH * (1 - p.value / max),
  ]);
  const line = xy.map(([x, y], i) => `${i === 0 ? "M" : "L"}${x.toFixed(1)},${y.toFixed(1)}`).join(" ");
  const area = `${line} L${xy[xy.length - 1][0].toFixed(1)},${(pad.t + innerH).toFixed(1)} L${xy[0][0].toFixed(1)},${(
    pad.t + innerH
  ).toFixed(1)} Z`;

  return (
    <svg className="chart" viewBox={`0 0 ${w} ${h}`} role="img" aria-label="Visits over time">
      <defs>
        <linearGradient id="areaFill" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#f5f2ed" stopOpacity="0.35" />
          <stop offset="1" stopColor="#f5f2ed" stopOpacity="0" />
        </linearGradient>
      </defs>
      <g className="chart-grid">
        {[0, 0.25, 0.5, 0.75, 1].map((t) => (
          <line
            key={t}
            x1={pad.l}
            x2={w - pad.r}
            y1={pad.t + innerH * t}
            y2={pad.t + innerH * t}
          />
        ))}
      </g>
      <path d={area} fill="url(#areaFill)" />
      <path d={line} fill="none" stroke="#8b0d1a" strokeWidth="2" strokeLinecap="round" />
      {xy.map(([x, y], i) => (
        <circle key={i} cx={x} cy={y} r="2.6" fill="#fffdf9" stroke="#8b0d1a" strokeWidth="1.6" />
      ))}
      {points.map((p, i) =>
        i % Math.ceil(points.length / 7) === 0 || i === points.length - 1 ? (
          <text key={p.label} x={xy[i][0]} y={h - 8} textAnchor="middle" className="chart-label">
            {p.label}
          </text>
        ) : null,
      )}
      <text x={pad.l - 8} y={pad.t + 4} textAnchor="end" className="chart-label">
        {max}
      </text>
      <text x={pad.l - 8} y={pad.t + innerH + 4} textAnchor="end" className="chart-label">
        0
      </text>
    </svg>
  );
}

export function BarList({ items }: { items: { label: string; value: number }[] }) {
  const max = Math.max(...items.map((i) => i.value), 1);
  return (
    <div className="bars">
      {items.map((item) => (
        <div className="bar-row" key={item.label}>
          <span style={{ overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
            {item.label}
          </span>
          <span className="bar-track">
            <span className="bar-fill" style={{ width: `${(item.value / max) * 100}%` }} />
          </span>
          <strong>{item.value}</strong>
        </div>
      ))}
    </div>
  );
}
