# Dad Jokes Project

This is a fun little project that uses the [I Can Has Dad Joke API](https://icanhazdadjoke.com/api) to create random jokes, or perform searches for Dad Joke Material.

There are 2 parts to this project, the UI, and the API. You will need to run both for this to all work, but I've made it very simple to do so.

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

Swagger UI will be available at: [http://localhost:7878](http://localhost:7878)

## Running the .NET Tests

```bash
dotnet test
```

## Running the UI

```bash
cd DadJokes.Ui/dadjokes
npm run dev
```

## TL;DR; Version

I've published the Docker image on fly.io, and the UI is live on Vercel. So, you can really just go to:


