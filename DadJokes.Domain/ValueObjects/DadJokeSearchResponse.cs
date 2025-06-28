namespace DadJokes.Domain.ValueObjects;

using System.Text.Json.Serialization;
using DadJokes.Domain.Entities;

/// <summary>
/// Represents the response from a search for dad jokes.
/// Contains pagination information and the list of jokes that match the search term.
/// </summary>
public class DadJokeSearchResponse
{
    /// <summary>
    /// Gets or sets the current page number of the search results.
    /// </summary>
    [JsonPropertyName("current_page")]
    public int CurrentPage { get; set; }

    /// <summary>
    /// Gets or sets the number of jokes returned per page in the search results.
    /// </summary>
    public int Limit { get; set; }

    /// <summary>
    /// Gets or sets the next page number in the search results.
    /// If there are no more pages, this will be 0.
    /// </summary>
    [JsonPropertyName("next_page")]
    public int NextPage { get; set; }

    /// <summary>
    /// Gets or sets the previous page number in the search results.
    /// </summary>
    [JsonPropertyName("previous_page")]
    public int PreviousPage { get; set; }

    /// <summary>
    /// Gets or sets the list of dad jokes that match the search term.
    /// </summary>
    public List<DadJoke>? Results { get; set; }

    /// <summary>
    /// Gets or sets the search term used in the search.
    /// </summary>
    [JsonPropertyName("search_term")]
    public required string SearchTerm { get; set; }

    /// <summary>
    /// Gets or sets the status of the search request.
    /// </summary>
    public int Status { get; set; }

    /// <summary>
    /// Gets or sets the total number of jokes that match the search term.
    /// </summary>
    [JsonPropertyName("total_jokes")]
    public int TotalJokes { get; set; }

    /// <summary>
    /// Gets or sets the total number of pages available for the search results.
    /// </summary>
    [JsonPropertyName("total_pages")]
    public int TotalPages { get; set; }
}
