import type { ReactNode } from "react";
import { CoinsEuroIcon, InformationCircleIcon } from "hugeicons-react";
import type { SharedInputs, YearSettings } from "~/constants/types";
import CurrencyInput from "~/ui/common/Input/CurrencyInput";
import { Tabs } from "~/ui/common/Tabs/Tabs";
import { ToggleOption } from "~/ui/common/ToggleOption/ToggleOption";
import { getOlajsavaVzdrzevaniClani } from "~/utils/dohodnina";
import { evri, evriInCenti } from "~/utils/numberFormat";
import { getMinimalnaOsnova, getRealniPrispevek } from "~/utils/prispevki";
import { getNagradaMax } from "~/utils/taxCalculator/doo";
import { getNormiraniSPData } from "~/utils/taxCalculator/normiraniSp";
import { getSPData } from "~/utils/taxCalculator/sp";
import type {
  UpdateCurrentSettings,
  UpdateSharedInputs,
} from "./useSharedInputs";

type Props = {
  // Veljavne nastavitve (pri 16. členu brez pravic delavcev)
  currentSettings: YearSettings;
  updateCurrentSettings: UpdateCurrentSettings;
  updateSharedInputs: UpdateSharedInputs;
  sharedInputs: SharedInputs;
};

const FURS_ZAPOSLITEV =
  "https://www.fu.gov.si/fileadmin/Internet/Davki_in_druge_dajatve/Podrocja/Dohodnina/Dohodek_iz_zaposlitve/Opis/";

function Vir({ href, children }: { href: string; children: ReactNode }) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className="link link-accent text-xs"
    >
      {children}
    </a>
  );
}

function RadioOption({
  name,
  checked,
  onChange,
  label,
  description,
}: {
  name: string;
  checked: boolean;
  onChange: () => void;
  label: string;
  description?: string;
}) {
  return (
    <label className="flex cursor-pointer items-start gap-2 rounded-lg p-2 hover:bg-base-200">
      <input
        type="radio"
        name={name}
        className="radio radio-sm mt-0.5 radio-accent"
        checked={checked}
        onChange={onChange}
      />
      <span>
        <span className="block text-sm">{label}</span>
        {description && (
          <span className="block text-xs text-muted">{description}</span>
        )}
      </span>
    </label>
  );
}

