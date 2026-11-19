import {
  dobicekIzKapitalaStopnje,
  navideznaOdsvojitevDni,
  obrestiDepozitiOprostitev,
  obrestiStopnja,
} from "~/constants/2026/vlaganje";
import { evri, odstotek } from "../format";
import { viri, type Vir } from "./viri";

export type Zmota = {
  id: string;
  zmota: string;
  resnica: string;
  viri: Vir[];
};

const st = dobicekIzKapitalaStopnje;
const lestvica = st
  .map((s, i) =>
    i === 0 ? odstotek(s.stopnja) : `${odstotek(s.stopnja)} po ${s.odLet}`
  )
  .join(" → ");

export const zmote: Zmota[] = [
  {
    id: "stare-stopnje",
    zmota: "Davek je 27,5 %, po 20 letih pa nič.",
    resnica: `27,5 % je veljalo le v letih 2020 in 2021, oprostitev po 20 letih pa do konca leta 2021. Od leta 2022 velja ${lestvica} letih.`,
    viri: [viri.fursOpis, viri.zdoh132],
  },
  {
    id: "akumulacijski-brez-davka",
    zmota: "Akumulacijski ETF je neobdavčen.",
    resnica: `Davek je le odložen do prodaje. Dividend ne prijavljaš sproti, ob prodaji pa je obdavčen ves dobiček, tudi tisti iz reinvestiranih dividend v ceni enote. Brez davka je šele po ${st[st.length - 1].odLet} letih.`,
    viri: [viri.fursOpis],
  },
  {
    id: "tuji-posrednik",
    zmota: "Tuji posrednik FURS ne poroča, zato ni treba ničesar prijaviti.",
    resnica:
      "Obveznost napovedi velja ne glede na to, kje je posrednik. FURS izrecno piše, da taka obvestila tujih platform (npr. eToro) ne vzdržijo. Podatke o tujih računih FURS dobiva z mednarodno izmenjavo, od 16. 3. 2026 pa jih vidiš tudi v eDavkih.",
    viri: [viri.fursOpis, viri.tujiRacuniNovica],
  },
  {
    id: "prenos-izgube",
    zmota: "Izgubo lahko prenesem v naslednja leta.",
    resnica:
      "Izguba zmanjša le dobiček iz istega koledarskega leta. Prenos v naslednja leta ni mogoč (razen redke izjeme pri delnicah, pridobljenih pred povečanjem kapitala iz sredstev družbe).",
    viri: [viri.fursOpis, viri.zdoh97],
  },
  {
    id: "prodaj-kupi-nazaj",
    zmota: "Prodam z izgubo in takoj kupim nazaj, da znižam davek.",
    resnica: `Če isti vrednostni papir kupiš v ${navideznaOdsvojitevDni} dneh pred prodajo z izgubo ali po njej, se izguba za toliko enot, kolikor si jih kupil, ne prizna in ne preide na nov nakup. Pravilo velja tudi za samodejni mesečni nakup.`,
    viri: [viri.navideznaOdsvojitev, viri.zdoh97],
  },
  {
    id: "obresti-1000",
    zmota: `Obresti do ${evri(obrestiDepozitiOprostitev)} so vedno neobdavčene.`,
    resnica: `Oprostitev velja le za obresti na depozite pri bankah iz Slovenije in EU. Obresti pri IBKR, eToro ali v Revolut Savings Flexible (sklad denarnega trga) so obdavčene po stopnji ${odstotek(obrestiStopnja)} od prvega evra.`,
    viri: [viri.fursOpis, viri.zdoh133],
  },
  {
    id: "male-dividende",
    zmota: "Majhnih dividend (pod 10 €) ni treba prijaviti.",
    resnica:
      "Napoved oddaš ne glede na znesek. Pravilo, da se davek do 10 € ne odmeri (50. člen ZDavP-2), velja za znesek davka v odločbi, ne za posamezno dividendo, in ne odpravi obveznosti napovedi.",
    viri: [viri.divNavodilo, viri.fursDividende],
  },
];
