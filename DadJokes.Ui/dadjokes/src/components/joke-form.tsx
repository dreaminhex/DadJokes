import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useState } from "react"
import { getRandomJoke, searchJokes, type DadJoke, type JokeLength } from "@/lib/api"
import { GroupedJokeResults } from "./grouped-result"
import { motion } from "framer-motion"
import { IconCopy } from "@tabler/icons-react"

export function JokeForm({
  className,
  ...props
}: React.ComponentProps<"div">) {

  const [term, setTerm] = useState("")
  const [jokeResults, setJokeResults] = useState<Record<JokeLength, DadJoke[]> | null>(null)
  const [randomJoke, setRandomJoke] = useState<DadJoke | null>(null)
  const [error, setError] = useState("")
  const [copied, setCopied] = useState(false)

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
    jokeContent = (
      <div className="relative rounded-xl border border-border bg-card p-9 shadow-sm">
        <button
          onClick={() => {
            navigator.clipboard.writeText(randomJoke.joke)
            setCopied(true)
            setTimeout(() => setCopied(false), 1500)
          }}
          className="absolute top-3 right-3 text-muted-foreground hover:text-blue-500 hover:cursor-pointer transition"
          title="Copy to clipboard"
        >
          <IconCopy size={20} />
        </button>
        <blockquote className="text-2xl font-serif italic leading-relaxed text-center pr-5 w-full">
          <span className="text-4xl mr-1 align-top text-primary">“</span>
          {randomJoke.joke}
          <span className="text-4xl ml-1 align-bottom text-primary">”</span>
        </blockquote>
        {copied && (
          <span className="absolute bottom-2 right-3 text-xs animate-fade-in italic text-green-600">
            Copied to clipboard!
          </span>
        )}
      </div>
    )
  } else if (jokeResults) {
    jokeContent = <div className="max-h-[80vh] overflow-y-auto ">
      <GroupedJokeResults jokeResults={jokeResults} searchTerm={term} />
    </div>
  } else {
    jokeContent = <p className="text-muted-foreground text-center">When you are ready for the absolute apex of humor, your joke, or jokes will appear here.</p>
  }

  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      <Card className="overflow-hidden p-0">
        <CardContent className="grid p-0 md:grid-cols-[33%_67%] h-[85vh]">
          <div className="p-6 md:p-8">
            <form className="flex flex-col gap-6" onSubmit={handleSearch}>
              <div className="flex flex-col items-center text-center">
                <img src="src/assets/dad.png" alt="Dad Joke Logo" className="w-24 h-24 mb-4" />
                <h1 className="text-4xl font-bold mb-5">Welcome to Dad Jokes</h1>
                <p className="text-muted-foreground text-left">
                  Since you appear to be a person with a fine sense of humor, you may select one of our fine jokes at random, or feel free to search our collection.
                </p>
              </div>
              <Button onClick={handleRandom} className="w-full p-6 hover:bg-purple-600 hover:text-primary text-lg hover:cursor-pointer transition-colors">
                Just Give Me A Random Dad Joke!
              </Button>
              <div className="after:border-border relative text-center text-sm after:absolute after:inset-0 after:top-1/2 after:z-0 after:flex after:items-center after:border-t">
                <span className="bg-card text-muted-foreground relative z-10 px-2">
                  Or did you want to search for something specific?
                </span>
              </div>
              <div className="grid gap-3">
                <Label htmlFor="searchTerm" className="p-4">Enter Your Jokey Joke Terms</Label>
                <Input
                  id="searchTerm"
                  type="text"
                  placeholder="monty python"
                  className="w-full p-6 placeholder:text-zinc-500 placeholder:italic placeholder:text-lg text-lg"
                  value={term}
                  onChange={(e) => setTerm(e.target.value)}
                />
              </div>
              <Button type="submit" className="w-full p-6 hover:bg-purple-600 hover:text-primary text-lg hover:cursor-pointer transition-colors">
                Search for Dad Jokes
              </Button>
              {error && <div className="text-destructive text-sm">{error}</div>}
            </form>
          </div>
          <div className="bg-muted md:flex flex-col p-4 h-full">
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4 }}
            >
              {jokeContent}
            </motion.div>
          </div>
        </CardContent>
      </Card>
      <div className="text-muted-foreground *:[a]:hover:text-primary text-center text-xs text-balance *:[a]:underline *:[a]:underline-offset-4">
        This site is just for fun, and is powered by the real heroes behind <a href="https://icanhazdadjoke.com/" target="_blank" rel="noopener noreferrer">icanhazdadjoke.com</a>
      </div>
    </div>
  )
}
