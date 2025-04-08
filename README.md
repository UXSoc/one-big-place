# One Big Place

## Setup (For Development)

1. Run `npm i` to install dependencies.
2. Duplicate .env.example and rename the duplicate to .env
3. Populate .env according to your workspace.
4. Run `npx prisma migrate dev` to create the database.
5. Run `npm run dev` to start the website.

By default, the website will be accessible at <https://localhost:3000/>.