# Original Language Source Materials (Hebrew / Greek / Arabic) — Neo4j

**Status: IN PROGRESS — not presentable yet, not linked from the site's index.html.**

This folder is a recoverable, git-friendly mirror of the working data
behind a Neo4j graph of original-language (Hebrew, Greek, Arabic) biblical
source materials — verse text, translations, and word-level morphology.
It holds human-readable text (JSON Lines) only — never the Neo4j binary
database store itself (`.db` / `.dump`), which isn't diffable, is far too
large for git, and stays in Google Drive (`BibleKnowledge-backups/`)
instead.

## What's here

- `verses/` — one JSON Lines file per Bible book: original-language text
  (Hebrew/Aramaic/Greek), LXX Greek, KJV, BSB, and per-clause morphology
  with Strong's numbers. **63 of 66 books present** — see
  `verses/README.md` for the 3 still-missing books and why.
- `pilot11_clauses_phrases.jsonl` (pending transfer — see `verses/README.md`)
  — Genesis 1 clause/phrase syntax pilot data.
- `import/` — reserved for Cypher scripts (`.cypher`) and/or CSV files
  (`.csv`) if/when the graph's schema and load scripts are exported here
  too. Currently empty; the verse text in `verses/` is the recoverable
  content transferred so far.

## Recovering the full graph

The verse text here is a **read-only reference mirror**, not a database
backup — it can't be loaded back into Neo4j. The actual recoverable backup
of the live database is the `.dump` file in Google Drive's
`BibleKnowledge-backups/` folder (too large for git; restore via
`neo4j-admin database load`).

## Copyright note

The ancient source texts (Hebrew Masoretic Text, Greek NT, Arabic
translations, etc.) are themselves public domain. However, if this data was
built from a *specific modern critical edition or licensed dataset* (e.g.
BHS, NA28/UBS5, STEP Bible, Logos/Accordance morphology exports), that
edition's apparatus, formatting, or morphological tagging may be under a
publisher's copyright even though the underlying ancient language isn't
copyrightable. Any such material will be flagged inline as it's added,
rather than committed as public content.
