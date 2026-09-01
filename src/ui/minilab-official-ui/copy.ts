import { GENERATED_PAGE_COPY } from "./generated/copy.generated";
import type { AreaId } from "./types";

export interface PageCopy {
  title: string;
  lede: string;
}

// Projection of 03.page-manifest.yaml. No handwritten page-copy mirror.
export const PAGE_COPY = GENERATED_PAGE_COPY as Record<AreaId, PageCopy>;
