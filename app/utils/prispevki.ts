import type {
  ConstantSettings,
  MesecniZneski,
  PopoldanskiSettings,
  PrispevkiSettings,
  SharedInputs,
  YearSettings,
} from "~/constants/types";

export function getZavarovanecRate(p: PrispevkiSettings) {
  return (
    p.zavarovanecPIZrate +
    p.zavarovanecZZZSrate +
    p.zavarovanecStarsevsko +
    p.zavarovanecBrezposelnost +
    p.zavarovanecDOrate
  );
}

export function getDelodajalecRate(p: PrispevkiSettings) {
  return (
    p.delodajalecPIZrate +
    p.delodajalecZZZSrate +
    p.delodajalecStarsevsko +
    p.delodajalecBrezposelnost +
    p.delodajalecPoskodbe +
    p.delodajalecDOrate
  );
}

export function getPrispevkiRate(prispevki: PrispevkiSettings) {
  return getZavarovanecRate(prispevki) + getDelodajalecRate(prispevki);
}

/**
 * Podlaga zavarovanja po ZPIZ-2:
 * 14 = delavec v delovnem razmerju (tudi lastnik, zaposlen v svoji družbi)
 * 15 = samozaposlen (s. p.)
 * 16 = družbenik – poslovodja brez pogodbe o zaposlitvi
 * 17 = kmet
 */
export type ZavarovanecClen = 14 | 15 | 16 | 17;

interface ZavarovalnaOsnovaInput {
  dobicek: number; // Profit of the insured
  // Zadnja znana povprečna letna plača (PP), preračunana na mesec, po mesecih
  povprecnaPlacaMesecno: MesecniZneski;
  zavarovanecClen?: ZavarovanecClen;
}

// Najnižja osnova: 90 % PP za družbenike (16. člen), sicer 60 % PP
// (144. in 145. člen ZPIZ-2; FURS, Plačevanje prispevkov za zavarovance –
// družbenike, 2.3.1)
export function getMinimalnaOsnova(
  averageIncomeLastYear: number,
  zavarovanecClen: ZavarovanecClen | undefined = 15
) {
  return averageIncomeLastYear * (zavarovanecClen === 16 ? 0.9 : 0.6);
}

// Najvišja osnova za samozaposlene in družbenike: 3,5-kratnik PP
// (145. člen ZPIZ-2). Za delavce (14. člen) najvišje osnove ni.
export function getMaksimalnaOsnova(averageIncomeLastYear: number) {
  return averageIncomeLastYear * 3.5;
}

/**
 * Pravilnik o določanju zavarovalne osnove, 2. člen
 * https://pisrs.si/pregledPredpisa?id=PRAV11769
 * Zmanjšanje dobička za 25 % velja le za samozaposlene (15. člen ZPIZ-2,
 * drugi odstavek 145. člena).
 */
export function getZavarovalnaOsnova(input: ZavarovalnaOsnovaInput): number {
  const { dobicek, povprecnaPlacaMesecno, zavarovanecClen = 15 } = input;

  let osnova = dobicek / 12;

  if (zavarovanecClen === 15) {
    osnova *= 0.75;
  }

  // Najnižja in najvišja osnova se računata od PP, ki velja v posameznem mesecu
  return MESECI.reduce((letnaOsnova, mesec) => {
    const povprecnaPlaca = getMesecniZnesek(povprecnaPlacaMesecno, mesec);
    const minimalnaOsnova = getMinimalnaOsnova(povprecnaPlaca, zavarovanecClen);
    const maksimalnaOsnova = getMaksimalnaOsnova(povprecnaPlaca);
    return (
      letnaOsnova +
      Math.min(Math.max(osnova, minimalnaOsnova), maksimalnaOsnova)
    );
  }, 0);
}

// PP po mesecih: januarja velja še prejšnja PP, od obračuna za februar nova
export function getPovprecnaPlacaMesecno(
  settings: Pick<ConstantSettings, "averageIncomeLastYear" | "averageIncomeJanuar">
): MesecniZneski {
  return [
    { odMeseca: 1, znesek: settings.averageIncomeJanuar },
    { odMeseca: 2, znesek: settings.averageIncomeLastYear },
  ];
}

// Letna najnižja zavarovalna osnova (vsota mesečnih najnižjih osnov)
export function getMinimalnaOsnovaLetno(
  povprecnaPlacaMesecno: MesecniZneski,
  zavarovanecClen: ZavarovanecClen | undefined = 15
) {
  return MESECI.reduce(
    (letnaOsnova, mesec) =>
      letnaOsnova +
      getMinimalnaOsnova(
        getMesecniZnesek(povprecnaPlacaMesecno, mesec),
        zavarovanecClen
      ),
    0
  );
}

// Letna osnova za prispevke od plače: mesečna plača, a najmanj najnižja
// osnova, ki velja v posameznem mesecu. Za zaposlene (14. člen) je to 60 % PP
// in najvišje osnove ni (144. člen ZPIZ-2). Za družbenika – poslovodjo
// (16. člen) so osnova vsi prejemki za poslovodenje, najmanj 90 % PP in
// največ 3,5-kratnik PP (145. člen ZPIZ-2).
// https://pisrs.si/pregledPredpisa?id=ZAKO6280
// https://www.fu.gov.si/fileadmin/Internet/Davki_in_druge_dajatve/Podrocja/Prispevki_za_socialno_varnost/Opis/Placevanje_prispevkov_za_socialno_varnost_za_zavarovance_-_druzbenike.doc
export function getOsnovaZaPrispevkeIzPlace(
  letnaBrutoPlaca: number,
  povprecnaPlacaMesecno: MesecniZneski,
  zavarovanecClen: ZavarovanecClen | undefined = 14
) {
  return MESECI.reduce((letnaOsnova, mesec) => {
    const povprecnaPlaca = getMesecniZnesek(povprecnaPlacaMesecno, mesec);
    const osnova = Math.max(
      letnaBrutoPlaca / 12,
      getMinimalnaOsnova(povprecnaPlaca, zavarovanecClen)
    );
    return (
      letnaOsnova +
      (zavarovanecClen === 16
        ? Math.min(osnova, getMaksimalnaOsnova(povprecnaPlaca))
        : osnova)
    );
  }, 0);
}

