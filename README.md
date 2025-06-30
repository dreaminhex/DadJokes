# Dad Jokes Project

This is a fun little project that uses the [I Can Has Dad Joke API](https://icanhazdadjoke.com/api) to create random jokes, or perform searches for Dad Joke Material.

There are 2 parts to this project, the UI, and the API. You will need to run both for this to all work, but I've tried to make it very simple to do so.

## Steps

1. Pull or unzip the repository, whichever you prefer
1. Make sure you are in the `Dadjokes` folder
1. If you are on Windows, simply run `./go.ps1`
1. Browse to: [http://localhost:7879](http://localhost:7879)
1. Laugh (hopefully).

## Running the .NET API

```bash
dotnet run --project ./DadJokes.Api/DadJokes.Api.csproj
```

Swagger UI is available at: [http://localhost:7878](http://localhost:7878)

## Running the .NET Tests

```bash
dotnet test
```

## Running the UI

If you want to local UI to hit the local API, you'll need to add a `.env` file (or `.env.local`) under `DadJokes.Ui/dadjokes` and add the following entry to let Vite know to use the locally running API instead of using the production API.

```bash
VITE_API_URL=http://localhost:7878
```

Then, run:

```bash
cd DadJokes.Ui/dadjokes
npm run dev
```

## TL;DR; Version

I've published the Docker image on [fly.io](fly.io), and the UI is live on [Vercel](https://vercel.com/), hitting the fly.io image. So, you can really just go to:

[Dad Jokes App](https://dadjokes-ten-virid.vercel.app) and have some chuckles.

If you wanna see the Swagger docs, you can check out [https://dadjokes-w8kata.fly.dev/](https://dadjokes-w8kata.fly.dev/)

**Enjoy!**
