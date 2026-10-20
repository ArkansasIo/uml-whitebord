export type LifecycleState = "created" | "starting" | "ready" | "stopping" | "stopped" | "failed";

const allowedTransitions: Readonly<Record<LifecycleState, readonly LifecycleState[]>> = {
  created: ["starting", "stopping", "failed"],
  starting: ["ready", "stopping", "failed"],
  ready: ["stopping", "failed"],
  stopping: ["stopped", "failed"],
  stopped: [],
  failed: ["stopping", "stopped"],
};

export class Lifecycle {
  #state: LifecycleState = "created";

  get state(): LifecycleState {
    return this.#state;
  }

  transition(next: LifecycleState): void {
    if (!allowedTransitions[this.#state].includes(next)) {
      throw new Error(`Invalid lifecycle transition: ${this.#state} -> ${next}`);
    }
    this.#state = next;
  }
}
