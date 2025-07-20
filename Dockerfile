FROM mcr.microsoft.com/dotnet/sdk:6.0 AS build
WORKDIR /src
COPY src/ .
RUN dotnet restore "CRM-WEB.sln"

WORKDIR /src/CRM.WEB
RUN dotnet publish "CRM.Web.csproj" -c Release -o /app/publish --no-restore

# Usa uma imagem base ASP.NET para o runtime
FROM mcr.microsoft.com/dotnet/aspnet:6.0 AS final
WORKDIR /app
COPY --from=build /app/publish .
EXPOSE 80
ENTRYPOINT ["dotnet", "CRM.Web.dll"]
