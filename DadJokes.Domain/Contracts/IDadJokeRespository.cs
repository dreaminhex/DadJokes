namespace DadJokes.Domain.Contracts;

using DadJokes.Domain.Entities;
using DadJokes.Domain.Types;

/// <summary>
/// Interface for the Dad Joke repository.
/// Provides methods to retrieve random jokes and search for jokes based on a search term.
/// </summary>
public interface IDadJokeRespository
{
    /// <summary>
    /// Gets a random joke.
    /// </summary>
    /// <returns>A task that represents the asynchronous operation. The task result contains a random dad joke.</returns>
    /// <exception cref="Exception">Thrown when an error occurs while fetching the joke.</exception>
    public Task<DadJoke> GetRandomJoke(CancellationToken cancellationToken = default);

    /// <summary>
    /// Searches for jokes that match the specified search term. Groups the jokes by their length (Short, Medium, Long).
    /// </summary>
    /// <param name="searchTerm">The term to search for in the jokes.</param>
    /// <param name="maxNumber">The maximum number of jokes to return.</param>
    /// <returns>A task that represents the asynchronous operation. The task result contains a dictionary where the keys are 
    /// JokeLength and the values are lists of DadJokes.</returns>
    /// <exception cref="Exception">Thrown when an error occurs while searching for jokes.</exception>
    public Task<Dictionary<JokeLength, List<DadJoke>>> SearchJokesAsync(string searchTerm, int maxNumber = 30, CancellationToken cancellationToken = default);
}
