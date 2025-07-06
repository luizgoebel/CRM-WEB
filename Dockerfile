# Use uma imagem base ASP.NET para o runtime
FROM mcr.microsoft.com/dotnet/aspnet:8.0 AS base
WORKDIR /app
EXPOSE 80 # A porta padrão para ASP.NET Core

FROM mcr.microsoft.com/dotnet/sdk:8.0 AS build
WORKDIR /src

COPY ["CRM-WEB.sln", "."] # Ajustado para o nome da sua solução

COPY ["CRM.WEB/CRM.Web.csproj", "CRM.WEB/"] # Ajustado para o diretório e nome do seu projeto web

COPY . .

RUN dotnet restore "CRM-WEB.sln" # Restaurando a solução completa

WORKDIR /src/CRM.WEB # Ajustado para o diretório do seu projeto web dentro do contêiner

RUN dotnet publish "CRM.Web.csproj" -c Release -o /app/publish --no-restore

FROM base AS final
WORKDIR /app
COPY --from=build /app/publish .

ENTRYPOINT ["dotnet", "CRM.Web.dll"]