type DobicekInputs = {
  revenue: number; // davčno priznani prihodki
  expenses: number; // odhodki
  lastYearPrispevki: number; // obračunani prispevki lansko leto
  // Odhodki so normirani (prispevki v njih niso posebej odšteti)
  normiraniOdhodki?: boolean;
};

/**
 * Pravilnik o določanju zavarovalne osnove, 3. člen
 * https://pisrs.si/pregledPredpisa?id=PRAV11769
 */
export function getDobicek(inputs: DobicekInputs): number {
  const { revenue, expenses, lastYearPrispevki, normiraniOdhodki } = inputs;

  // 1. Calculate the profit based on paragraph (2)
  const razlika = revenue - expenses;
  let dobicek = razlika;

  // 2. Apply paragraph (3) - if profit difference is less than or equal to zero, use contributions as profit
  if (razlika <= 0) {
    dobicek = lastYearPrispevki;
  } else if (normiraniOdhodki) {
    // Normiranec: razliki med prihodki in normiranimi odhodki se prištejejo
    // obračunani prispevki (2. odstavek 3. člena pravilnika). Pri dejanskih
    // odhodkih so prispevki že izvzeti iz vnesenih stroškov.
    dobicek = razlika + lastYearPrispevki;
  }

  return dobicek;
}

export function getRealniPrispevek(
  lanskiPrispevki: number,
  sharedInputs: SharedInputs,
  currentSettings: YearSettings,
  normiraniOdhodki = false
) {
  const dobicek = getDobicek({
    lastYearPrispevki: lanskiPrispevki,
    expenses: sharedInputs.expenses,
    revenue: sharedInputs.revenue,
    normiraniOdhodki,
  });

  const zavarovanecClen = currentSettings.spZavarovanecClen ?? 15;

  const zavarovalnaOsnova = getZavarovalnaOsnova({
    dobicek,
    povprecnaPlacaMesecno: getPovprecnaPlacaMesecno(currentSettings),
    zavarovanecClen,
  });

  // Znižani PIZ prispevki za novo registrirane s. p. (ZPIZ-2, člen 145, odstavek 14)
  const znizanje = currentSettings.spZnizaniPrispevki;
  const pizMultiplier = znizanje === 'prvo' ? 0.5 : znizanje === 'drugo' ? 0.7 : 1;

  const effectiveSettings: PrispevkiSettings = pizMultiplier < 1
    ? {
        ...currentSettings,
        zavarovanecPIZrate: currentSettings.zavarovanecPIZrate * pizMultiplier,
        delodajalecPIZrate: currentSettings.delodajalecPIZrate * pizMultiplier,
      }
    : currentSettings;

  const prispevkiRate = getPrispevkiRate(effectiveSettings);
  const prispevki =
    zavarovalnaOsnova * prispevkiRate + getOZPLetno(currentSettings);
  // Obvezni prispevki za PIZ (meja za olajšavo PDPZ, 117. člen ZDoh-2)
  const pizPrispevki =
    zavarovalnaOsnova *
    (effectiveSettings.zavarovanecPIZrate + effectiveSettings.delodajalecPIZrate);
  return { prispevki, prispevkiRate, zavarovalnaOsnova, dobicek, pizPrispevki };
}

const MESECI = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12];

// Znesek, ki velja v danem mesecu (1 = januar); vsak znesek velja od svojega
// meseca do naslednje spremembe (npr. uskladitev PIZ pavšala 1. aprila).
export function getMesecniZnesek(mesecniZneski: MesecniZneski, mesec: number) {
  const veljavni = mesecniZneski.filter((z) => z.odMeseca <= mesec);
  return veljavni[veljavni.length - 1]?.znesek ?? 0;
}

// Sešteje mesečne zneske za vseh 12 mesecev
export function getLetniZnesek(mesecniZneski: MesecniZneski) {
  return MESECI.reduce(
    (letniZnesek, mesec) => letniZnesek + getMesecniZnesek(mesecniZneski, mesec),
    0
  );
}

// Letni znesek obveznega zdravstvenega prispevka (OZP)
export function getOZPLetno(p: PrispevkiSettings) {
  return getLetniZnesek(p.zavarovanecOZP);
}

// Letni pavšalni prispevki za popoldanski s. p. (neodvisni od dobička)
export function getPopoldanskiPrispevki(settings: PopoldanskiSettings) {
  const piz = getLetniZnesek(settings.popoldanskiPIZ);
  const zzPoskodbe = getLetniZnesek(settings.popoldanskiZZPoskodbe);
  const zz = getLetniZnesek(settings.popoldanskiZZ);
  const dolgotrajnaOskrba = getLetniZnesek(settings.popoldanskiDO);
  return {
    piz,
    zzPoskodbe,
    zz,
    dolgotrajnaOskrba,
    skupaj: piz + zzPoskodbe + zz + dolgotrajnaOskrba,
  };
}
