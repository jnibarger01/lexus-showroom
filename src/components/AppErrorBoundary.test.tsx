import { afterEach, describe, expect, it, vi } from "vitest";
import { cleanup, fireEvent, render, screen } from "@testing-library/react";
import AppErrorBoundary from "./AppErrorBoundary";

afterEach(() => {
  cleanup();
});

function Boom(): never {
  throw new Error("boom");
}

describe("AppErrorBoundary", () => {
  it("renders recovery UI when a child throws", () => {
    const onReload = vi.fn();
    const spy = vi.spyOn(console, "error").mockImplementation(() => {});

    render(
      <AppErrorBoundary onReload={onReload} homeHref="/lexus-showroom/#home">
        <Boom />
      </AppErrorBoundary>,
    );

    expect(screen.getByTestId("app-error-boundary")).toBeTruthy();
    expect(
      screen.getByRole("heading", {
        name: /showroom hit an unexpected error/i,
      }),
    ).toBeTruthy();

    fireEvent.click(screen.getByRole("button", { name: /reload page/i }));
    expect(onReload).toHaveBeenCalledTimes(1);

    spy.mockRestore();
  });

  it("renders children when there is no error", () => {
    render(
      <AppErrorBoundary>
        <p>All good</p>
      </AppErrorBoundary>,
    );
    expect(screen.getByText("All good")).toBeTruthy();
    expect(screen.queryByTestId("app-error-boundary")).toBeNull();
  });
});
