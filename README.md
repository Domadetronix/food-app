# Семейные рецепты

Приложение для хранения семейных рецептов: загружаешь блюда, быстро выбираешь, что
готовить на завтрак/обед/ужин, и планируешь покупки. Подробный план — в [PLAN.md](PLAN.md).

## Стек

- **Next.js 16** (App Router, Turbopack) + **React 19** + **TypeScript**
- **Tailwind CSS v4** — тема в [src/app/globals.css](src/app/globals.css)
- **Supabase** (БД + хранилище фото) — подключается на Этапе 1
- Хостинг: **Vercel** (автодеплой из этого репозитория)

## Архитектура — Feature-Sliced Design

Слои в `src/` (импорт строго «сверху вниз»):

| Слой | Назначение |
|------|-----------|
| `app/` | роутер Next + app-слой (root layout, `globals.css`); роут-файлы тонкие |
| `views/` | экраны (FSD-слой «pages», переименован — `pages` занят Next) |
| `widgets/` | композитные блоки (`app-shell`) |
| `features/` | действия пользователя (`filter-recipes`, `edit-recipe`) |
| `entities/` | бизнес-сущности (`recipe`) |
| `shared/` | переиспользуемые примитивы (`ui`) |

У каждого слайса публичный API через `index.ts`. Алиас `@/*` → `src/*`.

## Команды

```bash
npm run dev     # дев-сервер на http://localhost:3000
npm run build   # продакшн-сборка
npm run lint    # ESLint
```

## Деплой

Подключён к Vercel: push в `master` → production-деплой, push в другие ветки → preview.

## Палитра (без градиентов)

`#F9F6F1` фон · `#181B17` текст · `#D07E42` главный акцент · `#B7AD76` вторичный акцент
