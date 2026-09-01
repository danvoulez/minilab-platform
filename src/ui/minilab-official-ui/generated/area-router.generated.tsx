/* AUTO-GENERATED from 32.runtime-bindings.yaml. Do not edit manually. */
import type { GeneratedAreaId } from "./types.generated";
import type { PreviewApi } from "../areas/use-preview";
import { PlaceholderPage } from "../areas/placeholder";
import { EveFrame } from "../components/eve-frame";
import { AgentsPage } from "../areas/agents";
import { ConnectionsPage } from "../areas/connections";
import { CostsPage } from "../areas/costs";
import { DocsPage } from "../areas/docs";
import { FinanceiroPage } from "../areas/financeiro";
import { GatesPage } from "../areas/gates";
import { GhostsPage } from "../areas/ghosts";
import { HumanPage } from "../areas/human";
import { KnowledgePage } from "../areas/knowledge";
import { LabCalendarPage } from "../areas/lab-calendar";
import { LabConstructionPage } from "../areas/lab-construction";
import { LabRoutinePage } from "../areas/lab-routine";
import { LabTodayPage } from "../areas/lab-today";
import { LegalPage } from "../areas/legal";
import { LLMsPage } from "../areas/llms";
import { MachinesPage } from "../areas/machines";
import { PoliciesPage } from "../areas/policies";
import { ReceiptsPage } from "../areas/receipts";
import { RegistryPage } from "../areas/registry";
import { MilestonesPage, ResearchProfilePage, ShortTermPage } from "../areas/research-plan";
import { ReviewsPage } from "../areas/reviews";
import { RuntimesPage } from "../areas/runtimes";
import { SantoAndrePage } from "../areas/santo-andre";
import { SchedulesPage } from "../areas/schedules";
import { SecretsPage } from "../areas/secrets";
import { SensorsPage } from "../areas/sensors";
import { VendorsPage } from "../areas/vendors";
import { WorkordersPage } from "../areas/workorders";

export function GeneratedAreaRouter({ area, preview }: { area: GeneratedAreaId; preview: PreviewApi }) {
  switch (area) {
    case "lab-today":
      return <LabTodayPage preview={preview} />;
    case "lab-construction":
      return <LabConstructionPage preview={preview} />;
    case "lab-routine":
      return <LabRoutinePage preview={preview} />;
    case "lab-calendar":
      return <LabCalendarPage preview={preview} />;
    case "expedicoes":
      return <EveFrame path="/expedicoes" title="Expedições" frameClassName="min-h-[calc(100vh-120px)]" />;
    case "research-profile":
      return <ResearchProfilePage preview={preview} />;
    case "milestones":
      return <MilestonesPage preview={preview} />;
    case "short-term":
      return <ShortTermPage preview={preview} />;
    case "workorders":
      return <WorkordersPage preview={preview} />;
    case "receipts":
      return <ReceiptsPage preview={preview} />;
    case "ghosts":
      return <GhostsPage preview={preview} />;
    case "registry":
      return <RegistryPage preview={preview} />;
    case "sensors":
      return <SensorsPage preview={preview} />;
    case "knowledge":
      return <KnowledgePage preview={preview} />;
    case "docs":
      return <DocsPage preview={preview} />;
    case "human":
      return <HumanPage preview={preview} />;
    case "santo-andre":
      return <SantoAndrePage preview={preview} />;
    case "machines":
      return <MachinesPage preview={preview} />;
    case "runtimes":
      return <RuntimesPage preview={preview} />;
    case "llms":
      return <LLMsPage preview={preview} />;
    case "agents":
      return <AgentsPage preview={preview} />;
    case "research":
      return <PlaceholderPage area={area} />;
    case "benchmarks":
      return <PlaceholderPage area={area} />;
    case "code":
      return <PlaceholderPage area={area} />;
    case "reviews":
      return <ReviewsPage preview={preview} />;
    case "financeiro":
      return <FinanceiroPage preview={preview} />;
    case "costs":
      return <CostsPage preview={preview} />;
    case "vendors":
      return <VendorsPage preview={preview} />;
    case "legal":
      return <LegalPage preview={preview} />;
    case "policies":
      return <PoliciesPage preview={preview} />;
    case "gates":
      return <GatesPage preview={preview} />;
    case "secrets":
      return <SecretsPage preview={preview} />;
    case "connections":
      return <ConnectionsPage preview={preview} />;
    case "schedules":
      return <SchedulesPage preview={preview} />;
    case "analytics":
      return <PlaceholderPage area={area} />;
    case "settings":
      return <PlaceholderPage area={area} />;
    default:
      return <PlaceholderPage area={area} />;
  }
}
