import { useEffect, useMemo, useState } from "react";
import { PageFrame } from "../layout/page-frame";
import { PageHeader } from "../layout/page-header";
import { Section } from "../layout/section";
import { PAGE_COPY } from "../copy";
import {
  AlertRules,
  SensorAliveGrid,
  SensorConclusionPanel,
  SensorDataTable,
  SensorImportPanel,
  SensorIntelligencePanel,
  SensorList,
  SensorReadingCards,
  SensorSyncStatus,
  SensorToRegistryAction,
  SupabaseSyncPanel,
} from "../components/domain-composition";
import {
  STUB_SENSOR_CONCLUSIONS,
  STUB_SENSORS,
} from "./demo-data";
import type { Sensor } from "../types";
import type { PreviewApi } from "./use-preview";

export function SensorsPage({ preview }: { preview: PreviewApi }) {
  const copy = PAGE_COPY.sensors;
  const [selectedId, setSelectedId] = useState<string>(STUB_SENSORS[0]?.id);

  const selected = useMemo<Sensor | undefined>(
    () => STUB_SENSORS.find((s) => s.id === selectedId),
    [selectedId]
  );

  useEffect(() => {
    if (!selected) return;
    preview.open({
      kind: "sensor",
      id: selected.id,
      title: selected.name,
      subtitle: selected.kind,
      payload: selected,
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedId]);

  function selectSensor(s: Sensor) {
    setSelectedId(s.id);
  }

  const lastSync = useMemo(() => {
    const syncs = STUB_SENSORS.map((s) => s.last_sync ?? "")
      .filter(Boolean)
      .sort()
      .reverse();
    return syncs[0] ?? "—";
  }, []);

  const unregisteredCount = STUB_SENSORS.filter(
    (s) => s.registry_status !== "linked"
  ).length;

  return (
    <PageFrame>
      <PageHeader title={copy.title} lede={copy.lede} />

      <SensorIntelligencePanel conclusions={STUB_SENSOR_CONCLUSIONS} />

      <Section title="Liveness" hint="o que está vivo, silencioso, candidato a Registry ou ghost">
        <SensorAliveGrid sensors={STUB_SENSORS} />
      </Section>

      <Section title="Últimas leituras">
        <SensorReadingCards sensors={STUB_SENSORS} />
      </Section>

      <Section title="Lista" hint="todos os sensores observados">
        <SensorList
          sensors={STUB_SENSORS}
          selectedId={selectedId}
          onSelect={selectSensor}
        />
      </Section>

      <Section title="Tabela de dados" hint="visão tabular para inspeção">
        <SensorDataTable
          sensors={STUB_SENSORS}
          selectedId={selectedId}
          onSelect={selectSensor}
        />
      </Section>

      <Section title="Sync" hint="ingestão local + persistência online">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          <SensorImportPanel failedRows={0} />
          <SensorSyncStatus lastSync={lastSync} />
          <SupabaseSyncPanel lastSync={lastSync} />
        </div>
      </Section>

      <Section title="Ações & inteligência">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          <SensorToRegistryAction count={unregisteredCount} />
          <SensorConclusionPanel conclusions={STUB_SENSOR_CONCLUSIONS} />
          <AlertRules />
        </div>
      </Section>
    </PageFrame>
  );
}
