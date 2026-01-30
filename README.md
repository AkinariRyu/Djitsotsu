# Djitsotsu

Discord-клон з манга-стилем. Мікросервісна архітектура.

## Структура

```
├── services/          # Мікросервіси (NestJS)
│   ├── auth/          # Авторизація, JWT, профілі
│   ├── gateway/       # API Gateway, WebSocket
│   ├── chat/          # Повідомлення, історія чатів
│   ├── guilds/        # Сервери, канали, ролі
│   └── voice/         # Голосові канали (заглушка)
├── apps/
│   └── web/           # Next.js фронтенд
├── infra/             # Docker, docker-compose для локальної розробки
└── packages/          # Спільні пакети (опціонально)
```

## Вимоги

- Node.js 20+
- Yarn
- Docker & Docker Compose

## Запуск

```bash
# Копіювати конфіг
cp infra/.env.example infra/.env

# Підняти інфраструктуру
yarn docker:up
```

## Порти

| Сервіс    | Порт |
|-----------|------|
| Gateway   | 5400 (Swagger: /docs) |
| Auth      | 5401 |
| Guilds    | 5402 |
| Chat      | 5403 |
| Voice     | 5404 |
| Web       | 4300 |
| PostgreSQL| 5543 |
| Redis     | 6390 |
