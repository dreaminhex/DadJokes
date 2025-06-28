import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useState } from "react"
import { getRandomJoke, searchJokes, type DadJoke, type JokeLength } from "@/lib/api"
import { GroupedJokeResults } from "./grouped-result"

export function JokeForm({
  className,
  ...props
}: React.ComponentProps<"div">) {

  const [term, setTerm] = useState("")
  const [jokeResults, setJokeResults] = useState<Record<JokeLength, DadJoke[]> | null>(null)
  const [randomJoke, setRandomJoke] = useState<DadJoke | null>(null)
  const [error, setError] = useState("")

  const handleRandom = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    try {
      const joke = await getRandomJoke()
      setRandomJoke(joke)
      setJokeResults(null)
    } catch {
      setError("Couldn't fetch a random joke.")
    }
  }

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    try {
      const results = await searchJokes(term)
      setJokeResults(results)
      setRandomJoke(null)
    } catch {
      setError("Couldn't search for jokes.")
    }
  }

  // SonarQube HATES nested ternaries, so we use a more readable approach here.
  let jokeContent: React.ReactNode

  if (randomJoke) {
    jokeContent = <p className="text-center text-lg">{randomJoke.joke}</p>
  } else if (jokeResults) {
    jokeContent = <GroupedJokeResults jokeResults={jokeResults} />
  } else {
    jokeContent = <p className="text-muted-foreground text-center">Your joke will appear here.</p>
  }

  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      <Card className="overflow-hidden p-0">
        <CardContent className="grid p-0 md:grid-cols-2">
          <div className="p-6 md:p-8">
            <form className="flex flex-col gap-6" onSubmit={handleSearch}>
              <div className="flex flex-col items-center text-center">
                <h1 className="text-2xl font-bold">Hi There!</h1>
                <p className="text-muted-foreground text-balance">
                  You strike us as a person with a great sense of humor.
                </p>
              </div>
              <Button onClick={handleRandom} className="w-full">
                Just Give Me A Random Dad Joke!
              </Button>
              <div className="after:border-border relative text-center text-sm after:absolute after:inset-0 after:top-1/2 after:z-0 after:flex after:items-center after:border-t">
                <span className="bg-card text-muted-foreground relative z-10 px-2">
                  Or search for something specific?
                </span>
              </div>
              <div className="grid gap-3">
                <Label htmlFor="searchTerm">Enter a Search Term</Label>
                <Input
                  id="searchTerm"
                  type="text"
                  placeholder="monty python"
                  value={term}
                  onChange={(e) => setTerm(e.target.value)}
                />
              </div>
              <Button type="submit" className="w-full">
                Search for Dad Jokes
              </Button>
              {error && <div className="text-destructive text-sm">{error}</div>}
            </form>
          </div>
          <div className="bg-muted relative hidden md:flex md:flex-col md:justify-center p-6">
            <div className="bg-muted relative hidden md:flex md:flex-col md:justify-center p-6">
              {jokeContent}
            </div>
          </div>
        </CardContent>
      </Card>
      <div className="text-muted-foreground *:[a]:hover:text-primary text-center text-xs text-balance *:[a]:underline *:[a]:underline-offset-4">
        This site is just for fun, and is powered by the real heroes behind <a href="https://icanhazdadjoke.com/" target="_blank" rel="noopener noreferrer">icanhazdadjoke.com</a>
      </div>
    </div>
  )
}
