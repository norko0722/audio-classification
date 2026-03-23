# Frontend - Audio Genre Classification UI

Nuxt 3 + Vue 3 frontend pre projekt audio žánrovej klasifikácie. Umožňuje používateľovi:

- nahrať audio súbor,
- zobraziť detegovaný žáner a percentuálne rozdelenie,
- pozrieť si históriu klasifikácií,
- zobraziť RMS loudness graf a spektrogram.

## Tech stack

- Nuxt 3 (Vue 3, Composition API)
- TypeScript
- Tailwind CSS

## Štruktúra

```bash
frontend/
├── app/
│   ├── app.vue            # Root layout
│   ├── pages/             # Nuxt stránky (routing)
│   │   ├── index.vue      # Landing page
│   │   ├── classify.vue   # Hlavná stránka na klasifikáciu
│   │   ├── history.vue    # História klasifikácií
│   │   ├── sign-in.vue    # Prihlásenie
│   │   ├── sign-up.vue    # Registrácia
│   │   └── test.vue       # Testovacia stránka
│   ├── components/        # Zdieľané komponenty
│   │   ├── Header.vue
│   │   ├── Footer.vue
│   │   ├── Home.vue
│   │   ├── Upload.vue
│   │   ├── AudioUpload.vue
│   │   ├── Results.vue
│   │   └── AboutUs.vue
│   └── store/
│       └── user.ts        # Pinia store pre používateľa
├── public/                # Statické súbory (favicon, robots.txt)
├── nuxt.config.ts         # Konfigurácia Nuxt aplikácie
├── package.json           # Závislosti a skripty
└── tsconfig.json          # TypeScript konfigurácia
```

## Inštalácia

```bash
cd frontend
npm install
```

## Vývojový server

Spustí Nuxt dev server na `http://localhost:3000`:

```bash
npm run dev
```

## Build pre produkciu

```bash
npm run build
```

Lokalné preview produkčného buildu:

```bash
npm run preview
```

## Konfigurácia API

URL backendu (FastAPI) sa nastavuje v `nuxt.config.ts` (napr. prostredníctvom runtime config / env premenných). Uisti sa, že backend beží na rovnakej URL, akú používaš v API volaniach z komponentov (typicky `http://localhost:8000`).*** End Patch``` -->
