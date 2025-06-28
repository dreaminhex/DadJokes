namespace DadJokes.Api.Extensions;

using DadJokes.Domain.Contracts;
using DadJokes.Domain.Entities;
using DadJokes.Domain.Types;
using Microsoft.AspNetCore.Mvc;
using Microsoft.OpenApi.Any;
using Microsoft.OpenApi.Models;

/// <summary>
/// Extension methods for <see cref="WebApplication"/> to register endpoints.
/// </summary>
public static class WebApplicationExtensions
{
    /// <summary>
    /// Configures the web application with necessary middleware and services like Swagger, health checks, and static files.
    /// </summary>
    /// <param name="app">The web application to configure.</param>
    /// <returns>The updated web application with configured middleware.</returns>
    public static WebApplication ConfigureWebApplication(this WebApplication app)
    {
        // We want everyone to be able to access our API, so we allow all origins, methods, and headers.
        // Because dad jokes are for everyone, right?
        app.UseCors("DadJokeApiCorsPolicy");

        // Necessary to render Swagger docs.
        app.UseDefaultFiles();
        app.UseStaticFiles();

        // Set the health check endpoint to "/health".
        app.UseHealthChecks("/health");

        // Let Swagger know where to find the OpenAPI docs.
        app.UseSwagger(s =>
        {
            s.RouteTemplate = "swagger/{documentName}/swagger.json";
        });

        // Configure Swagger UI.
        app.UseSwaggerUI(s =>
        {
            s.DocumentTitle = "DadJokes API";
            s.RoutePrefix = string.Empty;
            s.SwaggerEndpoint("/swagger/v1/swagger.json", "DadJokes API v1");
            s.InjectStylesheet("swagger-dark.css");
        });

        // Gotta love this MVC relic.
        app.UseRouting();

        return app;
    }

    /// <summary>
    /// Registers the endpoints for the application.
    /// </summary>
    /// <param name="app">The web application to register endpoints for.</param>
    /// <returns>The updated web application with endpoints registered.</returns>
    public static WebApplication RegisterEndpoints(this WebApplication app)
    {
        // Map OpenAPI endpoints for Swagger
        app.MapOpenApi();

        // Redirect HTTP requests to HTTPS
        app.UseHttpsRedirection();

        // Endpoint to get a random dad joke.
        // Returns a single joke object.
        // If an error occurs while fetching the joke, it logs the error and returns a problem response.
        app.MapGet("/random", async (
            [FromServices] IDadJokeRespository repo,
            [FromServices] ILogger<Program> logger) =>
        {
            try
            {
                var joke = await repo.GetRandomJoke();
                return Results.Ok(joke);
            }
            catch (Exception ex)
            {
                logger.LogError(ex, "Failed to fetch a random joke.");
                return Results.Problem("An error occurred while fetching a joke.");
            }
        })
        .Produces<DadJoke>(StatusCodes.Status200OK)
        .Produces(StatusCodes.Status400BadRequest)
        .Produces(StatusCodes.Status500InternalServerError)
        .WithOpenApi(op =>
        {
            op.Summary = "Get Random Joke";
            op.Description = "Returns a random dad joke.";
            return op;
        });

        // Endpoint to search for jokes using a search term. Optionally limits the number of jokes returned.
        // Returns jokes grouped by their length (Short, Medium, Long).
        app.MapGet("/search", async (
            [FromQuery] string term,
            [FromQuery] int? max,
            [FromServices] IDadJokeRespository repo,
            [FromServices] ILogger<Program> logger) =>
        {
            if (string.IsNullOrWhiteSpace(term))
            {
                return Results.BadRequest("Search term is required.");
            }

            try
            {
                var grouped = await repo.SearchJokesAsync(term, max ?? 30);
                return Results.Ok(grouped);
            }
            catch (Exception ex)
            {
                logger.LogError(ex, "Failed to search for jokes.");
                return Results.Problem("An error occurred while searching for jokes.");
            }
        })
        .Produces<Dictionary<JokeLength, List<DadJoke>>>(StatusCodes.Status200OK)
        .Produces(StatusCodes.Status400BadRequest)
        .Produces(StatusCodes.Status500InternalServerError)
        .WithOpenApi(op =>
        {
            op.Summary = "Search Jokes";
            op.Description = "Searches for jokes based on a search term. Returns jokes grouped by their length (Short, Medium, Long). By default, returns up to 30 jokes. You can specify a different maximum number of jokes to return using the 'max' query parameter.";
            return op;
        });

        return app;
    }
}
