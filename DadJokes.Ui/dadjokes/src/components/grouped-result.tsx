import type { DadJoke, JokeLength } from "@/lib/api"

interface GroupedJokeResultsProps {
    jokeResults: Record<JokeLength, DadJoke[]>
}

export function GroupedJokeResults({ jokeResults }: Readonly<GroupedJokeResultsProps>) {
    const entries = Object.entries(jokeResults) as [JokeLength, DadJoke[]][]

    return (
        <div className="text-sm space-y-4 overflow-y-auto max-h-[300px]">
            {entries.map(([length, jokes]) => (
                <div key={length}>
                    <h3 className="text-md font-semibold mb-1">{length}</h3>
                    <ul className="list-disc list-inside text-muted-foreground">
                        {jokes.map((joke) => (
                            <li key={joke.id}>{joke.joke}</li>
                        ))}
                    </ul>
                </div>
            ))}
        </div>
    )
}
