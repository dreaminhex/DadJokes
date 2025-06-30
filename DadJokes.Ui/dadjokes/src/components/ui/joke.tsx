import { IconCopy } from "@tabler/icons-react"
import { motion } from "framer-motion"
import { useState, type JSX } from "react"

type JokeProps = {
    key?: string,
    joke: string
    searchTerm?: string
}

function Joke({ key, joke, searchTerm }: Readonly<JokeProps>): JSX.Element {
    const [copied, setCopied] = useState(false)
    return (
        <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1.0 }}
            className="w-full"
        >      
        <div key={key} className="relative border-border border-2 rounded-xl bg-zinc-900 p-9 shadow-lg shadow-pink-900 w-full">
            <button
                onClick={() => {
                    navigator.clipboard.writeText(joke)
                    setCopied(true)
                    setTimeout(() => setCopied(false), 2500)
                }}
                className="absolute top-3 right-3 text-muted-foreground hover:text-blue-500 hover:cursor-pointer transition"
                title="Copy to clipboard"
            >
                <IconCopy size={24} />
            </button>
            <blockquote className="text-2xl font-serif italic leading-relaxed text-center pr-5 w-full">
                <span className="text-4xl mr-1 align-top text-primary">“</span>
                {searchTerm && (
                    <span className="text-2xl">{highlightTerm(joke, searchTerm)}</span>
                )}
                {!searchTerm && (
                    <span className="text-2xl">{joke}</span>
                )}
                <span className="text-4xl ml-1 align-bottom text-primary">”</span>
            </blockquote>
            {copied && (
                <span className="absolute bottom-2 bangers-regular right-3 text-sm animate-bounce text-green-600">
                    Copied to clipboard!
                </span>
            )}
        </div>
        </motion.div>
    )
}

export { Joke }

/**
 * Highlights the specified term in the given text.
 * @param text The text to search within.
 * @param term The term to highlight.
 * @returns A JSX element with the highlighted term.
 */
function highlightTerm(text: string, term: string): JSX.Element {
    if (!term) return <>{text}</>

    const regex = new RegExp(`(${term})`, "gi")
    const parts = text.split(regex)

    return (
        <>
            {parts.map((part, i) =>
                part.toLowerCase() === term.toLowerCase() ? (
                    <mark key={`term-part-key-${i}`} className="bg-yellow-300 border-2 rounded-sm pl-1 pr-1 ml-1 mr-1 text-black font-semibold">
                        {part}
                    </mark>
                ) : (
                    <span key={`term-part-key-${i}`}>{part}</span>
                )
            )}
        </>
    )
}
  