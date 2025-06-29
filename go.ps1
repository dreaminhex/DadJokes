# go.ps1

# Start the .NET API in a new window
Start-Process powershell -ArgumentList "dotnet run --project ./DadJokes.Api/DadJokes.Api.csproj"

# Start the UI
Start-Process powershell -ArgumentList "cd DadJokes.Ui/dadjokes; npm run dev"

# Launch browser (adjust port if needed)
Start-Process "http://localhost:7879"
