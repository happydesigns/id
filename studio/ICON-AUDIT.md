# Studio icon audit

Checked against [official Iconify collection indexes](https://github.com/iconify/icon-sets/tree/master/json) on 2026-09-12. All resolved native and Studio mappings reference existing icons.

Native Nuxt UI mappings, Studio controls and gallery mappings are included. Set logos and third-party brand marks intentionally keep their own identity.

| Set | Studio roles in selected set | Lucide fallback |
| --- | ---: | --- |
| lucide | 107/107 | — |
| bootstrap | 105/107 | mountain, ferrisWheel |
| heroicons | 90/107 | plug, audio, dashboard, a11y, github, coffee, pin, pinOff, heading, radar, gitCommit, mountain, bike, laptop, trees, ferrisWheel, waves |
| iconoir | 95/107 | tablet, rotate, connect, plug, audio, changelog, inbox, chart, filePlus, radar, mountain, ferrisWheel |
| material | 100/107 | comparison, bank, shieldCheck, grid, github, filePlus, component |
| phosphor | 105/107 | radar, ferrisWheel |
| pixelarticons | 97/107 | rotate, brand, comparison, bank, shieldCheck, audio, arrowDownLeft, mountain, bike, ferrisWheel |
| remix | 101/107 | rotate, comparison, audio, mountain, ferrisWheel, waves |
| tabler | 105/107 | audio, ferrisWheel |

## Behavior

- Missing equivalents retain a semantically correct Lucide icon instead of an unrelated symbol.
- Heroicons has no thumbtack/pushpin equivalent; pin controls retain Lucide.
- Sets without a separate unpin glyph share the pin glyph, with pressed state and tooltip distinguishing the action.
- Example configuration objects read icons reactively, so switching sets updates mounted examples.
- Pack logos and sample strips in the selector intentionally stay fixed.
