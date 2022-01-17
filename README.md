# För att köra programmet lokalt: 
- Hämta hem kodmappen till din dator.
- Öppna ny terminal i projektet > skriv in cd backend, kör npm install sen npm start.
- Öppna ny terminal i projektet > skriv in cd frontend, kör npm install sen npm run serve.
- När både backend och frontend mappen är igång, öppna din webbläsare och gå till http://localhost:8080

# Dokumentering för onboarding utav nya medlemmar i teamet.

## Vilka tekniker har vi bestämt?
- Backend: Node.js, express, sqlite3, sequelize.
- Frontend: VUE.
- CSS: Vuetify, vanilla CSS.
- REST: Vi bygger egna REST-routes.
- Kryptering: Ingen kryptering finns då vi inte har inlogg.
- NPM-moduler/bibliotek: Se dokumentationen.

#
## Teknisk dokumentation
### Länkar till diverse tekniker som kommer användas.
- API: https://api.trafikinfo.trafikverket.se/API 
- Vue: https://vuejs.org/v2/guide/
- Vuetify: https://vuetifyjs.com/en/getting-started/installation/
- ESLint: https://eslint.org/docs/user-guide/getting-started
- Nodemon (För att starta Backend)
    * cd backend 
    * npm install
    * istället för **npm start** skriv **nodemon index.js** alternativt den .js fil du vill starta.
    * Om du får Execution Policy problem: Öppna Powershell i admin-läge (högerklicka, kör i administratörsläge) => Klistra in följande kod och tryck enter: **Set-ExecutionPolicy RemoteSigned -Scope CurrentUser**
    * Därefter kan du köra kommandot igen: **nodemon index.js**

# 
## Kodstandard och arbetsverktyg
- ESLint: kodstandard för alla medlemmar.
- VSCode extensions: ESLint, Vetur, vue
- Vi behöver ändra i settings.json i VSCode, vi tar det när alla är på plats.

#
## Tankar kring uppgift/domän/problemområde
### Vad har vi tänkt?
- TBD
### Tabeller i databas?
- Stationer, Tåg, Bokade säten, Vagnar, Kvitton, Order nummer, Priser
### Hur hör dessa samman?
- Stationer 1 -- N Avgångar
- Tåg 1 -- 1 Restaurang
- Tåg 1 -- 1 Avgångar
- Tåg 1 -- N Vagnar
- Tåg 1 -- N Säten
- Priser 1 -- 1 Tåg
- Ordernummer 1 -- 1 Kvitto

# 
## Hur arbetar vi tillsammans
- Confluence / Jira
### Hur planerar vi?
- Daily standups klockan 09:00 varje dag
- Vi planerar våra dagar på daily standups, behöver vi köra parkodning så bestäms det då.
### Hur förbereder vi inför sprint reviews?
- Vi tar ett längre möte där vi går igenom agendan och hur vi ligger till.
### Kommunikationskanaler
- Vi använder discord: https://discord.gg/QjdVBHyT
- Discord(Allmänt) för generella frågor, privat meddelande på discord. Rimlig svarstid 0-2h (09:00 - 17:00)
### Arbetstider
- Vi ansvarar personligen för att lägga upp vårat arbete.
- Gemensamma arbetstider bestäms under daily ifall man behöver hjälp.
### Bestämda mötestider
- Daily standup.
### Skall vi uppmuntra till parkodning?
- Ifall behovet finns uppmuntrar vi till parkodning.
- Ingen i teamet skall känna någon stress över att fråga andra om hjälp!
### Github
- https://github.com/sebbekahkonen/G4-win
