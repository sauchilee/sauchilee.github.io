# Original Language Source Materials (Hebrew / Greek / Arabic) — Neo4j

**Status: IN PROGRESS — not presentable yet, not linked from the site's index.html.**

This folder is a recoverable backup of the working data behind a Neo4j graph
of original-language (Hebrew, Greek, Arabic) biblical source materials. It
holds the human-readable inputs only — never the Neo4j binary database
store itself (`.db` / `data/databases/...`), which isn't diffable and
shouldn't live in git.

## What's here

- `import/` — Cypher scripts (`.cypher`) and/or CSV files (`.csv`) used to
  build or reload the graph via `LOAD CSV` or `cypher-shell`. These are the
  recoverable source of truth: if the Neo4j Desktop install is lost, the
  graph can be rebuilt from these files.
- `schema.md` (added once the schema is known) — node labels, relationship
  types, and properties in use.

## Recovering the graph from these files

```
cypher-shell -u neo4j -p <password> -f import/<script>.cypher
```

or, for CSV-based loads, copy the CSVs into Neo4j's `import/` directory and
run the corresponding `LOAD CSV` statements in `import/<script>.cypher`.

## Copyright note

The ancient source texts (Hebrew Masoretic Text, Greek NT, Arabic
translations, etc.) are themselves public domain. However, if this data was
built from a *specific modern critical edition or licensed dataset* (e.g.
BHS, NA28/UBS5, STEP Bible, Logos/Accordance morphology exports), that
edition's apparatus, formatting, or morphological tagging may be under a
publisher's copyright even though the underlying ancient language isn't
copyrightable. Any such material will be flagged inline as it's added,
rather than committed as public content.
