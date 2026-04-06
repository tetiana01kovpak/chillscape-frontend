# ChillScape Frontend

ChillScape — це веб-застосунок для пошуку та перегляду локацій для подорожей. Користувач може
переглядати локації, фільтрувати їх, а після авторизації — залишати відгуки.

Frontend part of the ChillScape project built with Next.js.

## Tech Stack

### Frontend

- Next.js (App Router)
- React + TypeScript
- CSS Modules
- TanStack Query
- Axios

### Інше

- next/image — оптимізація зображень
- modern-normalize — базові стилі

## 📄 Сторінки

- `/` — головна сторінка
- `/login` — сторінка входу
- `/signup` — сторінка реєстрації
- `/locations` — список локацій
- `/locations/add` — додавання нової локації
- `/profile` — профіль користувача

## ⚙️ Запуск проєкту

Встановити залежності:

```bash
npm install

```

Запустити локально:

```bash
npm run dev

```

Зібрати production build:

```bash
npm run build

```

## ✨ Основний функціонал

- перегляд списку локацій
- фільтрація та пошук локацій
- перегляд детальної сторінки локації
- реєстрація та авторизація користувача
- додавання відгуків (для авторизованих користувачів)
- створення нових локацій
- адаптивна верстка (mobile / tablet / desktop)

## ⚙️ Особливості реалізації

- взаємодія з бекендом реалізована через внутрішні route handlers у `app/api`
- авторизація реалізована через HTTP-only cookies
- використано `next/image` для оптимізації зображень (lazy loading, responsive sizes)
- додано лоадери для сторінок і запитів
- обробка помилок через `error.tsx` та `not-found.tsx`

## 📁 Структура проєкту

app/

- (auth) — сторінки авторизації (login, register, logout)
- (main) — основні сторінки (locations, profile, add-review)
- @modal — модальні вікна
- api — запити до бекенду (route handlers)
- layout.tsx — основний layout
- error.tsx — обробка помилок
- not-found.tsx — 404 сторінка

components/ — компоненти інтерфейсу  
hooks/ — кастомні хуки  
lib/ — робота з API  
store/ — глобальний стан  
types/ — типи  
utils/ — допоміжні функції  
public/ — статичні файли
