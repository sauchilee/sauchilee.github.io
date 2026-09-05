# Verse text export

Plain-text/JSON snapshot of verse original-language text and translations,
one file per Bible book (JSON Lines: one JSON object per line). This is a
git-friendly, human-readable mirror of the Neo4j graph's verse data —
unlike the Neo4j `.dump`, any text editor or a phone file viewer can open
these directly.

**Source:** exported from the live Neo4j graph via `ops/export_verse_text.py`
(desktop-side script) on 2026-09-05, then transferred here book-by-book from
Google Drive (`BibleKnowledge-text-export/verses/`).

**Status: 63 of 66 books present.** `2_John.jsonl`, `3_John.jsonl`, and the
sibling `pilot11_clauses_phrases.jsonl` (Genesis 1 clause/phrase syntax
pilot data, in `original-languages/`) are still only in that Drive folder —
they're small enough that the transfer tool returns them inline instead of
auto-saving to a verifiable file, and retyping ~40-90KB of base64 by hand is
too error-prone to risk on Bible text. **Fix:** have the export script
concatenate those into one combined file (or bump their size past the
threshold some other way) so a future fetch saves reliably, then add them
here the same way as the rest.

This is a read-only export for browsing/reference. It cannot be loaded back
into Neo4j and is not a substitute for the full database backup in
`BibleKnowledge-backups/` on Drive.

## Fields per verse record

`ref`, `book`, `chapter`, `verse`, `testament`, `book_order`,
`original_language`, `original_text`, `lxx_greek_text`, `kjv_text`,
`bsb_text`, `morphology_json`.

`original_text` holds Hebrew/Aramaic/Greek depending on `original_language`.
`morphology_json` is a per-clause array with `gloss`, `strongs`,
`transliteration`, and `morph_codes`.

## Copyright / license note

- **KJV text** and **Strong's numbering**: public domain.
- **BSB (Berean Standard Bible)**: released public-domain/CC0 by its
  publisher specifically to allow free reuse — safe to redistribute.
- **Morphology tagging** (the `morph_codes` / extended Strong's numbers like
  `H9009`, `G1487G`): the tagging scheme's shape (e.g. `HR`, `HNcfsa`,
  article-as-separate-morpheme, letter-suffixed Strong's numbers) matches
  STEPBible's TAHOT/TAGNT tagged texts, which STEPBible licenses CC BY 4.0
  for free reuse with attribution — but this is an inference from the data's
  shape, not a confirmed source. **Not yet verified against the actual
  export script/source used.** Flagging this for you to confirm before
  treating the morphology layer as fully cleared; the plain verse text
  (Hebrew/Greek/KJV/BSB) is fine regardless.

## Regenerating

```
NEO4J_PASSWORD=... .venv/bin/python ops/export_verse_text.py --out <dir>
```
