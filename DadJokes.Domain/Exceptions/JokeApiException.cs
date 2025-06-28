namespace DadJokes.Domain.Exceptions;

/// <summary>
/// Exception thrown when there is an error during the search for jokes.
/// This could be due to network issues, deserialization errors, or other unexpected conditions.
/// </summary>
/// <param name="message">The error message that describes the exception.</param>
/// <param name="inner">An optional inner exception that provides more details about the error.</param>
public class JokeApiException(string message, Exception? inner = null) : Exception(message, inner)
{
}
