// Re-export the graph's multimodal runner for backwards compatibility
// with existing code that calls `generateWithGroqVision`
export { runWithFallbackMultimodal as generateWithGroqVision } from "../graph";
