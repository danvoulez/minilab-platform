import {
  GENERATED_NAVIGATION,
  GENERATED_SHELL_IDENTITY,
} from "./generated/navigation.generated";
import type { NavGroup } from "./types";

// Runtime projection of 01.navigation.yaml. The left rail has no handwritten
// navigation copy anymore; changing the manifest and regenerating changes it.
export const NAVIGATION = GENERATED_NAVIGATION as unknown as NavGroup[];
export const SHELL_IDENTITY = GENERATED_SHELL_IDENTITY;
