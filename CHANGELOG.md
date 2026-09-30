# Changelog

All notable changes to this project are documented here. The format is based on
[Keep a Changelog](https://keepachangelog.com/en/1.1.0/), and this project
follows [Semantic Versioning](https://semver.org/).

## 2.0.0 (unreleased)

### Breaking

- Invalid input now throws a `TypeError`. 1.x returned an `Error` object instead.
- `candidates` must be an array of strings. 1.x accepted any object and converted items to strings.
- Only the package root can be imported. Deep imports such as `kor-string-similarity/strSeparator.js` no longer work.
- Node.js 22 or newer is required.

### Added

- TypeScript types (`Match` and all function signatures).
- Docstrings on every export, a README with API reference, and this changelog.

### Fixed

- Decomposed (NFD) Hangul, for example from macOS filenames, is normalized to NFC. It now scores the same as precomposed text. In 1.x, NFD "각" vs "각" scored 0.
- Characters outside the Basic Multilingual Plane, such as emoji, are compared as whole characters. In 1.x they were split into two UTF-16 halves, so different emoji could look partly alike.

### Changed

- Rewritten in TypeScript and compiled to CommonJS. Both `require` and ESM `import` work.
- The Dice coefficient is computed in linear time, and `arrangeBySimilarity`/`findBestMatch` process the target once per call. Scores for all other input are identical to 1.x.

## 1.0.1, 1.0.2 (2018-07-09)

- Patch releases published the same day as 1.0.0.

## 1.0.0 (2018-07-09)

- Initial release: `compareTwoStrings`, `findBestMatch` and `arrangeBySimilarity`.
