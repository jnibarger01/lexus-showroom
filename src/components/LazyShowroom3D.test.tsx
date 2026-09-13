import { afterEach, describe, expect, it, vi } from "vitest";
import { cleanup, fireEvent, render, screen, waitFor } from "@testing-library/react";
import LazyShowroom3D from "./LazyShowroom3D";
import { vehicles } from "../data/vehicles";

vi.mock("./CarShowroom3D", () => ({
  default: ({ vehicle }: { vehicle: { name: string } }) => (
    <div data-testid="mounted-3d">{vehicle.name} 3D mounted</div>
  ),
}));

afterEach(() => {
  cleanup();
  vi.restoreAllMocks();
});

describe("LazyShowroom3D", () => {
  it("keeps the 3D canvas unmounted until intent", async () => {
    render(<LazyShowroom3D vehicle={vehicles[0]} />);

    expect(screen.queryByTestId("mounted-3d")).toBeNull();
    expect(
      screen.getByRole("button", { name: /load 3d view/i }),
    ).toBeTruthy();

    fireEvent.click(screen.getByRole("button", { name: /load 3d view/i }));

    await waitFor(() => {
      expect(screen.getByTestId("mounted-3d")).toBeTruthy();
    });
  });

  it("mounts when the showroom enters the viewport", async () => {
    const observers: Array<{
      callback: IntersectionObserverCallback;
      disconnect: ReturnType<typeof vi.fn>;
    }> = [];

    class FakeIntersectionObserver {
      callback: IntersectionObserverCallback;
      disconnect = vi.fn();

      constructor(callback: IntersectionObserverCallback) {
        this.callback = callback;
        observers.push({ callback, disconnect: this.disconnect });
      }

      observe() {
        /* armed by test */
      }

      unobserve() {}
    }

    vi.stubGlobal("IntersectionObserver", FakeIntersectionObserver);

    render(<LazyShowroom3D vehicle={vehicles[0]} />);
    expect(screen.queryByTestId("mounted-3d")).toBeNull();
    expect(observers.length).toBe(1);

    observers[0].callback(
      [
        {
          isIntersecting: true,
          intersectionRatio: 1,
        } as IntersectionObserverEntry,
      ],
      observers[0] as unknown as IntersectionObserver,
    );

    await waitFor(() => {
      expect(screen.getByTestId("mounted-3d")).toBeTruthy();
    });
    expect(observers[0].disconnect).toHaveBeenCalled();
  });
});
