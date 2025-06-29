namespace DadJokes.Tests;

using System.Net;
using DadJokes.Domain.Entities;
using DadJokes.Domain.Exceptions;
using DadJokes.Domain.Repositories;
using DadJokes.Domain.ValueObjects;
using Microsoft.Extensions.Logging;
using Moq;
using Moq.Protected;
using System.Text.Json;

/// <summary>
/// Unit tests for the DadJokeRepository class.
/// Tests the functionality of retrieving random jokes and searching for jokes.
/// Includes tests for successful responses, deserialization failures, and HTTP errors.
/// </summary>
public class DadJokeRepositoryTests
{
    private static DadJoke GetSampleJoke() => new() { Id = "abc123", Joke = "Why don't skeletons fight each other? They don't have the guts." };

    private static DadJokeSearchResponse GetSampleSearchResponse()
    {
        return new DadJokeSearchResponse
        {
            SearchTerm = "calendar",
            Results =
            [
                new DadJoke { Id = "j1", Joke = "I'm afraid for the calendar. Its days are numbered." },
                new DadJoke { Id = "j2", Joke = "Why did the scarecrow win an award? Because he was outstanding in his field." }
            ],
            CurrentPage = 1,
            Limit = 2,
            TotalPages = 1
        };
    }

    private static HttpClient CreateMockHttpClient(HttpResponseMessage responseMessage)
    {
        var handlerMock = new Mock<HttpMessageHandler>(MockBehavior.Strict);
        handlerMock
            .Protected()
            .Setup<Task<HttpResponseMessage>>("SendAsync",
                ItExpr.IsAny<HttpRequestMessage>(), ItExpr.IsAny<CancellationToken>())
            .ReturnsAsync(responseMessage)
            .Verifiable();

        return new HttpClient(handlerMock.Object) { BaseAddress = new Uri("http://test") };
    }

    /// <summary>
    /// Tests that GetRandomJoke returns a joke when the API returns a valid response.
    /// This test verifies that the repository correctly deserializes the joke and returns it.
    /// </summary>
    [Fact]
    public async Task GetRandomJoke_ReturnsJoke_WhenApiReturnsValidResponse()
    {
        var joke = GetSampleJoke();
        var response = new HttpResponseMessage(HttpStatusCode.OK)
        {
            Content = new StringContent(JsonSerializer.Serialize(joke))
        };

        var httpClient = CreateMockHttpClient(response);
        var logger = Mock.Of<ILogger<DadJokeRepository>>();
        var repo = new DadJokeRepository(logger, httpClient);

        var result = await repo.GetRandomJoke();

        Assert.NotNull(result);
        Assert.Equal(joke.Id, result.Id);
    }

    /// <summary>
    /// Tests that GetRandomJoke throws a JokeApiException when the API response cannot be deserialized into a DadJoke.
    /// This test ensures that the repository handles deserialization errors correctly. 
    /// </summary>
    [Fact]
    public async Task GetRandomJoke_ThrowsJokeApiException_OnDeserializationFailure()
    {
        var response = new HttpResponseMessage(HttpStatusCode.OK)
        {
            Content = new StringContent("{}") // Invalid for DadJoke
        };

        var httpClient = CreateMockHttpClient(response);
        var logger = Mock.Of<ILogger<DadJokeRepository>>();
        var repo = new DadJokeRepository(logger, httpClient);

        await Assert.ThrowsAsync<JokeApiException>(() => repo.GetRandomJoke());
    }

    /// <summary>
    /// Tests that GetRandomJoke throws a JokeApiException when the API returns an error response.
    /// This test verifies that the repository correctly handles HTTP errors and throws the appropriate exception.
    /// </summary>
    [Fact]
    public async Task GetRandomJoke_ThrowsJokeApiException_OnHttpFailure()
    {
        var response = new HttpResponseMessage(HttpStatusCode.InternalServerError);

        var httpClient = CreateMockHttpClient(response);
        var logger = Mock.Of<ILogger<DadJokeRepository>>();
        var repo = new DadJokeRepository(logger, httpClient);

        await Assert.ThrowsAsync<JokeApiException>(() => repo.GetRandomJoke());
    }

    /// <summary>
    /// Tests that SearchJokesAsync returns grouped jokes when the API returns valid results.
    /// This test verifies that the repository correctly deserializes the search response and groups jokes by their IDs.
    /// </summary>
    [Fact]
    public async Task SearchJokesAsync_ReturnsGroupedJokes_WhenApiReturnsResults()
    {
        var response = new HttpResponseMessage(HttpStatusCode.OK)
        {
            Content = new StringContent(JsonSerializer.Serialize(GetSampleSearchResponse()))
        };

        var httpClient = CreateMockHttpClient(response);
        var logger = Mock.Of<ILogger<DadJokeRepository>>();
        var repo = new DadJokeRepository(logger, httpClient);

        var result = await repo.SearchJokesAsync("calendar");

        Assert.NotNull(result);
        Assert.Equal(2, result.Values.SelectMany(x => x).Count());
    }

    /// <summary>
    /// Tests that SearchJokesAsync throws a JokeApiException when the API response cannot be deserialized into a DadJokeSearchResponse.
    /// This test ensures that the repository handles deserialization errors correctly.
    /// </summary>
    [Fact]
    public async Task SearchJokesAsync_StopsWhenNoResults()
    {
        var emptyResponse = new DadJokeSearchResponse
        {
            SearchTerm = "noresults",
            Results = [],
            CurrentPage = 1,
            TotalPages = 1
        };

        var response = new HttpResponseMessage(HttpStatusCode.OK)
        {
            Content = new StringContent(JsonSerializer.Serialize(emptyResponse))
        };

        var httpClient = CreateMockHttpClient(response);
        var logger = Mock.Of<ILogger<DadJokeRepository>>();
        var repo = new DadJokeRepository(logger, httpClient);

        var result = await repo.SearchJokesAsync("noresults");

        Assert.Empty(result);
    }

    /// <summary>
    /// Tests that SearchJokesAsync throws a JokeApiException when the API returns an error response.
    /// This test verifies that the repository correctly handles HTTP errors and throws the appropriate exception.
    /// </summary>
    [Fact]
    public async Task SearchJokesAsync_ThrowsJokeApiException_OnHttpFailure()
    {
        var response = new HttpResponseMessage(HttpStatusCode.BadRequest);

        var httpClient = CreateMockHttpClient(response);
        var logger = Mock.Of<ILogger<DadJokeRepository>>();
        var repo = new DadJokeRepository(logger, httpClient);

        await Assert.ThrowsAsync<JokeApiException>(() => repo.SearchJokesAsync("fail"));
    }
}
