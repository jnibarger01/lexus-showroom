export default function Footer() {
  return (
    <footer
      id="contact"
      className="border-t border-white/10 bg-lexus-black py-10"
    >
      <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-4 px-6 text-sm text-lexus-silver sm:flex-row">
        <p className="tracking-[0.2em]">LEXUS SHOWROOM</p>
        <p className="max-w-xl text-center sm:text-right">
          Specs and MSRP are 2026 MY entry-trim figures (MSRP + DPH) for demo
          comparison — not a dealer quote. Unaffiliated showroom concept.
        </p>
      </div>
    </footer>
  );
}
