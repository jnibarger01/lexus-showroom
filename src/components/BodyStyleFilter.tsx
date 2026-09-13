import { useRef, type KeyboardEvent } from "react";
import {
  BODY_STYLE_FILTERS,
  type BodyStyleFilterId,
} from "../bodyStyleFilter";

interface BodyStyleFilterProps {
  value: BodyStyleFilterId;
  onChange: (filter: BodyStyleFilterId) => void;
}

export default function BodyStyleFilter({
  value,
  onChange,
}: BodyStyleFilterProps) {
  const optionRefs = useRef<Array<HTMLButtonElement | null>>([]);

  const focusOption = (index: number) => {
    const next = (index + BODY_STYLE_FILTERS.length) % BODY_STYLE_FILTERS.length;
    onChange(BODY_STYLE_FILTERS[next].id);
    optionRefs.current[next]?.focus();
  };

  const onOptionKeyDown = (
    event: KeyboardEvent<HTMLButtonElement>,
    index: number,
  ) => {
    switch (event.key) {
      case "ArrowRight":
      case "ArrowDown":
        event.preventDefault();
        focusOption(index + 1);
        break;
      case "ArrowLeft":
      case "ArrowUp":
        event.preventDefault();
        focusOption(index - 1);
        break;
      case "Home":
        event.preventDefault();
        focusOption(0);
        break;
      case "End":
        event.preventDefault();
        focusOption(BODY_STYLE_FILTERS.length - 1);
        break;
      default:
        break;
    }
  };

  return (
    <div
      role="radiogroup"
      aria-label="Filter lineup by body style"
      data-testid="body-style-filter"
      className="mb-6 flex flex-wrap gap-2"
    >
      {BODY_STYLE_FILTERS.map((option, index) => {
        const isActive = option.id === value;
        return (
          <button
            key={option.id}
            ref={(node) => {
              optionRefs.current[index] = node;
            }}
            type="button"
            role="radio"
            aria-checked={isActive}
            tabIndex={isActive ? 0 : -1}
            data-testid={`body-style-filter-${option.id}`}
            onClick={() => onChange(option.id)}
            onKeyDown={(event) => onOptionKeyDown(event, index)}
            className={`rounded-full border px-4 py-2 text-sm font-semibold transition focus:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-canvas ${
              isActive
                ? "border-accent bg-accent text-white"
                : "border-line/15 bg-ink/5 text-muted hover:border-line/35 hover:text-ink"
            }`}
          >
            {option.label}
          </button>
        );
      })}
    </div>
  );
}
