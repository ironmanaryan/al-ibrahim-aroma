export default function AnnouncementBar({ items }: { items: string[] }) {
  const row = [...items, ...items];
  return (
    <div className="announce">
      <div className="announce__track">
        {row.map((item, i) => (
          <span className="announce__item" key={`${item}-${i}`}>
            {item}
          </span>
        ))}
      </div>
    </div>
  );
}
