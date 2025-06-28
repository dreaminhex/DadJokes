using System.Text.Json.Serialization;

namespace DadJokes.Domain.Entities;

public class DadJoke
{
    [JsonPropertyName("id")]
    public required string Id { get; set; }

    [JsonPropertyName("joke")]
    public required string Joke { get; set; }
}
