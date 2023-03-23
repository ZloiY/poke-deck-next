# PokeDeck App 

Another app where you can do different things with pokemons, bootstrapped with [T3 Stack](https://create.t3.gg/).

## The tech stack

- [Next.js](https://nextjs.org)
- [Prisma](https://prisma.io)
- [Tailwind CSS](https://tailwindcss.com)
- [tRPC](https://trpc.io)
- [Zod](https://zod.dev/)
- [ReactSpring](https://react-spring.dev/)
- [AutoAnimate](https://auto-animate.formkit.com/)
- [@use-gesture](https://use-gesture.netlify.app/)
- [jotai](https://jotai.org/)

## How to launch

First thing first you need to install npm deps via:

    npm install

Then you need to setup your `.env` by following `.env.example`.
Setup the `schema.prisma` file for the preferable db. In my example we will use `sqlite`.
To start using sqlite we need to do this change:

Remove

    shadowDatabaseUrl = env("SHADOW_DB_URL")
    relationMode      = "prisma"

Replace this

    provider          = "mysql"
with this

    provider          = "sqlite"

Also don't forget to create `db.sqlite` in `prisma/` directory.

Remove the `prisma/migrations/` and launch

    npx prisma migrate dev

And now you can run

    npm run dev
