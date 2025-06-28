using DadJokes.Api.Extensions;

var builder = WebApplication.CreateBuilder(args);

// Load configuration from appsettings.json
var configRoot = builder.Configuration.AddJsonFile("appsettings.json", false).Build();

// Add and configure services by setting up logging, HttpClient, Swagger, and health checks.
builder.Services.AddAndConfigureServices(configRoot);

// Build the web application with the DI container and configured services.
var app = builder.Build();

// Configure the web application with middleware, Swagger, and health checks.
app.ConfigureWebApplication();

// Register the endpoints for the application, with the random joke endpoint and the search jokes endpoint.
app.RegisterEndpoints();

// Kick the tires and light the fires.
await app.RunAsync();