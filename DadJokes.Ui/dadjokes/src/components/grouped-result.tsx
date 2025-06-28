import type { DadJoke, JokeLength } from "@/lib/api"
import { IconCopy } from "@tabler/icons-react"
import { useState, type JSX } from "react"
import { Badge } from "@/components/ui/badge"

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

export function GroupedJokeResults({ jokeResults, searchTerm }: Readonly<GroupedJokeResultsProps>) {
    const [copiedId, setCopiedId] = useState<string | null>(null)

    const handleCopy = (joke: string, id: string) => {
        navigator.clipboard.writeText(joke)
        setCopiedId(id)
        setTimeout(() => setCopiedId(null), 1500)
    }

    return (
        <div className="pr-4">
            {groupOrder.map((group, index) => {
                const jokes = jokeResults[group] ?? []

                return (
                    <div key={group}>
                        <Badge className={`text-2xl italic font-bold text-left ml-2 mb-4 ${index === 0 ? "mt-2" : "mt-4"} ${groupColors[group]}`}>
                           {groupTitles[group]}
                        </Badge>

                        {jokes.length === 0 ? (
                            <p className="text-muted-foreground italic text-lg pl-4 text-left">
                                Didn't find any {group.toLowerCase()} jokes about “{searchTerm}”.
                            </p>
                        ) : (
                            <div className="grid gap-4">
                                {jokes.map((joke) => (
                                    <div
                                        key={joke.id}
                                        className="relative rounded-xl border border-border bg-card p-5 shadow-sm"
                                    >
                                        <button
                                            onClick={() => handleCopy(joke.joke, joke.id)}
                                            className="absolute top-3 right-3 text-muted-foreground hover:text-blue-600 hover:cursor-pointer transition"
                                            title="Copy to clipboard"
                                        >
                                            <IconCopy size={18} />
                                        </button>
                                        <blockquote className="text-base font-serif italic leading-relaxed text-left pr-4 pb-1">
                                            <span className="text-3xl mr-0.5 align-top text-primary">“</span>
                                            <span className="text-2xl">{highlightTerm(joke.joke, searchTerm)}</span>
                                            <span className="text-3xl ml-0.5 align-bottom text-primary">”</span>
                                        </blockquote>
                                        {copiedId === joke.id && (
                                            <span className="absolute bottom-2 right-3 text-xs animate-fade-in italic text-green-600">
                                                Copied to clipboard!
                                            </span>
                                        )}
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                )
            })}
        </div>
    )
}

function highlightTerm(text: string, term: string): JSX.Element {
    if (!term) return <>{text}</>

    const regex = new RegExp(`(${term})`, "gi")
    const parts = text.split(regex)

    return (
        <>
            {parts.map((part, i) =>
                part.toLowerCase() === term.toLowerCase() ? (
                    <mark key={i} className="bg-yellow-300 border-2 rounded-sm pl-1 pr-1 text-black font-semibold">
                        {part}
                    </mark>
                ) : (
                    <span key={i}>{part}</span>
                )
            )}
        </>
    )
}
  
