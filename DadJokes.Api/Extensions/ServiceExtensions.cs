namespace DadJokes.Api.Extensions;

using DadJokes.Domain.Contracts;
using DadJokes.Domain.Repositories;

public static class ServiceExtensions
{
    /// <summary>
    /// Adds the necessary services for the application.
    /// </summary>
    /// <param name="services">The service collection to add services to.</param>
    /// <returns>The updated service collection.</returns>
    public static IServiceCollection AddAndConfigureServices(this IServiceCollection services, IConfigurationRoot configuration)
    {
        // Configure our logger.
        ILogger logger = LoggerFactory.Create(builder =>
        {
            builder.AddConsole();
            builder.SetMinimumLevel(LogLevel.Debug);
        }).CreateLogger("DadJokeApi");

        // Inject logging.
        services.AddSingleton(logger);

        // Add a very open CORS policy. Dad jokes are for the world.
        services.AddCors(options =>
        {
            options.AddPolicy("DadJokeApiCorsPolicy", builder =>
            {
                builder.AllowAnyOrigin()
                       .AllowAnyMethod()
                       .AllowAnyHeader();
            });
        });

        // Register the repository with the HttpClient. Unfortunately, order still matters in .NET Core DI, so register the Logger and HttpClient first.
        // This allows us to use the HttpClientFactory to create an instance of the DadJokeRepository with the configured HttpClient.
        // Important note: This also registers the IDadJokeRespository interface, which is used by the application to access dad jokes. You don't
        // need to register the interface separately, as the implementation is registered with the interface.
        services.AddHttpClient<IDadJokeRespository, DadJokeRepository>(client =>
        {
            var baseUrl = configuration.GetValue<string>("DadJokesApi:BaseUrl");

            if (string.IsNullOrEmpty(baseUrl))
            {
                throw new ArgumentException("Base URL for the core DadJokes API is not configured.");
            }

            client.BaseAddress = new Uri(baseUrl);
            client.DefaultRequestHeaders.Add("Accept", "application/json");
            client.DefaultRequestHeaders.Add("User-Agent", "DreamInHexDadJokesAPI/1.0"); // Let's be polite and identify ourselves, shan't we?
        });

        // Add support for OpenAPI (Swagger).
        // This will allow us to document our API and provide a UI for testing it.
        services.AddOpenApi();
        services.AddEndpointsApiExplorer();
        services.AddSwaggerGen(s =>
        {
            s.SwaggerDoc("v1", new Microsoft.OpenApi.Models.OpenApiInfo { Title = "Dad Joke API", Version = "v1" });
            // There is no auth needed, but if we wanted to add it later we can configure our security definition & requirement here.
        });

        // Add a health check endpoint in case we deploy this to a cloud service.
        services.AddHealthChecks();

        return services;
    }
}
