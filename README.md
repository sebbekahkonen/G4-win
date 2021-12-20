# Dokumentering för onboarding utav nya medlemmar i teamet.

## Vilka tekniker har vi bestämt?
- Backend: Node.js, express, sqlite3. (Kan tillkomma ORM, eller annat)
- Frontend: VUE.
- CSS: Vuetify.
- REST: Vi bygger egna REST-routes
- Kryptering: Node.js crypto(finns inbyggd)? bCrypt? md5? 
- NPM-moduler/bibliotek: Express, better-sqlite3.

#
## Teknisk dokumentation
### Länkar till diverse tekniker som kommer användas.
- API: https://api.trafikinfo.trafikverket.se/API (Ej 100% bestämt)
- API: http://tagtider.net/api/
- Vue: https://vuejs.org/v2/guide/
- Vuetify: https://vuetifyjs.com/en/getting-started/installation/
- ESLint: https://eslint.org/docs/user-guide/getting-started
- Nodemon (För att starta Backend)
    * cd backend 
    * npm install
    * istället för 'npm start' skriv 'nodemon index.js' alternativt den .js fil du vill starta.
    * Om du får Execution Policy problem: Öppna Powershell i admin-läge => Klistra in följande kod och tryck enter: Set-ExecutionPolicy RemoteSigned -Scope CurrentUser
    * Därefter kan du köra kommandot igen: nodemon index.js

# 
## Kodstandard och arbetsverktyg
- ESLint: kodstandard för alla medlemmar.
- VSCode extensions: ESLint, Vetur, vue(Om vi kör vue)
- Vi behöver ändra i settings.json i VSCode, vi tar det när alla är på plats.

#
## Tankar kring uppgift/domän/problemområde
### Vad har vi tänkt?
- TBD
### Tabeller i databas?
- Användare(Resenärer), Avgångar, Stationer, Tåg, Bokningar, (Restaurang?),
### Hur hör dessa samman?
- Användare 1 -- N Bokningar
- Bokningar M -- N Avgångar
- Avgångar 1 -- 1 Stationer
- Tåg 1 -- 1 Restaurang
- Tåg 1 -- 1 Avgångar
- Tåg 1 -- N Användare
- Fler relationer tillkommer vid behov.

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
