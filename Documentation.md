- Innehållsförteckning, data flow med flowchart, db relation med flowchart, vilka verktyg och npm vi använde, backend, frontend, overview,mail

# Dokumentation

## Innehållsförteckning

1) Översikt
2) Wireframes
3) Flowcharts (DB och data flow)
4) verktyg (Backend dependencies = nodemailer,nodemon, sequalize)
5) Externa api:et (Trafikverkets) https://api.trafikinfo.trafikverket.se/
6) Code Struktur
7) Javascript/Frontend Design 
8) Mail
9) Förbättringar under processen
6) Javascript/Frontend Design 
7) Authentication och Authorization
8) Verktyg
9) Mail
10) Stripe (Hitta confluence länken till det)
10) Kanske en custom middle för API-Key till våra kontroller
11) Förbättringar under processen

### Översikt

Vårt tågapplikation består av ett backend projekt som körs på nodejs och en frontend projekt som körs på javascript/vue. Våra kunder kan gå in och välja deras från och till 
stationer med tur och retur i homepage url:n. Därefter kan dem se vilka resor som finns, kunna välja hur många biljetter och vad för biljettstyper i train departures/arrivals
url. Därefter väljer dem platser beroende på antal biljetter kunderna har valt. De måste välja exakt de antal biljetterna som dem har köpt annars lyckats dem ej gå vidare i
Seats url:n. Därefter fyller dem i deras kontakt information och betalinformation. Betalningen hanteras via ett extern api som heter stripe. Dessa syns på
stripe url:n och till slut har vi en confirmations url:n där vi kan se all info om kundernas bokning. Sedan har vi en side url:n så hanteras avbokningen och då kan
kunderna söka på deras ordernummer och välja att avboka deras biljett.


### Wireframes:

Här nedan ser vi alla url:n utfrån kundernas perspektiv:

![image](https://user-images.githubusercontent.com/48633146/148405234-8e429ac0-a9e6-4f91-b0cc-abcf0b3e70c6.png)


### Flowcharts (DB och data flow)

### Code Struktur 
lägga in det med proxy som kopplar front o bakcned


Dependencies som vi använda för vår projekt är följande:

1) Backend:
* axios
* better-sqlite3
* express
* sequalize
* sqlite3
* stripe
* underscore
* dotenv
* nodemon
* nodemailer
* fs

2) Frontend:
* vue-stripe
* axios
* v-calendar
* vuetify
* eslint


### Javascript/Frontend Design




### Förbättringar under processen t.ex. nämna att själva sequalize löste vårt problem för pris tabell ist för sqllite3

### bokade säter ![image](https://user-images.githubusercontent.com/48633146/148439086-01ae6410-08dd-4b45-bcc3-3e15f9fef7cf.png)