export default function ExtraSettings({
  currentSettings,
  updateCurrentSettings,
  updateSharedInputs,
  sharedInputs,
}: Props) {
  const nastavi =
    <K extends keyof YearSettings>(field: K) =>
    (value: YearSettings[K]) =>
      updateCurrentSettings({ [field]: value } as Partial<YearSettings>);

  // Ocene lanskih prispevkov, kot jih brez vnosa uporabi kalkulator
  const brezLanskih = { ...sharedInputs, lanskiPrispevki: undefined };
  const { prispevki: minimalniPrispevki } = getRealniPrispevek(
    getMinimalnaOsnova(currentSettings.averageIncomeLastYear, 15),
    { revenue: 0, expenses: 0, salaryGross1: 0 },
    currentSettings
  );
  const ocene = [
    { label: "Najnižji prispevki", znesek: minimalniPrispevki },
    {
      label: "Normirani s. p. z enakimi prihodki",
      znesek: getNormiraniSPData(brezLanskih, currentSettings).lanskiPrispevki,
    },
    {
      label: "S. p. z enakimi prihodki",
      znesek: getSPData(brezLanskih, currentSettings).lanskiPrispevki,
    },
  ];
  const imaLanske =
    !!sharedInputs.lanskiPrispevki && !isNaN(sharedInputs.lanskiPrispevki);

  const znizanje = currentSettings.spZnizaniPrispevki ?? "brez";
  const spContent = (
    <div className="flex flex-col gap-3 py-2">
      <fieldset>
        <legend className="mb-2 text-sm font-medium">
          Znižani prispevki za nov s.&nbsp;p.
        </legend>
        <RadioOption
          name="sp-znizani"
          checked={znizanje === "brez"}
          onChange={() => nastavi("spZnizaniPrispevki")("brez")}
          label="Brez znižanja"
        />
        <RadioOption
          name="sp-znizani"
          checked={znizanje === "prvo"}
          onChange={() => nastavi("spZnizaniPrispevki")("prvo")}
          label="Prvo leto – prispevki za PIZ 50 % nižji"
          description="Prvih 12 mesecev po prvem vpisu v register"
        />
        <RadioOption
          name="sp-znizani"
          checked={znizanje === "drugo"}
          onChange={() => nastavi("spZnizaniPrispevki")("drugo")}
          label="Drugo leto – prispevki za PIZ 30 % nižji"
          description="Od 13. do 24. meseca poslovanja"
        />
      </fieldset>
      <Vir href="https://pisrs.si/pregledPredpisa?id=ZAKO6280">
        Vir: ZPIZ-2, 145. člen
      </Vir>

      <div className="divider my-0" />

      <CurrencyInput
        icon={<CoinsEuroIcon className="size-5" />}
        label="Lanski prispevki (s.&nbsp;p. in normirani s.&nbsp;p.)"
        placeholder="Oceni samodejno"
        value={sharedInputs.lanskiPrispevki || 0}
        onChange={(lanskiPrispevki) => updateSharedInputs({ lanskiPrispevki })}
        description={
          <table className="table-xs table-zebra mt-1">
            <tbody>
              {ocene.map(({ label, znesek }) => (
                <tr key={label}>
                  <td>{label}</td>
                  <td className="tabular-nums">{evri(znesek)}</td>
                  <td>
                    <button
                      type="button"
                      className="link link-accent"
                      onClick={() =>
                        updateSharedInputs({
                          lanskiPrispevki: Math.round(znesek),
                        })
                      }
                    >
                      Izberi
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        }
      />
      {!imaLanske && (
        <div className="alert alert-soft text-sm">
          <InformationCircleIcon className="size-5 shrink-0 text-info" />
          <span>
            Prispevki so odvisni od dobička in lanskih prispevkov. Če lanskih
            prispevkov ne vpišeš, jih ocenimo, kot da si imel lani enake
            prihodke.
          </span>
        </div>
      )}
    </div>
  );

  const malicaLetna = currentSettings.malicaDnevniZnesek * 21 * 12;
  const poslovodja = currentSettings.dooDruzbenikPoslovodja === true;
  const leZaZaposlene = poslovodja
    ? "le za zaposlene s pogodbo o zaposlitvi."
    : undefined;
  const nagradaMax = getNagradaMax(currentSettings);

  const dooContent = (
    <div className="flex flex-col gap-3 py-2">
      <ToggleOption
        label="Poslovodja brez pogodbe o zaposlitvi"
        description="Velja, če kot poslovodja nimaš pogodbe o zaposlitvi v svoji družbi in nisi zavarovan na drugi podlagi (zavarovalna podlaga 040, 16. člen ZPIZ-2). Najnižja osnova za prispevke je 90 % povprečne plače, najvišja pa 3,5-kratnik povprečne plače. Regres, zimski regres in neobdavčeno plačilo za poslovno uspešnost so pravice delavcev, zato jih v tem primeru ni. Če si v svoji družbi zaposlen, si zavarovan kot delavec (podlaga 001) z najnižjo osnovo 60 % povprečne plače."
        value={poslovodja}
        onValueChange={nastavi("dooDruzbenikPoslovodja")}
      />
      <Vir href="https://www.fu.gov.si/fileadmin/Internet/Davki_in_druge_dajatve/Podrocja/Prispevki_za_socialno_varnost/Opis/Placevanje_prispevkov_za_socialno_varnost_za_zavarovance_-_druzbenike.doc">
        Vir: FURS, Plačevanje prispevkov za socialno varnost za zavarovance –
        družbenike
      </Vir>

      <div className="divider my-0" />

      <ToggleOption
        label="Malica"
        description={`Povračilo stroškov prehrane med delom: ${evriInCenti(currentSettings.malicaDnevniZnesek)} na dan × 21 dni × 12 mesecev = ${evri(malicaLetna)} na leto. Neobdavčeno do zakonske meje.`}
        value={currentSettings.malica !== false}
        onValueChange={nastavi("malica")}
      />
      <ToggleOption
        label="Prevoz na delo"
        description={`Povračilo stroškov prevoza na delo: ${evri(currentSettings.prevozniStroskiMesecniZnesek)} na mesec, ${evri(currentSettings.prevozniStroskiMesecniZnesek * 12)} na leto. Neobdavčeno do 0,21\u00a0€ na kilometer oziroma najmanj do 140\u00a0€ na mesec.`}
        value={currentSettings.prevozniStroski === true}
        onValueChange={nastavi("prevozniStroski")}
      />
      {currentSettings.prevozniStroski && (
        <CurrencyInput
          icon={<CoinsEuroIcon className="size-5" />}
          label="Mesečni znesek prevoza"
          value={currentSettings.prevozniStroskiMesecniZnesek}
          onChange={nastavi("prevozniStroskiMesecniZnesek")}
          description="Prilagodi glede na dejansko razdaljo do dela."
        />
      )}
      <Vir href={`${FURS_ZAPOSLITEV}Povracila_stroskov_in_drugi_dohodki_iz_delovnega_razmerja.docx`}>
        Vir: FURS, Povračila stroškov in drugi dohodki iz delovnega razmerja
      </Vir>

      {/* Onemogočen fieldset onemogoči tudi stikala v njem */}
      <fieldset
        disabled={poslovodja}
        className="flex flex-col gap-3 disabled:opacity-60"
      >
        {leZaZaposlene && (
          <p className="text-sm text-muted">
            Regres, božičnica in nagrada: {leZaZaposlene}
          </p>
        )}
        <ToggleOption
          label="Regres za letni dopust"
          description={`Neobdavčen do 100\u00a0% povprečne plače (${evri(currentSettings.povprecnaPlacaDavcnoLeto)}).`}
          value={currentSettings.regres !== false}
          onValueChange={nastavi("regres")}
        />
        <Vir href={`${FURS_ZAPOSLITEV}Regres_za_letni_dopust.doc`}>
          Vir: FURS, Regres za letni dopust
        </Vir>

        <ToggleOption
          label="Božičnica oziroma zimski regres"
          description={`Pol minimalne plače (${evri(currentSettings.minimalnaPlaca / 2)}), brez dohodnine${currentSettings.bozicnicaOprostPrispevkov ? " in prispevkov" : "; prispevki se obračunajo"}.`}
          value={currentSettings.bozicnica !== false}
          onValueChange={nastavi("bozicnica")}
        />
        <Vir href={`${FURS_ZAPOSLITEV}Dohodek_iz_delovnega_razmerja.doc`}>
          Vir: FURS, Dohodek iz delovnega razmerja
        </Vir>

        <ToggleOption
          label="Nagrada za poslovno uspešnost"
          description={`Neobdavčena do ${evri(nagradaMax)} (100\u00a0% povprečne plače${currentSettings.bozicnicaLocenOdNagrade ? "" : ", zmanjšano za božičnico"}). Prispevki se obračunajo.`}
          value={currentSettings.nagradaPoslovnaUspesnost !== false}
          onValueChange={nastavi("nagradaPoslovnaUspesnost")}
        />
        {currentSettings.nagradaPoslovnaUspesnost !== false && (
          <CurrencyInput
            icon={<CoinsEuroIcon className="size-5" />}
            label="Znesek nagrade"
            value={currentSettings.nagradaZnesek ?? nagradaMax}
            onChange={nastavi("nagradaZnesek")}
            description={`Neobdavčeno največ ${evri(nagradaMax)}.`}
          />
        )}
        <Vir href={`${FURS_ZAPOSLITEV}Placilo_za_poslovno_uspesnost_za_izplacila_od_1_1_2023_dalje.doc`}>
          Vir: FURS, Plačilo za poslovno uspešnost
        </Vir>
      </fieldset>
    </div>
  );

  const steviloOtrok = currentSettings.steviloOtrok ?? 0;
  const olajsavaVzdrzevaniTotal = getOlajsavaVzdrzevaniClani(currentSettings);
  const olajsavaZaOtroke =
    olajsavaVzdrzevaniTotal -
    (currentSettings.vzdrzevaniDrugiClani
      ? currentSettings.olajsavaZaDrugeClane
      : 0);
  const lestvica =
    "https://www.fu.gov.si/fileadmin/Internet/Davki_in_druge_dajatve/Podrocja/Dohodnina/Letna_odmera_dohodnine/Opis/Lestvica_za_leto_2026.docx";

  const olajsaveContent = (
    <div className="flex flex-col gap-3 py-2">
      <fieldset>
        <legend className="mb-1 text-sm font-medium">Vzdrževani otroci</legend>
        <p className="mb-2 text-xs text-muted">
          Posebna olajšava zniža davčno osnovo za dohodnino. Velja za s.&nbsp;p. in
          za plačo v d.&nbsp;o.&nbsp;o., ne pa za normirani s.&nbsp;p.
        </p>
        <div className="flex flex-wrap gap-1">
          {[0, 1, 2, 3, 4, 5].map((n) => (
            <button
              type="button"
              key={n}
              aria-pressed={steviloOtrok === n}
              className={`btn btn-sm ${steviloOtrok === n ? "btn-accent" : "btn-ghost"}`}
              onClick={() => nastavi("steviloOtrok")(n)}
            >
              {n}
            </button>
          ))}
        </div>
        {steviloOtrok > 0 && (
          <p className="mt-1 text-xs text-muted">
            Olajšava: {evri(olajsavaZaOtroke)} na leto
          </p>
        )}
      </fieldset>

      <ToggleOption
        label="Vzdrževani zakonec ali partner"
        description={`Olajšava za vzdrževanega družinskega člana: ${evri(currentSettings.olajsavaZaDrugeClane)} na leto. Pogoj: zakonec ali partner nima lastnih dohodkov oziroma so ti pod zakonsko mejo.`}
        value={currentSettings.vzdrzevaniDrugiClani === true}
        onValueChange={nastavi("vzdrzevaniDrugiClani")}
      />
      {olajsavaVzdrzevaniTotal > 0 && (
        <p className="rounded-lg bg-base-200 p-2 text-xs">
          Skupna olajšava za vzdrževane družinske člane:{" "}
          <span className="font-semibold">
            {evri(olajsavaVzdrzevaniTotal)} na leto
          </span>
        </p>
      )}

      <div className="divider my-0" />

      <ToggleOption
        label="Dodatno pokojninsko zavarovanje (PDPZ)"
        description={`Prostovoljno dodatno pokojninsko zavarovanje. Pri s. p. zniža davčno osnovo, pri d. o. o. premijo plača družba. Največ 24\u00a0% obveznih prispevkov za PIZ in ne več kot ${evri(currentSettings.pdpzMaxZnesek)} na leto.`}
        value={currentSettings.pdpz === true}
        onValueChange={nastavi("pdpz")}
      />
      {currentSettings.pdpz && (
        <CurrencyInput
          icon={<CoinsEuroIcon className="size-5" />}
          label="Letni znesek PDPZ"
          value={currentSettings.pdpzZnesek ?? 2400}
          onChange={nastavi("pdpzZnesek")}
          description={`Vpiši svoja vplačila, največ ${evri(currentSettings.pdpzMaxZnesek)} na leto.`}
        />
      )}
      <Vir href={lestvica}>
        Vir: FURS, Lestvica za odmero dohodnine za leto 2026
      </Vir>
    </div>
  );

  const naprednoContent = (
    <div className="flex flex-col gap-3 py-2">
      <CurrencyInput
        icon={<CoinsEuroIcon className="size-5" />}
        label="Povprečna mesečna plača"
        value={currentSettings.averageIncomeLastYear}
        onChange={nastavi("averageIncomeLastYear")}
        description="Vpliva na prispevke ter na najnižjo in najvišjo zavarovalno osnovo."
      />
      <CurrencyInput
        icon={<CoinsEuroIcon className="size-5" />}
        label="Minimalna mesečna plača"
        value={currentSettings.minimalnaPlaca}
        onChange={nastavi("minimalnaPlaca")}
        description="Vpliva na plačo pri »D.&nbsp;o.&nbsp;o. – največ dividend« in na božičnico."
      />
    </div>
  );

  return (
    <Tabs
      tabs={[
        { id: "olajsave", label: "Olajšave", content: olajsaveContent },
        { id: "sp", label: "S. p.", content: spContent },
        { id: "doo", label: "D. o. o.", content: dooContent },
        { id: "napredno", label: "Napredno", content: naprednoContent },
      ]}
    />
  );
}
