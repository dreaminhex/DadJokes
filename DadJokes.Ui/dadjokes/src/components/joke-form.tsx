
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { useState } from "react"
import { getRandomJoke, searchJokes, type DadJoke, type JokeLength } from "@/lib/api"
import { GroupedJokeResults } from "./grouped-result"
import { Joke } from "./ui/joke"
import { ScrollArea } from "./ui/scroll-area"
import { IconRotateClockwise } from "@tabler/icons-react"

export function JokeForm() {
  const [term, setTerm] = useState("")
  const [jokeResults, setJokeResults] = useState<Record<JokeLength, DadJoke[]> | null>(null)
  const [randomJoke, setRandomJoke] = useState<DadJoke | null>(null)
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false);

  const handleRandom = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    let loadingTimer: NodeJS.Timeout | null = null;
    loadingTimer = setTimeout(() => setLoading(true), 1000);

    try {
      const joke = await getRandomJoke();
      setRandomJoke(joke);
      setJokeResults(null);
    } catch {
      setError("Dangit, couldn't think of a random joke.");
    } finally {
      if (loadingTimer) clearTimeout(loadingTimer);
      setLoading(false);
    }
  };

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    let loadingTimer: NodeJS.Timeout | null = null;
    loadingTimer = setTimeout(() => setLoading(true), 1000);

    try {
      const results = await searchJokes(term);
      setJokeResults(results);
      setRandomJoke(null);
    } catch {
      setError("Provide a search term first, knucklehead.");
    } finally {
      if (loadingTimer) clearTimeout(loadingTimer);
      setLoading(false);
    }
  };
  

  // SonarQube HATES nested ternaries, so we use a more readable approach here.
  let jokeContent: React.ReactNode

  if (randomJoke) {
    jokeContent = <Joke joke={randomJoke.joke} />
  } else if (jokeResults) {
    jokeContent = <GroupedJokeResults jokeResults={jokeResults} searchTerm={term} />
  } else {
    jokeContent = <p className="text-zinc-400 text-center p-10 bangers-regular text-6xl">When you are ready for the absolute apex of humor, your joke, or jokes will appear here.</p>
  }

  return (
    <div className="lg:h-screen h-min-screen flex items-center justify-center overflow-hidden">

      <Card className="flex flex-col w-full max-w-screen-2xl mx-auto shadow-lg sm:mt-0 lg:rounded-xl overflow-hidden lg:border rounded-none border-0">
        <CardContent className="flex flex-col md:flex-row flex-1 p-0 min-h-0">
          <div className="w-full md:w-1/3 p-6 md:p-8 overflow-auto">
            <form className="flex flex-col gap-6" onSubmit={handleSearch}>
              <div className="flex flex-col items-center text-center">
                <img src="/assets/dad.png" alt="Dad Joke Logo" className="w-28 h-24 mb-4" />
                <h1 className="font-bold mb-5 bangers-regular text-4xl md:text-6xl text-blue-300">
                  Welcome to Dad Jokes</h1>
                <div className="border-t border-border lg:my-4 md:hidden" />
                <p className="text-muted-foreground text-left">
                  You are clearly a person with a fine sense of humor. You may select one of our outstanding dad jokes at random, or search our collection.
                </p>
              </div>
              <Button onClick={handleRandom} className="w-full bangers-regular p-6 bg-pink-700 text-zinc-200 hover:bg-purple-600 hover:text-primary text-lg hover:cursor-pointer transition-colors">
                Get a Random Dad Joke!
              </Button>
              <div className="after:border-border relative text-center text-sm after:absolute after:inset-0 after:top-1/2 after:z-0 after:flex after:items-center after:border-t">
                <span className="bg-card text-muted-foreground relative z-10 px-2">
                  Want something specific?
                </span>
              </div>
              <div className="grid">
                <p className="text-xl text-center mb-4 bangers-regular text-zinc-300">
                  Enter your joke search term below
                </p>
                <input
                  id="searchTerm"
                  type="text"
                  placeholder="Enter something silly, like 'hipster'..."
                  className="w-full border-border border-2 rounded-2xl p-3 placeholder:text-zinc-600 placeholder:italic bangers-regular text-xl"
                  value={term}
                  onChange={(e) => setTerm(e.target.value)} />
              </div>
              <Button type="submit" className="w-full bangers-regular p-6 bg-pink-700 text-zinc-300 hover:bg-purple-600 hover:text-primary text-lg hover:cursor-pointer transition-colors">
                Search for Dad Jokes
              </Button>
              <div className="text-red-500 justify-items-center text-center lg:h-10 h-6 p-0 m-0 text-xl bangers-regular">
                {error && <span>{error}</span>}
              </div>
            </form>
          </div>
          <ScrollArea className="bg-muted flex flex-col flex-grow p-4 lg:mr-8 rounded-2xl lg:w-full md:mx-0 mx-2 mt-2 md:min-w-0 max-h-[83vh]">
            {loading && (
              <div className="m-8 justify-center items-center flex">
                <IconRotateClockwise size={60} className="animate-spin inline mr-4 text-purple-500" />
                <span className="bangers-regular text-4xl inline-block">One second while we wake up our writers...</span>
              </div>
            )}
            {jokeContent}
          </ScrollArea>
        </CardContent>
        <CardFooter className="text-center justify-center bg-card flex flex-wrap border-t p-0 m-0">
          <p className="text-muted-foreground">Made with <span className="text-red-500 text-2xl pr-1 pl-1">♥</span> by <a href="https://www.dreaminhex.com" className="underline" target="_blank">dreaminhex</a> using jokes from the geniuses at <a href="https://icanhazdadjoke.com/" className="underline">icanhazdadjoke.com</a></p>
        </CardFooter>
      </Card>
    </div>
  )
}
