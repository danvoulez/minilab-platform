import spec from "./spec.json";
import type { AreaId, PreviewKind } from "../types";

export interface PageContract {
  page: string;
  title: string;
  layout: string;
  nav_group: string;
  components: string[];
  data: string[];
  preview: PreviewKind[];
  rules: string[];
}

export interface QualityRule {
  id: string;
  applies_to: string[] | "*";
  assertion: string;
}

export interface InteractionFlow {
  trigger: string;
  steps: string[];
  forbidden?: string[];
}

interface RawSpec {
  matrix: { matrix: PageContract[] };
  quality_rules: { rules: QualityRule[] };
  flows: { flows: Record<string, InteractionFlow> };
}

const SPEC = spec as unknown as RawSpec;

const BY_PAGE = new Map<string, PageContract>(
  SPEC.matrix.matrix.map((p) => [p.page, p])
);

const RULES_BY_ID = new Map<string, QualityRule>(
  SPEC.quality_rules.rules.map((r) => [r.id, r])
);

export function getPageContract(area: AreaId): PageContract | undefined {
  return BY_PAGE.get(area);
}

export function getRule(id: string): QualityRule | undefined {
  return RULES_BY_ID.get(id);
}

export const FLOWS = SPEC.flows.flows;

export const TOTAL_PAGES = SPEC.matrix.matrix.length;
