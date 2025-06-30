
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { useState } from "react"
import { getRandomJoke, searchJokes, type DadJoke, type JokeLength } from "@/lib/api"
import { GroupedJokeResults } from "./grouped-result"
import { motion } from "framer-motion"
import { IconCopy } from "@tabler/icons-react"

export function JokeForm() {
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
      setError("Dangit, couldn't think of a random joke.")
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
      setError("Hey, provide a search term first, knucklehead.")
    }
  }

  // SonarQube HATES nested ternaries, so we use a more readable approach here.
  let jokeContent: React.ReactNode

  if (randomJoke) {
    jokeContent = (
      <div className="relative rounded-xl border border-border bg-card p-9 shadow-sm w-full">
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
    jokeContent = <div className="overflow-y-auto w-full">
      <GroupedJokeResults jokeResults={jokeResults} searchTerm={term} />
    </div>
  } else {
    jokeContent = <p className="text-zinc-200 text-center p-10 bangers-regular text-5xl">When you are ready for the absolute apex of humor, your joke, or jokes will appear here.</p>
  }

  return (
    <div className="min-h-screen flex items-center justify-center">
      <Card className="flex flex-col w-full max-w-screen-2xl mx-auto shadow-lg sm:mt-0 lg:rounded-xl overflow-hidden lg:border rounded-none border-0">

        <CardContent className="flex flex-col md:flex-row flex-1 p-0">
          <div className="w-full md:w-1/3 p-6 md:p-8 overflow-auto">
            <form className="flex flex-col gap-6" onSubmit={handleSearch}>
              <div className="flex flex-col items-center text-center">
                <img src="/assets/dad.png" alt="Dad Joke Logo" className="w-28 h-24 mb-4" />
                <h1 className="font-bold mb-5 bangers-regular text-4xl md:text-6xl text-blue-300">
                  Welcome to Dad Jokes</h1>
                <div className="border-t border-border lg:my-4 md:hidden" />
                <p className="text-muted-foreground text-left">
                  You are clearly a person with a fine sense of humor. You may select one of our fine jokes at random, or search our collection.
                </p>
              </div>
              <Button onClick={handleRandom} className="w-full bangers-regular p-6 bg-pink-500 text-zinc-200 hover:bg-purple-600 hover:text-primary text-lg hover:cursor-pointer transition-colors">
                Random Dad Joke!
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
                <Input
                  id="searchTerm"
                  type="text"
                  placeholder="Enter something silly, like 'hipster'..."
                  className="w-full p-6 placeholder:text-zinc-500 placeholder:italic placeholder:text-md text-xl"
                  value={term}
                  onChange={(e) => setTerm(e.target.value)}
                />
              </div>
              <Button type="submit" className="w-full bangers-regular p-6 bg-pink-700 text-zinc-300 hover:bg-purple-600 hover:text-primary text-lg hover:cursor-pointer transition-colors">
                Search for Dad Jokes
              </Button>
              {error && <div className="text-red-800 text-xl bangers-regular">{error}</div>}
            </form>
          </div>
          <div className="bg-muted flex flex-col p-4 overflow-auto lg:mr-6 rounded-2xl lg:w-full md:mx-0 mx-2 sm:m-5 md:min-w-0">
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4 }}
              className="flex-grow"
            >
              {jokeContent}
            </motion.div>
          </div>
        </CardContent>
        <CardFooter className="text-center justify-center bg-card flex flex-wrap p-0 border-t">
          <p className="text-muted-foreground">Made with <span className="text-red-500 text-xl">♥</span> by <a href="https://github.com/dreaminhex" className="underline">dreaminhex</a> using jokes from  <a href="https://icanhazdadjoke.com/" className="underline">icanhazdadjoke.com</a></p>
        </CardFooter>
      </Card>
    </div>
  )
}
