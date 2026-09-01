# Showcase — ajustes finais (a aplicar de uma vez)

Anotações a partir dos prints da `/#showcase`. A maioria são correções pontuais; nenhuma exige refactor.

---

## 1. Bugs de overflow / quebra (prioridade alta)

### 1.1 Pills quebrando em múltiplas linhas
- **Onde:** `GateDecisionCard` na Evidence family — pill `needs approval` quebrou em "needs" / "approval".
- **Causa:** `StatusPill` herda quebra de linha quando o container é apertado.
- **Fix:** adicionar `whitespace-nowrap` ao `StatusPill` em `components/status.tsx`.

### 1.2 Botões da `RegisterActions` quebrando em 2–3 linhas
- **Onde:** demo cards estreitos da Register family — `Salvar como ghost` virou 3 linhas, `Enviar ao gate` virou 2.
- **Fix:** `whitespace-nowrap` nos botões em `register/register-actions.tsx`.
- **Bônus:** o grupo pode virar `flex-wrap gap-2` pra quebrar entre botões, não dentro do botão.

### 1.3 Títulos truncados mid-word com "…" feio
- **Onde:** `ReceiptCard` ("lab-routine · backup ni…"), `GhostCard` ("manutenção se…"), `GateDecisionCard` ("workorder · restart la…").
- **Causa:** `truncate` (single-line ellipsis) em containers pequenos.
- **Fix:** trocar `truncate` por `line-clamp-2` nos títulos desses 3 cards, deixar `truncate` só em subtítulos/meta.
- **Alternativa:** aumentar largura mínima dos demos via responsive grid.

---

## 2. Layout / densidade

