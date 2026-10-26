// Splits a string into masked words so a title can slide in word by word.
// The GSAP side lives in useMotion; this only renders the markup.
export default function Split({ text }) {
  const words = text.split(" ");
  return words.map((word, i) => (
    <span key={`${word}-${i}`}>
      <span className="sw">
        <span className="sw-i">{word}</span>
      </span>
      {i < words.length - 1 ? " " : null}
    </span>
  ));
}
