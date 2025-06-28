# Use .NET 9 SDK to build and publish
FROM mcr.microsoft.com/dotnet/sdk:9.0 AS build
WORKDIR /src
COPY . .
RUN dotnet publish -c Release -o /app

# Runtime image
FROM mcr.microsoft.com/dotnet/aspnet:9.0 AS runtime
WORKDIR /app
COPY --from=build /app ./

# Expose 80
EXPOSE 80
ENTRYPOINT ["dotnet", "DadJokes.Api.dll"]
