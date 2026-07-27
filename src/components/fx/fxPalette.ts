/**
 * Couleurs cyclées des nœuds lumineux (NeuralField, MadagascarField).
 * Chaudes (fx-*) + un vrai turquoise et un vrai violet : les « points
 * nuages » de la constellation cessent d'être uniformément orange.
 */
export const FX_NODE_COLORS = [
  "var(--color-fx-1)",
  "var(--color-accent-cool)",
  "var(--color-fx-4)",
  "var(--color-accent-cool-2)",
  "var(--color-fx-3)",
] as const;
