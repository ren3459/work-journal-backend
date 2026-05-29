# Work Journal Backend

Backend API для журнала работ: записи журнала, справочник типов работ, пагинация, сортировка и валидация входящих данных.

## Стек

- **NestJS** - фреймворк для создания серверной части приложения. Помогает удобно организовать код и разделять логику по модулям.
- **Prisma** - используется для схемы базы, миграций и типизированной работы с PostgreSQL.
- **PostgreSQL** - реляционная база данных, в которой хранятся записи журнала и справочник типов работ
- **class-validator / class-transformer** - библиотеки для проверки и преобразования данных, которые приходят в API.
- **Docker Compose** - удобный запуск локальной PostgreSQL без ручной установки базы.

## Запуск

### 1. Установить зависимости

```bash
npm install
```

### 2. Запустить PostgreSQL

В папке `work-journal-backend` уже есть `docker-compose.yml` для базы.

```bash
docker compose up -d
```

По умолчанию будет создана база:

```text
host: localhost
port: 5432
database: work_journal
user: alice
password: secret
```

### 3. Создать `.env`

Создай файл `.env` в папке `work-journal-backend`:

```env
DATABASE_URL=postgresql://alice:secret@localhost:5432/work_journal
PORT=3000
```

### 4. Применить миграции Prisma

```bash
npx prisma migrate dev
```

Эта команда применит миграции из `prisma/migrations` и сгенерирует Prisma Client.

Если нужно только сгенерировать Prisma Client отдельно:

```bash
npx prisma generate
```

### 5. Запустить backend в режиме разработки

```bash
npm run start:dev
```

API будет доступен по адресу:

```text
http://localhost:3000
```

## Полезные команды

```bash
npx prisma studio
```

- `npx prisma studio` - открыть визуальный интерфейс для просмотра данных в базе.

## Остановка базы

```bash
docker compose down
```

Если нужно удалить данные PostgreSQL вместе с volume:

```bash
docker compose down -v
```
