namespace DadJokes.Domain.Utilities;

using DadJokes.Domain.Types;

public static class Utilities
{
    /// <summary>
    /// Determines the length of a joke based on the number of words in the joke text.
    /// </summary>
    /// <param name="text">The joke text to analyze.</param>
    /// <returns>A JokeLength enum value indicating whether the joke is Short, Medium, or Long.</returns>
    public static JokeLength GetJokeLength(string text)
    {
        var wordCount = text.Split(' ', StringSplitOptions.RemoveEmptyEntries).Length;

        return wordCount switch
        {
            < 10 => JokeLength.Short,
            < 20 => JokeLength.Medium,
            _ => JokeLength.Long
        };
    }
}
