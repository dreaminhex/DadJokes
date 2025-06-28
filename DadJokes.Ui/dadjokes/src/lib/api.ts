const API_URL = import.meta.env.VITE_API_URL ?? "http://localhost:7878";

export interface DadJoke {
    id: string;
    joke: string;
}

export type JokeLength = "Short" | "Medium" | "Long";

export async function getRandomJoke(): Promise<DadJoke> {
    const res = await fetch(`${API_URL}/random`);
    if (!res.ok) throw new Error("Failed to fetch random joke");
    return await res.json();
}

export async function searchJokes(term: string, max = 30): Promise<Record<JokeLength, DadJoke[]>> {
    const params = new URLSearchParams({ term, max: max.toString() });
    const res = await fetch(`${API_URL}/search?${params.toString()}`);
    if (!res.ok) throw new Error("Failed to search jokes");
    return await res.json();
}
