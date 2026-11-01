# arsenynn.com — Deep Research and Implementation Direction

## Executive verdict

**What the site should become:** a **quiet cinematic index that gradually unfolds into an authored archive**. The homepage should remain recognizably an index—not a feed, portfolio, dashboard, or immersive intro—but each destination should eventually open into a materially different “world.” The enduring structure is therefore **Index → World → Work → Relations**, with `@arsenynn` and the `NN` mark acting as the binding identity.

The current foundation is substantially better than the brief’s “redesign” framing might suggest. The live site already communicates one author/seven lines, exposes the important destinations without forcing disclosure, uses large readable mobile typography, keeps content separate from UI, and ships almost no client-side JavaScript.  The uploaded research brief correctly insists that this should evolve rather than be discarded. 

My central recommendation is **not to rebuild on Next.js, React, or a CMS**. Keep Astro, Git, static generation, ordinary CSS, and the low-JS philosophy. Astro already provides schema-validated content collections, multilingual routing, client-side view transitions when desired, and element persistence that can later support uninterrupted radio playback without turning the whole site into an SPA. 

The visual direction should be called **The Moving Index**:

> A rigid editorial shell whose content occasionally breaks the frame.

Most of the experience remains typographic, precise, almost still. Cinema appears through **duration, interruption, sequencing, cropping and scale changes**, not grain, letterboxing, fake timecode, glitch, or perpetual animation. This interpretation is consistent with the useful transferable qualities in Jarmusch—episodic structure, calibrated minimalism, editorial freedom—and Wong Kar-wai—memory, repetition, shifts between stillness and kinetic intensity—without copying their films. Criterion describes *Stranger Than Paradise* as master-shot vignettes with “perfectly calibrated minimalism”; Wong himself describes the productive balance between explosive movement and precise stillness in *In the Mood for Love*. 

The most consequential change from the current system should **not** be more effects. It should be a stronger publishing architecture. Telegram should remain a convenient **input**, but never become the canonical representation of the work. The correct model is **automatic import → normalized local draft → editorial/AI transformation → Git commit → publication**. Telegram’s Bot API can receive new and edited channel posts, but bot file downloads are currently capped at 20 MB, making a naïve Telegram-as-media-database architecture inappropriate for a future video-heavy archive. 

The timeless layer should be identity, URL structure, typography principles, grid, accessible semantics, content schemas, relations, and performance discipline. Motion, homepage features, crops, color events, transitions and individual project styling should be replaceable. That division is the best defense against a 2028–2031 redesign cycle.

**The strongest long-term proposition is therefore:**

**`@arsenynn` = an authored publishing system.
Homepage = index.
Projects = worlds.
Content = archive.
Connections = editorial, not algorithmic.
Technology = quiet infrastructure.**

## Current site audit and research dossier

### Current-site audit

There is an important documentation inconsistency to fix first: the repository README still says the site has not been published, while `https://arsenynn.com` is currently live and serves the seven-project index. The implementation-plan documentation likewise contains deployment-era notes that are now partly stale. Treat live production as truth and update the documentation before major implementation work. 

| Category             | Finding                                          | Verdict                                                      |
| :------------------- | :----------------------------------------------- | :----------------------------------------------------------- |
| **KEEP**             | Seven numbered worlds in a single coherent index | This is the right root metaphor. The current homepage already expresses parallel authorship rather than “social links.” |
| **KEEP**             | Direct project actions before `About`            | Excellent UX. Portfolio, Listen, Website and Telegram remain one tap away. The original brief explicitly requires this. |
| **KEEP**             | Content separated from components                | `projects.ts` and `site.ts` are already cleanly decoupled from layout. This is the right precursor to content collections. |
| **KEEP**             | Static-first Astro + minimal JS                  | Correct for this project’s ownership, performance and longevity constraints. |
| **KEEP**             | 17–18 px body, 15 px metadata, 48 px targets     | More mature than many “art” sites and consistent with the mobile-first brief. |
| **KEEP**             | Dark base with restrained red signature          | Current tokens `#0a0a0a / #f2f2f0 / #e5322d` are already close to the right behavioral system: neutral shell, red event. |
| **EVOLVE**           | Playfair Display                                 | It adds authorship but has become a familiar editorial shortcut. Replace it when content pages arrive, not immediately. |
| **EVOLVE**           | Pill action buttons                              | The current `999px` radius makes actions feel more like conventional product UI than an authored index. Preserve hit areas but progressively move visible treatment toward typographic/hairline actions. |
| **EVOLVE**           | Homepage hero                                    | It currently explains the taxonomy twice: “projects / channels / things”, “an index of parallel things”, then the seven-line sentence. Reduce explanation and increase identity. |
| **EVOLVE**           | Every project has broadly identical behavior     | Appropriate for MVP, but future project worlds need local visual grammars while retaining the global shell. |
| **EVOLVE**           | Dark-only `color-scheme`                         | The code currently declares dark mode only; future light mode needs a designed counterpart, not inversion. |
| **REMOVE later**     | “About” accordions once a world has real content | Progressive disclosure is useful now; once a project contains films/articles/archive, the accordion becomes redundant. |
| **DO NOT TOUCH YET** | Astro                                            | There is no demonstrated architectural reason to leave it.   |
| **DO NOT TOUCH YET** | GitHub Pages for the shell                       | It is adequate for the current static site, although its 1 GB published-site recommendation and soft 100 GB/month bandwidth limit mean it should not become the video store. |
| **DO NOT TOUCH YET** | Radio implementation                             | Integrate persistent playback only when the main site has multiple internal routes worth traversing. |
| **DO NOT TOUCH YET** | Search / graph visualization                     | There is not enough content yet to justify either.           |

