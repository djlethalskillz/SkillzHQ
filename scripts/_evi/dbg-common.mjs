/** Shared helpers for debug probes. QA artifact only. */
export const settle = (ms = 400) => new Promise((r) => setTimeout(r, ms));
