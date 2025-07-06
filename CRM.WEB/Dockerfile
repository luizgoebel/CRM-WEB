FROM mcr.microsoft.com/dotnet/aspnet:6.0 AS base
WORKDIR /app
EXPOSE 80 

FROM mcr.microsoft.com/dotnet/sdk:6.0 AS build
WORKDIR /src

COPY ["CRM-WEB.sln", "."] 

COPY ["CRM.WEB/CRM.Web.csproj", "CRM.WEB/"] 

COPY . .

RUN dotnet restore "CRM-WEB.sln" 

WORKDIR /src/CRM.WEB 

RUN dotnet publish "CRM.Web.csproj" -c Release -o /app/publish --no-restore

FROM base AS final
WORKDIR /app
COPY --from=build /app/publish .

ENTRYPOINT ["dotnet", "CRM.Web.dll"]
