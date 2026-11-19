export type Vir = { naslov: string; url: string };

// Samo uradni viri (zakoni na PISRS, FURS, Ministrstvo za finance, ATVP, Vlada RS
// ter uradne strani tujih davčnih uprav), preverjeni 18. 11. 2026.
// PISRS nima povezav na posamezne člene, zato člen navedemo v naslovu.
const ZDOH2 = "https://pisrs.si/pregledPredpisa?id=ZAKO4697";

export const viri = {
  fursOpis: {
    naslov: "FURS: Dohodek iz kapitala – podrobnejši opis (15. izdaja, avgust 2026)",
    url: "https://www.fu.gov.si/fileadmin/Internet/Davki_in_druge_dajatve/Podrocja/Dohodnina/Dohodek_iz_kapitala/Opis/Obresti_dividende_in_dobicek_iz_kapitala.doc",
  },
  fursOdsvojitev: {
    naslov: "FURS: Odsvojil sem vrednostne papirje, druge deleže ali investicijske kupone",
    url: "https://www.fu.gov.si/zivljenjski_dogodki_prebivalci/odsvojil_sem_vrednostne_papirje_druge_deleze_ali_investicijske_kupone/",
  },
  zdohPisrs: {
    naslov: "Zakon o dohodnini (ZDoh-2) – PISRS",
    url: ZDOH2,
  },
  zdoh132: {
    naslov: "ZDoh-2 (PISRS), 132. člen – stopnje",
    url: ZDOH2,
  },
  zdoh97: {
    naslov: "ZDoh-2 (PISRS), 97. člen – davčna osnova, izgube, navidezna odsvojitev",
    url: ZDOH2,
  },
  zdoh133: {
    naslov: "ZDoh-2 (PISRS), 133. člen – oprostitev 1.000 € za obresti",
    url: ZDOH2,
  },
  zdavp: {
    naslov: "Zakon o davčnem postopku (ZDavP-2), 63., 394. in 395. člen – PISRS",
    url: "https://pisrs.si/pregledPredpisa?id=ZAKO4703",
  },
  zfu: {
    naslov: "Zakon o finančni upravi (ZFU), 49., 55. in 96. člen – PISRS",
    url: "https://pisrs.si/pregledPredpisa?id=ZAKO6792",
  },
  zup: {
    naslov: "Zakon o splošnem upravnem postopku (ZUP), 100. člen – PISRS",
    url: "https://pisrs.si/pregledPredpisa?id=ZAKO1603",
  },
  navideznaOdsvojitev: {
    naslov: "FURS: Pravilo navidezne odsvojitve kapitala (pravilo 30 dni)",
    url: "https://www.fu.gov.si/fileadmin/Internet/Davki_in_druge_dajatve/Podrocja/Dohodnina/Dohodek_iz_kapitala/Opis/Dobicek_iz_kapitala_-_pravilo_navidezne_odsvojitve_kapitala.docx",
  },
  kdvpNavodilo: {
    naslov: "Navodilo za izpolnjevanje Doh-KDVP za leto 2026",
    url: "https://edavki.durs.si/OpenPortal/Dokumenti/doh_odm_kdvp_26.n.sl.pdf",
  },
  kdvpEdavki: {
    naslov: "eDavki: napoved Doh-KDVP",
    url: "https://edavki.durs.si/EdavkiPortal/OpenPortal/CommonPages/Opdynp/PageD.aspx?category=vrednostni_papirji_drugi_delezi_investicijski_kuponi",
  },
  evrocanje: {
    naslov: "FURS: elektronska napoved dobička iz kapitala in prijava v eVročanje",
    url: "https://www.gov.si/novice/2023-02-10-elektronska-napoved-dobicka-iz-kapitala-in-obvezna-prijava-v-storitev-evrocanje/",
  },
  divNavodilo: {
    naslov: "Navodilo za izpolnjevanje Doh-Div",
    url: "https://edavki.durs.si/OpenPortal/Dokumenti/doh_odm_div22.n.sl.pdf",
  },
  fursDividende: {
    naslov: "FURS: Prejel sem dividende",
    url: "https://www.fu.gov.si/zivljenjski_dogodki_prebivalci/prejel_sem_dividende/",
  },
  mednarodnaBrosura: {
    naslov: "FURS: Brošura o mednarodni obdavčitvi posameznikov (odbitek tujega davka)",
    url: "https://www.fu.gov.si/fileadmin/Internet/Davki_in_druge_dajatve/Podrocja/Mednarodno_obdavcenje/Opis/Brosura_Mednarodna_obdavcitev_posameznikov.docx",
  },
  irsKonvencija: {
    naslov: "IRS: konvencija ZDA–Slovenija, pojasnila (dividende 15 %)",
    url: "https://www.irs.gov/businesses/international-businesses/slovenia-treasury-explanation",
  },
  irsW8ben: {
    naslov: "IRS: About Form W-8BEN",
    url: "https://www.irs.gov/forms-pubs/about-form-w-8-ben",
  },
  revenueSkladi: {
    naslov: "Irska davčna uprava (Revenue): obdavčitev irskih skladov",
    url: "https://www.revenue.ie/en/companies-and-charities/financial-services/collective-investment-vehicles/funds.aspx",
  },
  javniPoziv: {
    naslov: "FURS: Javni poziv k vložitvi napovedi za leto 2025 (rok 2. 3. 2026)",
    url: "https://www.gov.si/assets/organi-v-sestavi/FURS/Novice-2026/Javni-poziv-rok-je-2.3.2026.pdf",
  },
  prijavaRacuna: {
    naslov: "FURS: Prijava računa v tujini",
    url: "https://www.fu.gov.si/zivljenjski_dogodki_prebivalci/prijava_racuna_v_tujini",
  },
  fursRacuniVprasanja: {
    naslov: "FURS: Finančni računi iz tujine – vprašanja in odgovori",
    url: "https://www.fu.gov.si/fileadmin/Internet/Davki_in_druge_dajatve/Poslovanje_z_nami/Vpis_v_davcni_register_in_davcna_stevilka/Opis/Financni_racuni_iz_tujine.doc",
  },
  tujiRacuniNovica: {
    naslov: "FURS (16. 3. 2026): vpogled v podatke o tujih računih v eDavkih",
    url: "https://www.gov.si/novice/2026-03-16-v-edavkih-omogocen-vpogled-v-podatke-o-tujih-financnih-racunih-z-moznostjo-prijave-placilnega-racuna/",
  },
  inrZakon: {
    naslov: "Zakon o individualnih naložbenih računih (ZINR) – PISRS",
    url: "https://pisrs.si/pregledPredpisa?id=ZAKO9154",
  },
  inrPojasnila: {
    naslov: "Ministrstvo za finance: dodatna pojasnila o ZINR (posodobljeno 14. 5. 2026)",
    url: "https://www.gov.si/assets/ministrstva/MF/Financni-sistem/DOKUMENTI/Dodatna-pojasnila-o-Zakonu-o-individualnih-nalozbenih-racunih.pdf",
  },
  inrZlozenka: {
    naslov: "Ministrstvo za finance: zloženka o individualnih naložbenih računih",
    url: "https://www.gov.si/assets/ministrstva/MF/Financni-sistem/DOKUMENTI/Financno-izobrazevanje/Zlozenka-Individualni-nalozbeni-racuni.pdf",
  },
  inrRegister: {
    naslov: "ATVP: register ponudnikov individualnih naložbenih računov",
    url: "https://www.a-tvp.si/seznami-in-registri/registri/register-ponudnikov-individualnih-nalozbenih-racunov-inr/",
  },
  inrNovica: {
    naslov: "FURS in MF (26. 5. 2026): odprtih že 10.000 INR",
    url: "https://www.gov.si/novice/2026-05-26-odprtih-ze-10-000-individualnih-nalozbenih-racunov-inr/",
  },
  kripto: {
    naslov: "FURS: Trgujem z virtualnimi valutami",
    url: "https://www.fu.gov.si/zivljenjski_dogodki_prebivalci/trgujem_z_virtualnimi_valutami/",
  },
  kriptoPredlogVlade: {
    naslov: "e-uprava: predlog Zakona o davku od dobička iz odsvojitve kriptosredstev (Ministrstvo za finance, 17. 7. 2025)",
    url: "https://e-uprava.gov.si/si/drzava-in-druzba/e-demokracija/predlogi-predpisov/predlog-predpisa.html?id=17803&lang=si",
  },
  dac8: {
    naslov: "FURS: DAC8 in CARF – poročanje ponudnikov kriptostoritev",
    url: "https://www.fu.gov.si/en/supervision/areas_of_work/international_exchange/automatic_exchange_of_information_reported_by_crypto_asset_service_providers_dac8_and_carf",
  },
  ifi: {
    naslov: "FURS: Odsvojil sem izvedene finančne instrumente (posodobljeno 18. 8. 2026)",
    url: "https://www.fu.gov.si/zivljenjski_dogodki_prebivalci/odsvojil_sem_izvedene_financne_instrumente/",
  },
} satisfies Record<string, Vir>;