### Research corpus

The research corpus should be read as **principles, not a style catalogue**. Award sites are especially useful for discovery but unreliable as UX standards; current Webby cultural-institution winners demonstrate breadth but do not establish that a visually spectacular interaction is appropriate for this project. 

| Reference                                                    | Useful lesson                                                | Risk / what not to copy                                      | Mobile / longevity              |
| :----------------------------------------------------------- | :----------------------------------------------------------- | :----------------------------------------------------------- | :------------------------------ |
| Criterion Collection — [https://criterion.com](https://criterion.com/) | Film + essays + archive can live in one system; rich film pages can pull related editorial content. | E-commerce density                                           | Strong / very high              |
| MUBI Creative Lab — [https://lab.mubi.com](https://lab.mubi.com/) | A film brand can support many changing identities without losing its institutional voice. | Too much campaign-specific visual borrowing                  | Strong / high                   |
| MUBI Notebook — https://mubi.com/notebook                    | Cinema as editorial culture rather than “streaming UI”       | Editorial density                                            | Strong / high                   |
| Khoj — [https://khojstudios.org](https://khojstudios.org/)   | Strict grid organizing a large artistic archive; type can become expressive inside an ordered system. | Scroll-reactive type as decoration                           | Good / high                     |
| Nordiska Museet — [https://nordiskamuseet.se](https://nordiskamuseet.se/) | Contemporary cultural interface with institutional clarity; 2025 Webby winner. | Museum tone                                                  | Strong / high                   |
| New Museum — [https://newmuseum.org](https://newmuseum.org/) | Program/archive coexistence                                  | Large institution complexity                                 | Strong / high                   |
| NTS — [https://nts.live](https://nts.live/)                  | Radio can be persistent infrastructure rather than a separate media page | Information density                                          | Excellent conceptually / high   |
| The Creative Independent — [https://thecreativeindependent.com](https://thecreativeindependent.com/) | Reading-led creator publishing, durable typography           | Less cinematic                                               | Strong / very high              |
| Are.na — [https://www.are.na](https://www.are.na/)           | Connections and resurfacing can create intellectual discovery without an algorithmic feed | Product-like taxonomy                                        | Strong / high                   |
| Serpentine — [https://serpentinegalleries.org](https://serpentinegalleries.org/) | Art, research, events, archive                               | Institutional complexity                                     | Good / high                     |
| CCA — [https://cca.qc.ca](https://cca.qc.ca/)                | Architecture archive and research as navigation model        | Deep taxonomy                                                | Good / very high                |
| Stedelijk — [https://stedelijk.nl](https://stedelijk.nl/)    | Identity consistency across changing cultural programs       | Museum-brand distance                                        | Good / very high                |
| Vitra Design Museum — [https://design-museum.de](https://design-museum.de/) | Editorial content + objects + exhibitions                    | Too institutionally structured                               | Good / high                     |
| MoMA — [https://moma.org](https://moma.org/)                 | Deep archival entities and cross-linking                     | Scale impossible to imitate                                  | Excellent / very high           |
| Actual Source — [https://actualsource.org](https://actualsource.org/) | Publishing identity can itself be the brand                  | Commerce-dominant                                            | Good / high                     |
| Apartamento — [https://apartamentomagazine.com](https://apartamentomagazine.com/) | Magazine voice stronger than interface tricks                | Lifestyle tone                                               | Good / high                     |
| 032c — [https://032c.com](https://032c.com/)                 | Editorial identity can accommodate culture, fashion, art     | Trend sensitivity                                            | Good / medium                   |
| The Gentlewoman — [https://thegentlewoman.co.uk](https://thegentlewoman.co.uk/) | Restrained typography + portrait editorial system            | Limited cross-media behavior                                 | Good / high                     |
| David Carson — [https://davidcarsondesign.com](https://davidcarsondesign.com/) | Authorship can override convention when there is deliberate intent | Legibility collapse if imitated literally. Carson is valuable as permission, not template. | Variable / historically durable |
| Emigre — [https://emigre.com](https://emigre.com/)           | Design can itself become editorial content; independent publishing can evolve with technology. | Deliberate typographic disruption                            | Archive-minded / very high      |
| Studio Feixen — [https://studiofeixen.ch](https://studiofeixen.ch/) | Strong identity systems can remain playful without becoming component-library UI. | Visual novelty                                               | Variable / high                 |
| Pentagram / Frank                                            | Classic newspaper grid can support personal long-form editorial voice. | Too newspaper-like for arsenynn                              | Good / high                     |
| Words of Type — [https://wiki.wordsoftype.com](https://wiki.wordsoftype.com/) | Multilingual architecture can be part of the content model, not an afterthought. | Encyclopedia tone                                            | Strong / high                   |
| Bruno Simon                                                  | Useful negative control: technically impressive interactive portfolios can foreground the interface over the author’s material. The FWA still highlights this class of highly interactive portfolio. | Exactly the “experience first” trap                          | Mixed / trend-sensitive         |

**Top references for arsenynn:** Criterion, MUBI Creative Lab/Notebook, Khoj, NTS, The Creative Independent, Are.na, Emigre, and CCA. They collectively cover cinema, editorial reading, archives, radio, authorial identity and meaningful connections without requiring a single dominant metaphor.

### Historical and cinematic transfer

Swiss modernism and Wim Crouwel contribute the **permanent scaffold**: grid, typographic hierarchy, disciplined repetition, and a system flexible enough to hold changing content. Crouwel’s Stedelijk work is especially relevant because one repeatable grid sustained radically different cultural material for decades. 

Saul Bass contributes a different lesson: identity can be compressed into **one unforgettable reduction**. The useful transfer is not “make title cards”; it is that the `NN` mark and `@arsenynn` wordmark should be strong enough to carry screen, favicon, credit, watermark and motion roles with very little decoration. MoMA’s archive shows Bass repeatedly working across posters, titles, albums and institutional graphics rather than treating each medium as a disconnected identity. 

Emigre, Brody and Carson contribute **controlled violation**. Their enduring lesson is not distressed typography; it is that a system becomes memorable when it occasionally refuses its own rules. Brody explicitly framed digital technology as a communication tool rather than a rigid doctrine, while Emigre’s publishing practice intertwined editorial position, type design and production technology. 

Jarmusch contributes the website’s **tempo**: discrete scenes, patience, episodic construction and omission. His description of editing as a process where the material eventually “tells” the editor how it should be shaped is a useful model for editorial curation: do not pre-build every world before enough material exists. 

Wong Kar-wai contributes **exception and memory**. His 2025 BFI interview contrasts Doyle’s improvised energy with Mark Lee Ping-bin’s precision and stillness, while earlier discussion of *In the Mood for Love* connects vivid color with remembered experience. That maps cleanly to arsenynn: neutral interface by default; intense color/motion only when the content demands it. 

## Creative direction and design system

### Three directions considered

| Direction            | Core idea                                                    | Strength                                              | Weakness                                                     | Five-year risk |
| :------------------- | :----------------------------------------------------------- | :---------------------------------------------------- | :----------------------------------------------------------- | :------------- |
| **The Moving Index** | Strict index interrupted by rare cinematic events            | Best synthesis of utility, authorship and scalability | Requires editorial restraint                                 | **Low**        |
| **Seven Rooms**      | Every project immediately becomes a dramatically distinct art direction | Maximum personality                                   | Fragments the umbrella identity and raises maintenance cost  | **High**       |
| **Continuous Film**  | The whole site behaves like a paced cinematic sequence       | Memorable first visit                                 | Poor repeat navigation, content discovery and mobile efficiency | **High**       |

**Choose The Moving Index.**

“Seven Rooms” misunderstands the brand architecture: seven independent aesthetics would eventually feel like seven unrelated microsites. “Continuous Film” confuses cinema with sequential presentation and would punish returning users. The Moving Index retains a legible permanent structure and allows each project to become distinctive **after entry**.

### Homepage behavior

The first mobile viewport should contain the `@arsenynn` wordmark, one sparse line—preferably **“seven parallel things by one author” / «семь параллельных вещей одного автора»**—and enough of project `01` to signal that scrolling enters an index. Remove one of the current duplicate descriptors. The existing site presently uses three separate introductory layers, which can be reduced without losing comprehension. 

The permanent homepage structure should become:

text

Copy

```text
identity / current state
editorial feature (0 or 1)
project index 01–07
recently published (max 3)
rediscovered from archive (max 1)
work / collaboration
footer
```

No infinite feed. The editorial feature is curated and replaceable. “Recently published” is factual. “Rediscovered” is deterministic editorial resurfacing, not engagement optimization.

### Typography

**Recommended system: Source Serif 4 + Manrope + custom wordmarks.**

Source Serif 4 is preferable to Playfair Display because it is built as a serious text family across sizes, supports Cyrillic and Greek, and is available as a variable web font.  Manrope provides a restrained contemporary sans with Cyrillic support and OFL licensing. 

Use the serif for titles, chapters, pull quotations and literary text; use Manrope for navigation, metadata, technical text and general UI. Long essays can use Source Serif 4 throughout. `@arsenynn` and `NN` remain artwork, not typeset substitutes.

Recommended scale:

| Token            |                  Mobile |                 Desktop |
| :--------------- | ----------------------: | ----------------------: |
| `--text-xs`      |              13px / 1.4 |                    13px |
| `--text-sm`      |             15px / 1.45 |                    15px |
| `--text-body`    |             18px / 1.58 |             19px / 1.58 |
| `--text-lead`    |              22px / 1.4 |                    26px |
| `--text-h3`      |  clamp(24px, 6vw, 32px) |                    34px |
| `--text-h2`      |  clamp(32px, 9vw, 48px) |                    60px |
| `--text-display` | clamp(46px, 14vw, 76px) | clamp(72px, 8vw, 128px) |

Long-reading measure: **62–68ch**, with literary essays toward 62ch and technical annFlow material toward 68ch.

### Color and theme

Keep the current basic tone but refine the system:

css

Copy

```css
--black:       #0A0A0A;
--black-soft:  #111110;
--paper:       #F2F0EA;
--paper-bright:#FAF9F5;
--ink:         #171716;
--white:       #F4F3EF;
--muted-dark:  #9C9A94;
--muted-light: #6B6964;
--line-dark:   #292927;
--line-light:  #D8D5CE;
--red:         #D9322B;
--red-deep:    #B92420;
```

The precise accessible pairings should be checked in implementation rather than assuming every red/text combination passes. WCAG 2.2 remains the normative accessibility target and adds explicit minimum target-size and focus requirements. 

Light mode should be **warm paper**, not white inversion. Default shell follows `prefers-color-scheme`; project worlds may explicitly declare `theme: dark | light | system`, but text/background combinations remain project-independent accessibility tokens.

### Grid and rhythm

Mobile, 320–430 px: one content column; 20 px horizontal gutter at 320–390, 24 px at 414–430.

Tablet, 768–1023: 6-column grid, 24 px gutters.

Desktop, 1024+: 12-column grid, 32 px gutters, max page width 1280 px. Text columns remain deliberately narrower.

Project index desktop:

text

Copy

```text
cols 1–2     number / state
cols 3–8     title / description
cols 9–12    actions / live information
```

The system is allowed to break this grid for **media**, never for basic navigation.

Spacing base:

text

Copy

```text
4 / 8 / 12 / 16 / 24 / 32 / 48 / 64 / 96 / 144
```

The larger jumps are important. Cinematic rhythm will come more from **96–144 px silence** than from animated transitions.

### Media and motion

Photography modes should be semantically authored: `single`, `sequence`, `diptych`, `contact-sheet`, `full-bleed`, `small-in-void`. Do not expose generic “gallery grid” as the default content primitive.

Video uses poster-first loading. Inline previews may autoplay only when muted and `playsinline`; audible playback requires explicit user action. Browser autoplay policy generally allows muted media but blocks unsolicited audible media, and Safari likewise requires muted/no-audio content and `playsinline` for reliable inline autoplay. 

Default video:

html

Copy

```html
<video
  controls
  playsinline
  preload="metadata"
  poster="..."
>
```

Muted moving previews should load only after intersection with the viewport, and should stop outside it.

Motion rules:

- 120–220 ms for controls.
- 240–450 ms for page-level reveals.
- One major motion idea per page.
- No animation required to understand state.
- No scroll hijacking.
- No perpetual decorative movement.
- `prefers-reduced-motion` removes nonessential transitions. Astro’s client router already supports reduced-motion behavior for view transitions. 

## Information, content and technical architecture

### Information architecture for 2031

Use **one canonical slug per conceptual entity**, with language separated structurally.

text

Copy

```text
/
  editorial feature
  project index
  latest
  rediscovered

/en/
  English homepage

/arsenynn/
/arsenynn/chapters/[chapter]/
/arsenynn/works/[slug]/

/workflow/
/workflow/work/[slug]/

/bessmyslennost/
/bessmyslennost/entries/[slug]/

/without-streaming/
/without-streaming/archive/[slug]/

/annflow/
/annflow/projects/[slug]/
/annflow/notes/[slug]/

/party-protocol/

/travel-log/
/travel-log/places/[slug]/
/travel-log/stories/[slug]/

/archive/
/archive/[year]/
/topics/[topic]/

/en/... same semantic route model
```

Russian should remain the default unprefixed language because it is already the production language; English uses `/en/`. Astro supports configured default and non-default locale routing, and Google recommends mutually referencing alternate language versions through `hreflang`. 

Do **not** translate slugs independently at first. Stable shared slugs dramatically simplify cross-language linking, migration, canonical mappings and AI tooling.

### Content graph decision

Yes, create a graph **in the data model**, but do not initially render a visual graph.

Each work can include:

ts

Copy

```ts
project
type
themes[]
places[]
people[]
chapters[]
related[]
sourceIds[]
publishedAt
occurredAt?
language
translationOf?
```

This gives Criterion-like contextual relationships without committing to graph visualization; Criterion’s redesign explicitly used related editorial content around film entities. 

Surface only three forms initially:

**Related** — hand-authored semantic relationships.

**Elsewhere in arsenynn** — same place/person/theme across another project.

**From the archive** — resurfacing by editorial rule.

A visible graph becomes rational only when the corpus is large enough that relationships are difficult to perceive manually—roughly dozens of entities and several meaningful link types, not seven landing pages.

### Source of truth and Telegram

Use **Model C with project-specific exceptions from Model D**:

text

Copy

```text
Telegram
   ↓
ingestion script
   ↓
normalized staging object
   ↓
draft Markdown/MDX + assets
   ↓
AI transformations
   ↓
human/editorial approval
   ↓
Git main
   ↓
Astro build
```

Do not automatically mirror Telegram to production. Telegram’s API exposes both `channel_post` and `edited_channel_post`, so edits can be detected, but incoming updates are retained only temporarily and Bot API file download is limited to 20 MB. Those characteristics make it a good event source and poor archival source of truth. 

Recommended per-world behavior:

| World             | Telegram automation                                      |
| :---------------- | :------------------------------------------------------- |
| @arsenynn         | Import as draft; manual editorial publication            |
| workflow          | Import metadata only; portfolio work manually curated    |
| Бессмысленность   | High automation acceptable; preserve message identity    |
| Without Streaming | Metadata/now-playing separate from editorial archive     |
| annFlow           | Import as draft; transform to structured technical note  |
| Party Protocol    | No mirroring; site/product docs authoritative            |
| Travel Log        | Telegram only as capture inbox, never presentation model |

### Content model

Move from `src/data/projects.ts` toward Astro Content Collections once the first internal world goes live. Astro’s current content collections support glob/file loaders, schema validation and typed content access; they can also reference other collection entries. 

ts

Copy

```ts
type Locale = 'ru' | 'en';

type WorkType =
  | 'film'
  | 'photo-essay'
  | 'essay'
  | 'note'
  | 'chapter'
  | 'project'
  | 'radio-fragment'
  | 'place';

interface Work {
  id: string;
  slug: string;
  project:
    | 'arsenynn'
    | 'workflow'
    | 'bessmyslennost'
    | 'without-streaming'
    | 'annflow'
    | 'party-protocol'
    | 'travel-log';

  locale: Locale;
  type: WorkType;
  title: string;
  dek?: string;
  publishedAt: Date;
  occurredAt?: Date;
  status: 'draft' | 'published' | 'archived';

  themes: string[];
  places: string[];
  people: string[];
  related: string[];

  hero?: Media;
  media?: Media[];
  source?: {
    type: 'telegram' | 'manual' | 'import';
    id?: string;
    url?: string;
  };

  translationOf?: string;
  featured?: boolean;
}
```

No database is required yet. No Sanity, Payload, Directus, Tina, Decap or Keystatic should become mandatory now. Git and Markdown are unusually advantageous here because both the owner and AI agents can inspect, diff, modify, roll back and migrate the entire archive.

### Framework and hosting

**Framework:** stay on Astro 7.x. The repository currently uses Astro 7.4.4 and TypeScript 6.0.3. 

**Why not Next/Nuxt/SvelteKit:** all are competent, but none solves a current requirement better enough to justify a migration. The site is content-led and static-first, while Astro already supplies optional client navigation, i18n and persistent elements for the exact future radio requirement. 

**Hosting now:** GitHub Pages + DNS-only remains reasonable for HTML/CSS/images. It should not host the eventual video archive because Pages has repository/published-site and bandwidth limits. 

The repository’s report that Cloudflare proxy caused truncated responses in Russia is project-specific evidence rather than a universal Cloudflare property, so do **not** generalize it; simply keep DNS-only until a fresh Russia-network test demonstrates a reason to change it. 

### Video infrastructure

For **NOW**, use optimized self-hosted MP4 only for a small number of short works/previews, with posters and no aggressive preloading.

For **NEXT**, prefer **Kinescope as the first service to test from Russia** and **Mux as the strongest international developer experience**, but test both from actual Russian networks before committing. Kinescope currently has a free tier with up to 100 minutes stored and 200 GB monthly traffic, then a usage-based paid tier; Mux currently offers a free plan and 100,000 free monthly delivery minutes but limits free stored video count. 

Bunny Stream is economically attractive—currently storage begins around $0.01/GB, delivery around $0.005/GB and there is a $1 monthly minimum—but should likewise be network-tested before becoming critical infrastructure. 

RUTUBE can serve as a Russian-availability fallback or distribution copy and supports embeds up to 4K-quality parameters, but its branded iframe/player makes it a poor primary presentation layer for a highly controlled author site. 

Recommended architecture:

text

Copy

```text
NOW
poster + MP4 where necessary

NEXT
primary HLS/video API provider
+ optional Russian fallback copy

LATER
provider abstraction in content metadata:
provider: kinescope | mux | bunny | self
playbackId
fallbackUrl
poster
captions[]
```

Do not hard-code vendor URLs into page components.

### Radio

Do not introduce React or a global state framework. When persistent audio becomes useful, use a native `<audio>` element inside a global player, enable Astro’s `ClientRouter`, and use `transition:persist` to keep the media element alive between internal navigations. Astro explicitly supports persistent media/state across router navigations. 

Sound policy: **silent shell; sound only after explicit intent**. Without Streaming is the one place where audio can become persistent after pressing Play.

### Performance budget

Google currently classifies “good” Core Web Vitals as LCP ≤2.5 s, INP ≤200 ms and CLS ≤0.1 at the 75th percentile. arsenynn should target considerably better than the threshold because the static shell is simple. 

| Page type              |                   LCP target |   CLS |     INP |  Initial JS | Initial transfer excluding media |
| :--------------------- | ---------------------------: | ----: | ------: | ----------: | -------------------------------: |
| Shell / index          |                       ≤1.8 s | ≤0.03 | ≤150 ms | ≤30 KB gzip |                          ≤350 KB |
| Text / archive         |                       ≤2.0 s | ≤0.05 | ≤150 ms |      ≤40 KB |                          ≤500 KB |
| Image essay            |                       ≤2.2 s | ≤0.05 | ≤150 ms |      ≤50 KB |                  ≤800 KB initial |
| Video page before play |                       ≤2.2 s | ≤0.05 | ≤150 ms |      ≤60 KB |             ≤900 KB incl. poster |
| Video payload          | never part of initial budget |     — |       — |           — |        `preload="metadata"` only |

Font target: **≤120 KB WOFF2 total on first view**, preferably one sans subset + one serif subset; subsequent italic/weights lazy-loaded where possible.

## Claude Code implementation brief

The following can be handed directly to Claude Code.

**MISSION**

Evolve the existing `workflowarsenynn/arsenynn.com` repository into the first foundation of **The Moving Index**. Preserve the current production experience while introducing the architecture required for internal project worlds, bilingual content, archive relationships and future persistent radio. Do not rebuild as React/Next. Do not add decorative libraries.

**BEFORE CHANGING CODE**

Read:

text

Copy

```text
README.md
AGENTS.md
CLAUDE.md
docs/brief.md
docs/architecture.md
docs/design_research.md
docs/implementation_plan.md
src/data/*
src/components/*
src/styles/*
astro.config.mjs
package.json
```

Compare repository documentation against the actual live `https://arsenynn.com`; update stale deployment/status documentation.

**TARGET STACK**

text

Copy

```text
Astro 7
TypeScript
Astro Content Collections
Markdown / MDX only when component embedding is required
plain CSS
Source Serif 4 variable
Manrope variable
GitHub Actions
GitHub Pages for shell/static site
no UI framework
no Tailwind
no animation library
no client state library
```

Install only:

bash

Copy

```bash
npm install @fontsource-variable/source-serif-4
npm install @fontsource-variable/manrope
npm install -D @playwright/test @axe-core/playwright
```

Add Lighthouse CI only once performance checks run in CI:

bash

Copy

```bash
npm install -D @lhci/cli
```

Do not install GSAP, Framer Motion, React, Vue, Svelte or a CMS.

**FILES**

Create:

text

Copy

```text
src/content.config.ts
src/content/
  works/
    ru/
    en/
  pages/
    ru/
    en/

src/components/global/
  GlobalHeader.astro
  GlobalNav.astro
  GlobalFooter.astro
  NNMark.astro

src/components/content/
  ArticleHeader.astro
  MediaFigure.astro
  VideoPlayer.astro
  PhotoSequence.astro
  RelatedWorks.astro
  ProjectIdentity.astro

src/components/radio/
  PersistentPlayer.astro

src/layouts/
  BaseLayout.astro
  ProjectLayout.astro
  ReadingLayout.astro

src/lib/
  i18n.ts
  content.ts
  relations.ts
  seo.ts

scripts/telegram/
  ingest.ts
  normalize.ts
```

Retain the existing simple homepage components where they remain useful. Do not delete current assets or logo source files.

**CONTENT SCHEMA**

Implement schemas for `works` and `projectPages`. Every work must validate project, locale, status, dates, relations and media. Relationships must reference stable content IDs, never display titles.

Media schema:

ts

Copy

```ts
type Media = {
  kind: 'image' | 'video' | 'audio';
  src?: string;
  provider?: 'self' | 'kinescope' | 'mux' | 'bunny' | 'rutube';
  playbackId?: string;
  poster?: string;
  alt?: string;
  caption?: string;
  width?: number;
  height?: number;
  aspectRatio?: string;
  duration?: number;
  captions?: {
    locale: 'ru' | 'en';
    src: string;
  }[];
};
```

**ROUTES**

First implementation:

text

Copy

```text
/
/en/
/arsenynn/
/en/arsenynn/
/annflow/
/en/annflow/
/archive/
/en/archive/
```

Do not create empty pages for all seven projects. Enable a route only when enough real content exists.

Reserve the remaining slugs in the project registry.

**LANGUAGE**

Default locale: `ru`.

English: `/en/`.

Every localized page emits:

text

Copy

```text
canonical
hreflang ru
hreflang en
x-default -> Russian canonical
```

Missing translations should link to the available language version rather than silently showing mixed-language text.

**DESIGN TOKENS**

Replace Playfair with Source Serif 4. Keep existing colors during the first migration so typography/architecture changes can be reviewed independently. In a second commit introduce the revised warm-light tokens and refined red.

Do not change layout, fonts, colors and motion in one monolithic commit.

**INTERACTIONS**

Homepage remains fully usable without JavaScript.

Internal project pages use native links and browser navigation by default.

Do not enable global `ClientRouter` until persistent radio is implemented. When enabled, test history, focus restoration, analytics-free navigation, scroll restoration and reduced motion.

**MOTION**

No animation library.

CSS only.

Control transitions ≤220 ms.

Editorial reveals ≤450 ms.

Nothing animates indefinitely except content that is intrinsically moving media.

All behavior disabled or simplified under `prefers-reduced-motion`.

**ACCESSIBILITY PASS/FAIL**

Pass only if:

text

Copy

```text
HTML landmarks are semantic
all pages keyboard navigable
focus visible at all times
no hover-only information
all controls have accessible names
target area >= 44x44 CSS px where practical
200% browser zoom does not break layout
320px width has no horizontal overflow
all meaningful images have alt text
decorative marks use empty alt
video captions supported
autoplay video muted
no audible autoplay
reduced-motion mode works
axe has no serious/critical violations
```

WCAG 2.2 should be the conformance basis. 

**TELEGRAM PIPELINE**

Do not publish directly from incoming updates.

Pipeline:

text

Copy

```text
channel_post
→ verify allowed channel id
→ normalize text/entities/media metadata
→ create deterministic source ID:
   telegram:{channelId}:{messageId}
→ compare previous hash
→ write/update draft
→ create Git branch
→ commit draft
→ optional AI enrichment:
   title
   dek
   tags
   relationships
   translation draft
→ human/editor approval
→ merge
→ production build
```

`edited_channel_post` updates the existing draft/entity by source ID.

Deletion handling must be explicit: never automatically delete the canonical website copy merely because a Telegram message disappears.

Do not archive large video binaries through Bot API. Telegram currently limits Bot API file downloads to 20 MB. 

**SEO / OG**

Every content page:

text

Copy

```text
unique title
description
canonical
og:title
og:description
og:image
og:type
twitter:card
lang
hreflang
```

Generate OG images locally from the design system. No external rendering SaaS.

**TESTS**

Playwright viewport matrix:

text

Copy

```text
320x568
360x800
375x812
390x844
393x852
414x896
430x932
768x1024
1024x768
1440x900
```

Required flows:

text

Copy

```text
homepage direct actions
About expand/collapse
keyboard navigation
language switch
project route
archive route
related links
404
video play
reduced motion
light/dark system theme
```

Use axe within Playwright.

Lighthouse CI budgets:

text

Copy

```text
performance >= 95
accessibility >= 100
best-practices >= 95
SEO >= 95

LCP <= 2200ms lab target
CLS <= 0.05
total blocking time <= 150ms
initial JS <= 60KB gzip on any static content page
```

**DEPLOYMENT**

Keep GitHub Actions → GitHub Pages until a measured limitation appears. Do not place video assets in the Pages repository. GitHub documents a recommended 1 GB repository/site limit and a soft 100 GB/month bandwidth limit. 

Maintain Cloudflare DNS-only unless tests from Russian networks prove that proxying is reliable and useful.

**MIGRATION**

Use incremental production states:

text

Copy

```text
1. baseline tag existing production
2. documentation correction
3. typography branch
4. content collections with no URL changes
5. bilingual routing
6. first internal world
7. archive/relations
8. editorial homepage
9. Telegram draft importer
10. media layer
11. persistent radio
```

Never introduce two architectural migrations in one production deployment.

**ROLLBACK**

Before each phase:

bash

Copy

```bash
git tag production-phase-N
git push origin production-phase-N
```

Rollback is a normal Git revert/redeploy. Content migrations must remain filesystem-based until there is an independently justified reason for a database.

**ACCEPTANCE**

The implementation fails if:

text

Copy

```text
homepage requires JS for navigation
homepage becomes a feed
project actions are hidden behind disclosure
a new UI framework is introduced
Telegram becomes canonical storage
project pages are created without content
video blocks initial page render
audible media autoplays
mobile is a reduced desktop layout
any project loses global @arsenynn attribution
global shell becomes seven competing art directions
```

## Roadmap, risks and final evaluation

### Phases and resources

```
Nov 2026Nov 2026Nov 2026Nov 2026Dec 2026Dec 2026Dec 2026Dec 2026Jan 2027Jan 2027Jan 2027Baseline audit and docsTypography and token cleanupContent collectionsRU/EN routingFirst project worldArchive and relationsVideo abstractionHomepage editorial layerTelegram draft pipelineProvider/Russia testingPersistent radioAI editorial transformsMobile and accessibility QAPerformance and launch QAFoundationPublishingAutomationMediaQAarsenynn.com staged evolution


Show code
```

These are sequencing estimates, not a requirement to delay usable production releases. Every phase should end in a deployable state.

| Scope             |           Typical effort | People/tools                               | Result                                                       |
| :---------------- | -----------------------: | :----------------------------------------- | :----------------------------------------------------------- |
| **NOW / small**   |        2–4 focused weeks | owner + AI coding agent                    | Cleaner current index, fonts/tokens, docs, schemas           |
| **NEXT / medium** |       6–10 focused weeks | owner + AI; occasional design/video QA     | First real world, RU/EN, archive, relations, Telegram drafts |
| **LATER / large** | 3–6 months incrementally | owner + AI + occasional specialist testing | Multiple worlds, scalable video, radio persistence, mature archive |

This is deliberately incremental; building all seven worlds immediately would violate the existing project’s own sound “no speculative engineering” principle. 

### NOW / NEXT / LATER

**NOW:** preserve the site. Correct stale documentation, test real iPhones and Russian networks, reduce hero explanation, refine action styling, establish the Source Serif 4 + Manrope typography branch, build content schemas, and create production performance/accessibility baselines.

**NEXT:** build only one full project world first. My choice is **@arsenynn**, not annFlow: the main authorial line forces the system to solve film, chapters, images, text and identity—the difficult universal problems. Then build annFlow to test the same shell against technical information. Add RU/EN, archive relations, editorial homepage states and Telegram→draft ingestion.

**LATER:** Without Streaming persistent playback, large video provider, automated resurfacing, richer Travel Log place relationships, search, and—only if content density proves useful—a visualized relationship graph.

### Main pitfalls and mitigations

| Risk                                               | Mitigation                                                   |
| :------------------------------------------------- | :----------------------------------------------------------- |
| “Experimental 10/10” becomes interface obscurity   | Experiment in composition/content sequencing, not navigation semantics |
| Seven worlds destroy brand unity                   | Fixed global shell, `NN` attribution, stable URL/interaction grammar |
| Cinematic becomes film clichés                     | Use time, spacing, interruption and scale; prohibit decorative cinema props |
| Telegram mirror degrades editorial quality         | Telegram = capture/import layer, Git = canonical publication |
| Archive becomes taxonomy bureaucracy               | Few controlled relationship fields; no giant tag cloud       |
| Light mode weakens identity                        | Warm-paper art direction rather than inversion               |
| AI-generated copy homogenizes voice                | AI drafts only; maintain project-specific copy constraints   |
| Video destroys performance                         | Poster-first, metadata preload, external media layer         |
| Award-site trend decay                             | Every interaction must retain value when animation is removed |
| CMS becomes maintenance burden                     | Filesystem content until a concrete editor workflow demands more |
| Free infrastructure becomes false economy          | Keep shell free; allow paid media only once media volume justifies it |
| Russia accessibility is assumed rather than tested | Maintain real device/network acceptance tests before adopting critical CDN/SaaS dependencies |

### Final voice examples

| World                               | RU                                                           | EN                                                           |
| :---------------------------------- | :----------------------------------------------------------- | :----------------------------------------------------------- |
| **@arsenynn**                       | Фильмы, главы и вещи, которые со временем складываются во что-то большее. | Films, chapters, and things that slowly become something larger. |
| **workflow@arsenynn**               | Видео на заказ — от первой мысли до последнего кадра.        | Commissioned moving image, from the first idea to the final frame. |
| **Бессмысленность и скоротечность** | Разговор и память. Некоторые вещи возвращаются позже.        | Conversation and memory. Some things return later.           |
| **Without Streaming**               | Личное радио. Эфир уже идёт.                                 | A personal radio station. It is already on air.              |
| **annFlow**                         | Системы, агенты и автоматизация для вещей, которые должны работать. | Systems, agents and automation for things that need to work. |
| **Party Protocol**                  | Независимый доступ через собственную инфраструктуру.         | Independent access on infrastructure of its own.             |
| **Travel Log**                      | Места, истории и то, что остаётся после дороги.              | Places, stories, and what remains after the journey.         |

### Final test

| Criterion           |     Score |
| :------------------ | --------: |
| Authorship          | **10/10** |
| Uniqueness          |  **9/10** |
| Memorability        |  **9/10** |
| Minimalism          | **10/10** |
| Elegance            |  **9/10** |
| Mobile usability    | **10/10** |
| Accessibility       |  **9/10** |
| Performance         | **10/10** |
| Editorial strength  | **10/10** |
| Cinematic quality   |  **9/10** |
| Maintainability     | **10/10** |
| Scalability         |  **9/10** |
| Five-year longevity | **10/10** |

The scores below ten are intentional constraints rather than defects. Maximum visual uniqueness would require more interface novelty and would damage usability; maximum cinematic intensity would turn the site into a film simulation; maximum scalability would require infrastructure that the current amount of content does not justify.

The decisive principle is therefore not “make it more designed.” It is:

> **Build a rigid enough system that unusual work can happen inside it without the site itself becoming noisy.**

That is what makes the proposal likely to survive through 2031: the index, authorship, semantic archive, typography, URLs and content ownership remain stable, while the moving surface—the film, image, rhythm, feature and individual project worlds—can keep changing.

All web sources were accessed **November 1, 2026**. Current technical recommendations rely primarily on official Astro, W3C, Google, Apple, Telegram, GitHub and provider documentation; design-history judgments rely principally on original institutions, studios, archives and established cultural sources rather than trend galleries. 