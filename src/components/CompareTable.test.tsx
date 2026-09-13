import { afterEach, describe, expect, it, vi } from "vitest";
import { cleanup, fireEvent, render, screen, within } from "@testing-library/react";
import CompareTable from "./CompareTable";
import { vehicles } from "../data/vehicles";

afterEach(() => {
  cleanup();
});

describe("CompareTable", () => {
  it("renders aligned specs for two selected models", () => {
    const onChangeLeft = vi.fn();
    const onChangeRight = vi.fn();

    render(
      <CompareTable
        vehicles={vehicles}
        leftId="es"
        rightId="nx"
        onChangeLeft={onChangeLeft}
        onChangeRight={onChangeRight}
      />,
    );

    expect(screen.getByTestId("compare-table")).toBeTruthy();
    expect((screen.getByLabelText("Compare model A") as HTMLSelectElement).value).toBe("es");
    expect((screen.getByLabelText("Compare model B") as HTMLSelectElement).value).toBe("nx");

    const table = screen.getByRole("table");
    expect(within(table).getByText("Lexus ES")).toBeTruthy();
    expect(within(table).getByText("Lexus NX")).toBeTruthy();
    expect(within(table).getByText("221 hp")).toBeTruthy();
    expect(within(table).getByText("240 hp")).toBeTruthy();
    expect(
      screen.getByText("Side-by-side specifications for Lexus ES and Lexus NX"),
    ).toBeTruthy();
  });

  it("notifies when either model picker changes", () => {
    const onChangeLeft = vi.fn();
    const onChangeRight = vi.fn();

    render(
      <CompareTable
        vehicles={vehicles}
        leftId="es"
        rightId="nx"
        onChangeLeft={onChangeLeft}
        onChangeRight={onChangeRight}
      />,
    );

    fireEvent.change(screen.getByLabelText("Compare model A"), {
      target: { value: "rx" },
    });
    fireEvent.change(screen.getByLabelText("Compare model B"), {
      target: { value: "lx" },
    });

    expect(onChangeLeft).toHaveBeenCalledWith("rx");
    expect(onChangeRight).toHaveBeenCalledWith("lx");
  });
});
