# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

@AGENTS.md

## Что это

«Семейные рецепты» — приложение, куда семья загружает рецепты, планирует блюда по дням и
(позже) собирает список покупок. Подробный план и роадмап — в `PLAN.md` (живой документ,
держать в актуальном состоянии). Стек: **Next.js 16 (App Router, Turbopack) + React 19 +
TypeScript + Tailwind v4**, БД и хранилище фото — **Supabase**, хостинг — **Vercel**.

## Команды

```bash
npm run dev      # дев-сервер (Turbopack) на http://localhost:3000
npm run build    # продакшн-сборка (прогоняет TypeScript)
npm run lint     # ESLint
```

- **Тестов в проекте нет** (тестовый фреймворк не настроен). Проверка перед коммитом —
  `npm run build` (типы + сборка): основной способ убедиться, что код корректен.

### Supabase (БД)

CLI закреплён как dev-зависимость; вызывать через `npx supabase`. Проект уже слинкован.

```bash
npx supabase migration new <name>     # новый файл миграции в supabase/migrations/
"Y" | npx supabase db push            # применить миграции к удалённой БД
```

- **Важно:** в неинтерактивной оболочке `npx supabase ...` иногда «зависает» на выводе —
  кормить команды через stdin (`"Y" | npx supabase db push`).
- Новая миграция = файл `supabase/migrations/<timestamp>_<name>.sql` (timestamp больше
  предыдущего) + `db push`.

### Деплой

Push в `master` → **Vercel автоматически деплоит production** (GitHub-репо подключён к
проекту Vercel). Ручной деплой при необходимости: `npx vercel --prod`.

## Архитектура (Feature-Sliced Design)

Код в `src/` разложен по слоям FSD; импорт строго «сверху вниз»:

| Слой | Роль |
|------|------|
| `app/` | Роутер Next.js **и** app-слой FSD (root layout, `globals.css`). Файлы-роуты **тонкие**: рендерят компонент из `views` и обрабатывают Next-специфику (`await params`). |
| `views/` | Экраны. Это FSD-слой «pages», **переименован в `views`**, т.к. `src/pages` Next трактует как Pages Router. **Не создавать `src/pages`.** |
| `widgets/` | Композитные блоки (`app-shell` — шапка + нижняя навигация). |
| `features/` | Действия пользователя (`auth`, `manage-family-code`, `filter-recipes`, `edit-recipe`). |
| `entities/` | Бизнес-сущности (`recipe`). |
| `shared/` | Примитивы и утилиты (`ui/*`, `lib/*`). |

- У слайса публичный API через `index.ts` — импортировать через него (`@/features/auth`),
  не по внутренним путям. Алиас `@/*` → `src/*`.

## Модель безопасности (читать перед правками auth/данных)

**Клиент никогда не обращается в Supabase напрямую.** Любой доступ к БД/хранилищу идёт
через сервер (server actions и серверные компоненты) с **service-role** ключом, который
живёт только в серверном окружении.

- `shared/lib/supabase/server.ts` — ленивый admin-клиент (service-role, обходит RLS),
  помечен `import "server-only"`.
- На всех таблицах **включён RLS без политик** → прямой доступ с anon-ключа запрещён по
  умолчанию. Не добавлять разрешающих политик без необходимости.

### Авторизация семьи

- **Создание:** название + код **генерируется автоматически** (`shared/lib/auth/code.ts`,
  формат `XXXXX-XXXXX`), показывается один раз. **Вход — только по коду** (без названия).
- **Хеш кода — детерминированный HMAC-SHA256** с `CODE_PEPPER` → `families.code_hash` с
  **UNIQUE-индексом**. Детерминизм нужен для поиска семьи по коду; UNIQUE + retry в
  `features/auth` исключают дубли. **Не переходить на salted-хеш** — сломается поиск.
- **Код также хранится обратимо** (AES-256-GCM, ключ из `CODE_PEPPER`) в
  `families.code_encrypted`, чтобы показывать/копировать его в настройках
  (`features/manage-family-code`). Регенерация кода НЕ выкидывает вошедших участников
  (сессия привязана к `family_id`, не к коду).
- **Сессия** — JWT (`jose`, `SESSION_SECRET`) в HttpOnly-cookie: `shared/lib/auth/session.ts`
  (сервер) поверх `jwt.ts` (low-level, общий для сервера и proxy).
- **Защита маршрутов — `src/proxy.ts`** (в Next 16 `middleware` → `proxy`, рантайм nodejs).
  Без сессии → `/login`; с сессией на `/login` → `/`. Matcher исключает `/api`, статику, favicon.

## Данные

Таблицы (см. `supabase/migrations/`): `families`, `recipes`, `ingredients`, `meal_plan` +
приватный storage-бакет `recipe-photos`. «Мясное» — это **тег**, не отдельное поле;
фильтрация предполагается по приёму пищи, времени и тегам.

## Окружение и секреты

- Серверные env: `SUPABASE_URL`, `SUPABASE_SERVICE_ROLE_KEY`, `SESSION_SECRET`,
  `CODE_PEPPER`, `HEALTH_PING_SECRET`. Локально — `.env.local` (gitignored); в Vercel —
  заведены в **production**. Значения `.env.local` и Vercel должны совпадать (особенно
  `SESSION_SECRET` и `CODE_PEPPER` — иначе сессии/коды несовместимы между средами).
- Пароль БД Supabase — `supabase/.db-password` (gitignored).
- Новый серверный env нужно добавить и в `.env.local`, и в Vercel.

## Дизайн (жёсткое ограничение)

Только **4 цвета**, заданные как Tailwind v4 `@theme`-токены в `src/app/globals.css`:
`cream` `#F9F6F1` (фон), `ink` `#181B17` (текст), `terracotta` `#D07E42` (главный акцент),
`gold` `#B7AD76` (вторичный акцент). **Без градиентов.** Других цветов не добавлять;
допустимы только прозрачности этих четырёх (`bg-ink/5`, `border-gold/60` и т.п.).

## Грабли Next.js 16

- `params` в роут-компонентах — **Promise**, нужно `await` (см. `recipes/[id]`).
- `cookies()` из `next/headers` — **async**.
- Конвенция middleware заменена на **`proxy.ts`** с экспортом функции `proxy`.
- Tailwind v4 настраивается **в CSS** (`@theme` в `globals.css`), не через `tailwind.config`.
- Поля ввода/`select`/`textarea` — **16px** (`text-base`), иначе iOS зумит экран при фокусе.
- Перцептивная скорость: у динамических роутов есть `loading.tsx` со скелетонами. Новый
  динамический экран — добавляй свой `loading.tsx`.
