import { afterEach, describe, expect, it, vi } from "vitest";
import { cleanup, fireEvent, render, screen } from "@testing-library/react";
import BodyStyleFilter from "./BodyStyleFilter";

afterEach(() => {
  cleanup();
});

describe("BodyStyleFilter", () => {
  it("exposes a keyboard-operable radiogroup of chips", () => {
    const onChange = vi.fn();
    render(<BodyStyleFilter value="all" onChange={onChange} />);

    const group = screen.getByRole("radiogroup", {
      name: /filter lineup by body style/i,
    });
    expect(group).toBeTruthy();

    const sedan = screen.getByRole("radio", { name: "Sedan" });
    expect(sedan.getAttribute("aria-checked")).toBe("false");
    fireEvent.click(sedan);
    expect(onChange).toHaveBeenCalledWith("sedan");
  });

  it("moves selection with arrow keys", () => {
    const onChange = vi.fn();
    render(<BodyStyleFilter value="all" onChange={onChange} />);

    const allChip = screen.getByRole("radio", { name: "All" });
    fireEvent.keyDown(allChip, { key: "ArrowRight" });
    expect(onChange).toHaveBeenCalledWith("sedan");
  });
});
