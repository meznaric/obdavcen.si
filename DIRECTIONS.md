# Kako napisati članek

 - Trenutno imamo glavno stran (/) s kalkulatorjem, na kateri lahko primerjaš različne oblike podjetja.
 - Tvoja naloga je, da napišeš nove članke, optimizirane za iskalnike (SEO), in sicer za poizvedbe, kot jih iščejo slovenski podjetniki: »SP davki«, »SP prispevki«, »izračun plače«, »DOO« in podobno.
 - Upoštevati moraš vse podatke iz datoteke DATA.md. Ugotovi, kaj je zanimivo pri posamezni obliki podjetja, in to izpostavi.
 - Pod vsak naslov H2 napiši od 3 do 5 odstavkov ali seznamov, skupaj dolgih od 150 do 300 besed. Pazi, da vsebina ostane jasna in da bralca ne preobremeniš.
 - Pomembne dele besedila zapiši krepko. Poveži članke o različnih oblikah podjetja med seboj. Vključi kazalo. Uporabi komponento alert.
 - V bloke kode dodaj izračune, ki pokažejo, kako se prispevki izračunajo s funkcijami iz taxCalculator in drugih pomožnih modulov (utils).
 - Na voljo imaš DaisyUI in Tailwind CSS. Uporabi bogate komponente.
 - Uporabi format MDX. Predloga je v `app/routes/izplacilo.template.mdx`.
 - Pravilno nastavi naslov (`title`) in opis (`description`), da bosta primerna za SEO.
 - Po potrebi uporabi ikone in jim prilagodi barvo.
 - Po potrebi uporabi opozorila (alert).
 - Formule prikaži v blokih kode.
 - Podatke prikaži v tabelah.
 - Pomisli, kaj sem morda spregledal, in to dopolni.
 - Pri posameznih podatkih dodaj povezave do zakonov.
 - Uporabljaj samo uradne vire: zakone na pisrs.si ali uradni-list.si ter pojasnila in podatke na fu.gov.si, gov.si, zzzs.si, zpiz.si, spot.gov.si in stat.si. Spletne strani računovodij, forumi in povzetki zakonov (zakonodaja.com, racunovodstvo.net …) ne štejejo za vir.

## Jezik in slog

 - Piši v knjižni slovenščini po Slovenskem pravopisu, tako kot bi pisal lektor ali profesor slovenščine. Uporabljaj šumnike.
 - Bralca tikaj.
 - Krajšave pravnoorganizacijskih oblik piši s presledki: s. p., d. o. o. URL-ji ostanejo brez pik in presledkov (`/izplacilo/normirani-sp`).
 - Pred znakom za odstotek in valuto pusti presledek (25 %, 1.000 €), pridevnik pa piši skupaj (25-odstotni).
 - Pomišljaj (–) piši s presledki, kadar loči dele povedi, in brez njih pri razponih (10–20 %, 2025–2026). Vezaj (-) piši brez presledkov (e-pošta).
 - Uporabljaj slovenske narekovaje »…«.
 - V naslovih piši veliko začetnico samo na prvi besedi.
 - Uporabljaj izraze, kot jih uporabljajo FURS in zakoni (dohodnina, akontacija dohodnine, zavarovalna osnova, normirani odhodki …), in se izogibaj kalkom: »če« namesto »v kolikor«, »treba je« namesto »potrebno je«, »zunaj« namesto »izven«.

## Zgradba članka

Članek naj ima poglavja v tem vrstnem redu:

 - Uvod
 - …
 - Izračun davkov in prispevkov
    - Kako se računajo davki?
    - Kako se računajo prispevki?
    - Kako se računa dohodnina?
 - Kdaj izbrati X?
 - Kdaj X ni prava izbira?
 - X ali A
 - X ali B
 - X ali C
 - Zaključek
 - Relevantni zakoni:
   - povezave do uradnega prečiščenega besedila v PISRS (na primer ZDoh-2: https://pisrs.si/pregledPredpisa?id=ZAKO4697) s kratkim opisom
