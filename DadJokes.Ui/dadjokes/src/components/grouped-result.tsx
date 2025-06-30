import type { DadJoke, JokeLength } from "@/lib/api"
import { Badge } from "@/components/ui/badge"
import { Joke } from "./ui/joke"

interface GroupedJokeResultsProps {
    jokeResults: Record<JokeLength, DadJoke[]>
    searchTerm: string
}

const groupOrder: JokeLength[] = ["Short", "Medium", "Long"]

const groupTitles: Record<JokeLength, string> = {
    Short: "Shorter Jokes",
    Medium: "Medium Jokes",
    Long: "Longer Jokes",
}

const groupColors: Record<JokeLength, string> = {
    Short: "bg-green-500",
    Medium: "bg-yellow-500",
    Long: "bg-red-500",
}

/**
 * Displays grouped joke results based on their length.
 * Each group contains jokes that match the specified search term.
 * @param param0 The grouped joke results and the search term.
 * @param param0.jokeResults The jokes grouped by length.
 * @param param0.searchTerm The search term used to filter jokes.
 * @returns A JSX element displaying the grouped joke results.
 */
export function GroupedJokeResults({ jokeResults, searchTerm }: Readonly<GroupedJokeResultsProps>) {
    return (
        <div className="flex-grow overflow-y-auto pr-4 min-h-0">
            {groupOrder.map((group, index) => {
                const jokes = jokeResults[group] ?? []
                return (
                    <div key={group}>
                        <Badge className={`text-2xl italic font-bold text-left ml-2 mb-4 bangers-regular pr-3 pl-3 ${index === 0 ? "mt-0" : "mt-6"} ${groupColors[group]}`}>
                            {groupTitles[group]} ({jokes.length})
                        </Badge>
                        {jokes.length === 0 ? (
                            <p className="text-zinc-300 bangers-regular text-xl pl-4 text-left">
                                Dangit. I couldn't find any {group.toLowerCase()} jokes about “{searchTerm}”.
                            </p>
                        ) : (
                            <div className="grid gap-8">
                                {jokes.map((joke) => (
                                    <Joke key={joke.id} joke={joke.joke} searchTerm={searchTerm} />
                                ))}
                            </div>
                        )}
                    </div>
                )
            })}
        </div>
    )
}