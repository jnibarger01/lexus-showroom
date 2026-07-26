import Button from "./Button";

export default function Hero() {
  return (
    <section
      id="home"
      className="relative overflow-hidden bg-gradient-to-b from-lexus-charcoal to-lexus-black"
    >
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(139,29,44,0.25),_transparent_60%)]" />

      <div className="relative mx-auto flex max-w-6xl flex-col items-start px-6 py-28 sm:py-36">
        <p className="mb-4 text-sm font-semibold uppercase tracking-[0.35em] text-lexus-accent">
          The Lexus Showroom
        </p>
        <h1 className="max-w-2xl text-4xl font-bold leading-tight text-white sm:text-5xl md:text-6xl">
          Experience Amazing, on your terms.
        </h1>
        <p className="mt-6 max-w-xl text-lg text-lexus-silver">
          From the effortless ES sedan to the uncompromising LX, explore the
          full Lexus lineup and find the drive that fits your life.
        </p>
        <div className="mt-10 flex flex-wrap gap-4">
          <Button
            variant="primary"
            onClick={() =>
              document
                .getElementById("models")
                ?.scrollIntoView({ behavior: "smooth" })
            }
          >
            Explore Models
          </Button>
          <Button
            variant="ghost"
            onClick={() =>
              document
                .getElementById("specs")
                ?.scrollIntoView({ behavior: "smooth" })
            }
          >
            Compare Specs
          </Button>
        </div>
      </div>
    </section>
  );
}