### 2.1 Demo grid 3-col aperta tudo
- **Onde:** todos os `Family`. Aposta fixa em `grid-cols-3`.
- **Fix:** `grid-cols-1 md:grid-cols-2 lg:grid-cols-3` na grid de `Family`. Em monitor mais estreito (laptop 13") os cards ficam cramped, é o que causa metade dos overflows acima.

### 2.2 `MissingFields (vazio)` parece órfão
- Demo card alto com 1 linha de texto centralizada. Visualmente desbalanceado.
- **Fix:** mesclar os 2 estados num único demo (`MissingFields · estados`) mostrando os dois lado a lado, ou centralizar verticalmente com `flex items-center`.

### 2.3 Demos com alturas muito desiguais
- `AttachmentDropzone` vs `BigComposer` (lado a lado) têm alturas bem diferentes.
- **Fix:** opcional — adicionar `h-full` nas demos pra equalizar com o vizinho mais alto. Ou aceitar como está (é honesto sobre o tamanho real do componente).

### 2.4 `PreviewHeader` solitário no demo
- Mostrar só o header sem body fica esquisito (parece quebrado).
- **Fix:** dar um body falso curto (1–2 fields) ou rotular como "header isolado, sem body".

---

## 3. Repetição

### 3.1 `LogLineShapePreview` aparece 2x
- Standalone na Register family **e** dentro do `AIProposalCard` logo abaixo.
- **Fix:** manter só o `AIProposalCard` (mais rico) ou marcar o standalone como "shape isolado".

### 3.2 `MissingFields` × 2 demos
- Ver 2.2 — mesclar.

### 3.3 `ReceiptCard ×2` redundante
- 2 receipts visualmente quase iguais.
- **Fix:** mostrar 1 receipt + 1 ghost lado a lado pra contrastar tons, ou só 1 receipt.

---

## 4. Hover / interação faltando

### 4.1 Demo cards não respondem ao hover
- O container `Demo` é puramente visual. Daria pra dar feedback sutil:
  - `hover:border-white/20`
  - micro-shadow ou ring
  - opacidade subindo na label `showcase`

### 4.2 `StatusPill` / `StatusDot` sem hover
- Correto — não são interativos. **Não mudar.**

### 4.3 `EntityCard` no showcase
- Já tem hover de fronteira no componente real, mas no contexto showcase as cards são clicáveis pra nada. Considerar `cursor-default` no showcase ou habilitar `onClick` que abre uma toast "showcase only".

### 4.4 Chips da `FamilyNav` (sticky)
- Funcionam mas falta micro-feedback ao trocar. Ver §5.

---

## 5. Animações finas faltando

### 5.1 Troca de family
- Hoje: render seco, sem transição.
- **Sugestão:** `transition-opacity duration-200` + um pequeno `translate-y-1` nos `Family` quando montam (motion não obrigatório — basta CSS `animation: fade-up`).

### 5.2 Hero entrando
- Estático. Dá pra um `fade-in` único de 250ms na primeira render.

### 5.3 `StatusDot` com `pulse`
- Já existe, só o tom `ok` usa. Confirmar que está perceptível (parece sutil demais nos prints, talvez aumentar opacidade do ping de 60→80%).

### 5.4 Hover de `EntityRow`
- Hoje só muda bg. Adicionar um `translate-x-[2px]` muito leve no hover dá sensação de "selecionável".

### 5.5 `Demo` card aparecendo
- Se for fazer, stagger curtinho (cada card +30ms) — opcional, beirando o decorativo. Só vale se for sutil.

---

## 6. Pequenos polimentos

### 6.1 `AIProposalCard` — espaço entre `Refinar / Salvar como ghost / Enviar ao gate`
- Está apertado no fim do card. Talvez `gap-3` em vez de `gap-2`.

### 6.2 `Timeline` no demo card mostra dots ligeiramente fora da linha vertical
- Verificar `-left-[5px]` no `StatusDot` da Timeline — talvez precise `-left-[5.5px]` ou `-left-1.5` puro.

### 6.3 `LogLineRecordCard` — sintaxe `dan register sensor:...`
- O `did` está em `text-neutral-500` (apagado), `what` em branco. Inverter? `did` (verbo) deveria ter mais peso visual que `what` ou empate. Avaliar.

### 6.4 `EvidenceBlock` grid `[120px_1fr]`
- Em cells com `digest` longo (`sha256:9b1c…f2a7`) o valor cabe, mas se a chave for muito longa (improvável), quebraria. Considerar `[minmax(96px,auto)_1fr]`.

### 6.5 Hero stats `+ placeholders` e `page_header_required …`
- Ficam quebrando feio em viewport menor. Reduzir `hint` ou esconder em md.

### 6.6 Footer
- "sidebar orients · middle operates · …" — está em inglês enquanto resto do showcase está em PT-BR. Padronizar (sugestão: manter em inglês pois são os "core principles" do README, mas marcar visualmente como citação/mantra).

---

## 7. Achados nas fotos faltantes (Shell + Layout)

### 7.1 Shell — contagem de componentes não bate
- Chip diz **"Shell · 8"** mas só 3 demos aparecem (`LeftRail`, `RailContext`, `ResizableLayout`).
- Os outros 5 (`MinilabOfficialUI`, `MinilabShell`, `LeftRailItem`, `RailCollapseButton`, `AreaRouter`) são wrappers/routers — não fazem sentido isolados.
- **Fix:** mudar o `count` da family `Shell` pra 4 e adicionar 1 demo simples do `RailCollapseButton` (botão expand/collapse). Os 4 puramente "estruturais" rotular como "internal · sem demo isolado" numa nota lateral.

### 7.2 Layout — `PageFrame` e `MiddlePanel` não têm demo
- Kicker lista 6 nomes, só 5 demos aparecem.
- Ambos são wrappers de espaçamento/scroll — demos pouco interessantes.
- **Fix:** ajustar count pra 6 mas adicionar 1 demo "PageFrame + MiddlePanel" mostrando o esquema de padding/scroll com um header + dois sections dentro. Vale como mini-página de exemplo.

### 7.3 Dead space em demos com componentes estreitos
- **Onde:** `LeftRail (preview render)` (max-w-260) e `RailContext (mini)` (max-w-220) — o demo card span-2/span-1 fica gigante e o componente "ilha" no canto esquerdo.
- **Fix:** envolver o conteúdo do `Demo` em `flex items-center justify-center` quando o componente tem `max-w-*`, ou trocar pra `place-items-center` no padding interno.

### 7.4 `ErrorState` span-1 sozinho na linha
- Title "Não conseguimos sincronizar este painel." quebra mid-word ("conseguimos" / "sincronizar") em card estreito.
- **Fix:** dar span-2 ao ErrorState OU encurtar o título. Span-2 é melhor — fica par com EmptyState/LoadingState/ErrorState formando uma linha de "estados" coerente.

### 7.5 `SectionCard` demo órfão
- Mesmo problema que §2.2 — content pequeno em demo alto.
- **Fix:** preencher SectionCard demo com 2–3 mini-rows de exemplo (StatusDot + label + meta) pra mostrar o uso real, não "Bloco neutro." só.

### 7.6 `LeftRail` preview corta em "Runtimes"
- Mostra 3 grupos mas o último item visível é "Runtimes" — não está claro se foi cortado ou se acaba ali.
- **Fix:** mostrar fade-out gradient no rodapé do FauxRail OU adicionar texto sutil "+3 grupos" no bottom. Indica honestamente que tem mais.

### 7.7 `StatusPill + StatusDot` demo com muito espaço vazio abaixo
- O conteúdo ocupa 1 linha; o demo card é tall (min-h-[120px]).
- **Fix:** já está coberto pelo §6 indireto, mas vale explicitar — usar `min-h` menor (80px) quando o componente é de 1 linha, ou centralizar verticalmente.

### 7.8 ResizableLayout (concept) — colorização do diagrama
- Sidebar azul / middle neutro / preview violeta funciona como mnemônico.
- **Sugestão extra:** adicionar legenda discreta abaixo das 3 caixas com o token de cor usado em cada papel. Reforça a linguagem visual.

---

## 8. Plano de execução (quando você der OK)

Ordem sugerida pra aplicar tudo num único patch:

1. **Quebra textual** — `whitespace-nowrap` em StatusPill + RegisterActions buttons. [§1.1, §1.2]
2. **Truncate → line-clamp** em títulos de Receipt/Ghost/GateDecisionCard. [§1.3]
3. **Grid responsivo** no `Family` da showcase. [§2.1]
4. **Mesclar demos repetidos** (MissingFields, LogLineShapePreview, ReceiptCard×2). [§3]
5. **Centralizar demos com componente estreito** (FauxRail, RailContext). [§7.3]
6. **Ajustar spans** — ErrorState span-2; revisar SectionCard. [§7.4, §7.5]
7. **Completar demos faltantes** — RailCollapseButton, PageFrame+MiddlePanel. [§7.1, §7.2]
8. **Corrigir contagem** das chips (Shell, Layout). [§7.1, §7.2]
9. **Fade-out** no rodapé do FauxRail. [§7.6]
10. **Hover sutil** em Demo card + `translate-x` em EntityRow. [§4.1, §5.4]
11. **Fade-in** no Hero + transição na troca de family. [§5.1, §5.2]
12. **Polimentos** §6 (rápidos, em lote).

Tempo estimado: 1 passada concentrada.

Confirma que esse é o escopo e eu aplico tudo de uma vez.
