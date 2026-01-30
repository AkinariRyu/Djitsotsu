# Djitsotsu

Discord-клон з манга-стилем UI: авторизація, текстові/категорійні канали, приватні чати, ролі, нотифікації. Архітектура на мікросервісах.

## Вимоги

- **Node.js** LTS (v18+)
- **Yarn** 1.x (package manager)
- **Docker** та **Docker Compose**
- **Git**

## Перевірка середовища

```bash
node --version   # v20.x
yarn --version   # 1.22.x
docker --version
docker compose version
git --version
```

## Структура проєкту

```
├── gateway/          # API Gateway (NestJS)
├── users-service/    # Сервіс користувачів та авторизації
├── guilds-service/   # Сервіс серверів/гільдій та каналів
├── chat-service/     # Сервіс повідомлень
├── voice-service/    # Заглушка для голосових каналів
├── frontend/         # Next.js клієнт (манга-стиль)
└── infra/            # Docker, docker-compose, .env
```

## Порты

| Сервіс       | Порт  |
|-------------|-------|
| Frontend    | 4300  |
| Gateway     | 5400  |
| Users       | 5401  |
| Guilds      | 5402  |
| Chat        | 5403  |
| Voice       | 5404  |
| PostgreSQL  | 5543  |
| Redis       | 6390  |

## Початок роботи

1. Скопіювати `infra/.env.example` в `infra/.env`
2. Запустити інфраструктуру: `docker compose -f infra/docker-compose.yml up -d`
3. Встановити залежності: `yarn install`
4. Детальні інструкції будуть додані в наступних етапах

## Розробка

Проєкт використовує **Yarn** як основний package manager.
