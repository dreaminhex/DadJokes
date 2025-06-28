namespace DadJokes.Domain.Repositories;

using System.Net;
using System.Net.Http;
using System.Text.Json;
using DadJokes.Domain.Contracts;
using DadJokes.Domain.Entities;
using DadJokes.Domain.ValueObjects;
using DadJokes.Domain.Types;
using DadJokes.Domain.Utilities;
using Microsoft.Extensions.Logging;
using DadJokes.Domain.Exceptions;

/// <summary>
/// Concrete implementation of the IDadJokeRespository interface.
/// This class is responsible for fetching dad jokes from an external API.
/// </summary>
/// <param name="logger">Logger for logging information and errors.</param>
/// <param name="httpClient">HttpClient for making HTTP requests to the dad joke API.</param>
public class DadJokeRepository(ILogger<DadJokeRepository> logger, HttpClient httpClient) : IDadJokeRespository
{
    private readonly JsonSerializerOptions jsonSerializerOptions = new()
    {
        PropertyNameCaseInsensitive = true,
        DefaultIgnoreCondition = System.Text.Json.Serialization.JsonIgnoreCondition.WhenWritingNull
    };

    /// <inheritdoc/>
    public async Task<DadJoke> GetRandomJoke(CancellationToken cancellationToken = default)
    {
        try
        {
            logger.LogInformation("Fetching a random dad joke from the API.");
            var response = await httpClient.GetAsync("/", cancellationToken);
            response.EnsureSuccessStatusCode();
            var json = await response.Content.ReadAsStringAsync(cancellationToken);
            var joke = JsonSerializer.Deserialize<DadJoke>(json, this.jsonSerializerOptions);
            return joke ?? throw new JokeApiException($"Failed to deserialize the joke response: {json}");
        }
        catch (Exception ex)
        {
            logger.LogError(ex, "Error fetching random dad joke.");
            throw new JokeApiException("An error occurred while getting a random joke.", ex);
        }
    }

    /// <inheritdoc/>
    public async Task<Dictionary<JokeLength, List<DadJoke>>> SearchJokesAsync(string searchTerm, int maxNumber = 30, CancellationToken cancellationToken = default)
    {
        var allJokes = new List<DadJoke>();

        // Api spec allows pagination, and defaults to page 1.
        int page = 1;

        // Api spec allows a maximum of 30 jokes per page, so we need to limit the number of jokes we fetch if maxNumber is greater than 30.
        int pageSize = maxNumber > 30 ? 30 : maxNumber;

        logger.LogInformation("Searching for jokes with term '{SearchTerm}' up to a maximum of {MaxNumber} jokes.", searchTerm, maxNumber);

        try
        {
            // Loop through pages until we have enough jokes or there are no more pages.
            while (allJokes.Count < maxNumber)
            {
                logger.LogDebug("Fetching jokes from page {Page} with search term '{SearchTerm}'.", page, searchTerm);

                // Fetch jokes from the API with pagination.
                var response = await httpClient.GetAsync($"/search?term={WebUtility.UrlEncode(searchTerm)}&limit={pageSize}&page={page}", cancellationToken);
                response.EnsureSuccessStatusCode();

                var json = await response.Content.ReadAsStringAsync(cancellationToken);
                var jokeResponse = JsonSerializer.Deserialize<DadJokeSearchResponse>(json, this.jsonSerializerOptions);

                // Check if the response is null or if there are no results. If so, break the loop.
                if (jokeResponse?.Results == null || jokeResponse.Results.Count == 0)
                    break;

                allJokes.AddRange(jokeResponse.Results);

                logger.LogDebug("Fetched {Count} jokes from page {Page}. Total jokes collected: {TotalCount}.", jokeResponse.Results.Count, page, allJokes.Count);
                if (allJokes.Count >= maxNumber || page >= jokeResponse.TotalPages)
                    break;

                page++;
            }

            logger.LogDebug("Found {Count} jokes matching the search term '{SearchTerm}'. Grouping by joke length.", allJokes.Count, searchTerm);

            // Group jokes by their length using the Utilities.GetJokeLength method.
            // This will categorize jokes into Short, Medium, and Long based on the number of words in the joke text,
            // and return a dictionary where the keys are JokeLength and the values are lists of DadJokes.
            return allJokes
                .Take(maxNumber)
                .GroupBy(j => Utilities.GetJokeLength(j.Joke))
                .ToDictionary(g => g.Key, g => g.ToList());
        }
        catch (Exception ex)
        {
            logger.LogError(ex, "An error occurred while searching for jokes with term '{SearchTerm}'.", searchTerm);
            throw new JokeApiException("An error occurred while searching for jokes.", ex);
        }
    }
}
