import Button from "./Button";

interface HeroProps {
  onExploreModels: () => void;
  onCompareSpecs: () => void;
}

export default function Hero({ onExploreModels, onCompareSpecs }: HeroProps) {
  return (
    <section
      id="home"
      aria-labelledby="hero-heading"
      className="relative isolate overflow-hidden border-b border-line/10 bg-canvas"
    >
      <div className="hero-glow pointer-events-none absolute inset-0" aria-hidden="true" />
      <div
        className="pointer-events-none absolute inset-x-0 bottom-0 h-40 bg-gradient-to-t from-canvas to-transparent"
        aria-hidden="true"
      />

      <div className="relative mx-auto grid max-w-6xl items-center gap-10 px-gutter py-section sm:py-section-lg lg:grid-cols-[1fr_0.95fr] lg:py-32">
        <div className="max-w-2xl">
          <p className="mb-5 text-xs font-semibold uppercase tracking-kicker text-accent-bright sm:text-sm">
            The Lexus Showroom
          </p>
          <h1
            id="hero-heading"
            className="font-display text-4xl font-bold leading-[1.05] tracking-tight text-ink sm:text-5xl md:text-6xl"
          >
            Experience amazing,
            <span className="block text-muted">on your terms.</span>
          </h1>
          <p className="mt-6 max-w-xl text-base leading-7 text-muted sm:text-lg">
            Discover a considered collection of sedans and SUVs, each crafted
            to make the everyday drive feel exceptional.
          </p>
          <div className="mt-9 flex flex-wrap gap-3">
            <Button type="button" variant="primary" onClick={onExploreModels}>
              Explore models
            </Button>
            <Button type="button" variant="ghost" onClick={onCompareSpecs}>
              Compare specs
            </Button>
          </div>
          <dl className="mt-12 flex flex-wrap gap-x-8 gap-y-4 border-t border-line/15 pt-6 text-sm">
            <div>
              <dt className="uppercase tracking-[0.18em] text-muted">
                Lineup
              </dt>
              <dd className="mt-1 font-semibold text-ink">4 distinct models</dd>
            </div>
            <div>
              <dt className="uppercase tracking-[0.18em] text-muted">
                Crafted for
              </dt>
              <dd className="mt-1 font-semibold text-ink">Every kind of drive</dd>
            </div>
          </dl>
        </div>

        <div className="relative mx-auto w-full max-w-xl" aria-hidden="true">
          <div className="absolute -inset-8 rounded-full bg-accent/20 blur-3xl" />
          <svg viewBox="0 0 640 400" className="relative w-full drop-shadow-2xl">
            <path d="M43 309h554" stroke="currentColor" strokeOpacity=".2" strokeWidth="2" />
            <path d="M116 286c19-52 47-92 94-115 47-23 150-30 214-7 45 16 79 59 100 122l34 14c14 6 23 19 23 35v19H75v-22c0-22 13-39 33-46l8-3Z" fill="#29292b" />
            <path d="M138 276c22-41 48-70 88-85 54-20 141-25 189-7 34 13 63 47 80 92H138Z" fill="#444449" />
            <path d="M224 195c45-16 126-20 170-5 24 8 49 39 62 70H177c14-31 28-56 47-65Z" fill="#18181a" />
            <path d="M127 284h390" stroke="#8b1d2c" strokeWidth="7" />
            <path d="M78 331h504" stroke="#f4f4f5" strokeOpacity=".45" strokeWidth="3" />
            <circle cx="181" cy="335" r="49" fill="#0b0b0b" />
            <circle cx="181" cy="335" r="29" fill="#9ca3af" />
            <circle cx="181" cy="335" r="12" fill="#26262a" />
            <circle cx="467" cy="335" r="49" fill="#0b0b0b" />
            <circle cx="467" cy="335" r="29" fill="#9ca3af" />
            <circle cx="467" cy="335" r="12" fill="#26262a" />
            <path d="M91 303h56l-10 16H88c-7 0-8-11 3-16Zm409 0h54c11 5 10 16 3 16h-49l-8-16Z" fill="#f4f4f5" />
          </svg>
          <p className="absolute bottom-0 right-2 text-[10px] font-semibold uppercase tracking-kicker text-ink/50">
            Designed to move you
          </p>
        </div>
      </div>
    </section>
  );
}
