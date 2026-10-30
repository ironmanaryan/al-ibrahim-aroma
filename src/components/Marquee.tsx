export default function Marquee({ words }: { words: string[] }) {
  const row = [...words, ...words];
  return (
    <div className="marquee" aria-hidden="true">
      <div className="marquee__track">
        {row.map((word, i) => (
          <span className="marquee__item" key={`${word}-${i}`}>
            {word}
          </span>
        ))}
      </div>
    </div>
  );
}
