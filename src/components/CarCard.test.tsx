import { afterEach, describe, expect, it } from "vitest";
import { cleanup, fireEvent, render, screen } from "@testing-library/react";
import CarCard from "./CarCard";
import { vehicles } from "../data/vehicles";

afterEach(() => {
  cleanup();
});

describe("CarCard stills", () => {
  it("renders per-model img with srcset and alt from vehicle name", () => {
    const vehicle = vehicles[0];
    render(
      <CarCard vehicle={vehicle} isSelected={false} onViewSpecs={() => {}} />,
    );

    const img = screen.getByTestId(`still-${vehicle.id}`);
    expect(img.tagName).toBe("IMG");
    expect(img.getAttribute("alt")).toBe(vehicle.name);
    expect(img.getAttribute("src")).toBe(vehicle.stillSrc);
    expect(img.getAttribute("srcset")).toBe(vehicle.stillSrcSet);
  });

  it("swaps to a labeled fallback when the still fails to load", () => {
    const vehicle = vehicles[2];
    render(
      <CarCard vehicle={vehicle} isSelected={false} onViewSpecs={() => {}} />,
    );

    const img = screen.getByTestId(`still-${vehicle.id}`);
    fireEvent.error(img);

    const fallback = screen.getByTestId(`still-fallback-${vehicle.id}`);
    expect(fallback.getAttribute("aria-label")).toBe(
      `${vehicle.name} — image unavailable`,
    );
    expect(screen.queryByTestId(`still-${vehicle.id}`)).toBeNull();
  });
});
