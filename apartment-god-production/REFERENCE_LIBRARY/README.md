# Apartment God Shared Reference Library

This folder is the shared visual reference handoff for the realistic cyberpunk upgrade of Apartment God Prototype.

Because the GitHub connector available in this chat can write UTF-8 text files but not raw binary images or ZIP files directly, the reference pack is stored here as base64 text chunks under `pack_base64/`. Agent/Codex should reconstruct it, unzip it, and then use the extracted folders as the common reference library for every art department.

Target extracted location:

```txt
apartment-god-production/REFERENCE_LIBRARY/
```

Required usage:

- The Art Bible chat must inspect this library before writing `00_ART_BIBLE/`.
- The Apartment, Male, Female, Dog, and Joint departments must inspect this library before creating their own production folders.
- The references are style and pose references only.
- Do not use watermarked/source reference images as final gameplay assets.
- Final production assets must be original PNGs, named correctly, and listed in department manifests.

Core style rule:

Realistic top-down linework, cyberpunk apartment tone, adult proportions, no chibi, no cute mascot style, no emoji body language.

Clothing rule:

Use clothing-neutral base sprites for now. Do not draw nude characters. Use simple fitted base clothing or safe mannequin-like linework with no explicit details so clothing variants can be added later.
