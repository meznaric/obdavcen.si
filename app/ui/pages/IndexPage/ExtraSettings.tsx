import { SharedInputs, YearSettings } from "~/constants/types";
import { CoinsEuroIcon, InformationCircleIcon } from "hugeicons-react";
import CurrencyInput from "~/ui/common/Input/CurrencyInput";
import { getMinimalnaOsnova, getRealniPrispevek } from "~/utils/prispevki";
import formatCurrency from "~/utils/formatCurrency";
import { AnimatePresence, motion } from "framer-motion";
import { getNormiraniExpenses } from "~/utils/taxCalculator/normiraniSp";
import { getOlajsavaVzdrzevaniClani } from "~/utils/dohodnina";
import { getNagradaMax } from "~/utils/taxCalculator/doo";
import { Tabs } from "~/ui/common/Tabs/Tabs";
import { ToggleOption } from "~/ui/common/ToggleOption/ToggleOption";

type Props = {
  currentSettings: YearSettings;
  updateCurrentSettings: (settings: YearSettings) => void;
  updateSharedInputs: (SharedInputs: SharedInputs) => void;
  sharedInputs: SharedInputs;
};

export default function ExtraSettings({
  currentSettings,
  updateCurrentSettings,
  updateSharedInputs,
  sharedInputs,
}: Props) {
  const handleNumberChange =
    (field: keyof YearSettings) => (value: string | number) => {
      updateCurrentSettings({
        ...currentSettings,
        [field]: value,
      });
    };

  const handleSharedInputsChange =
    (field: keyof SharedInputs) => (value: string | number) => {
      updateSharedInputs({
        ...sharedInputs,
        [field]: value,
      });
    };

  const spZavarovanecClen = currentSettings.spZavarovanecClen ?? 15;

  const { prispevki: minimalniPrispevki } = getRealniPrispevek(
    getMinimalnaOsnova(currentSettings.averageIncomeLastYear, spZavarovanecClen),
    { revenue: 0, expenses: 0, salaryGross1: 0 },
    currentSettings
  );

  const { prispevki: lanskiPrispevki } = getRealniPrispevek(
    getMinimalnaOsnova(currentSettings.averageIncomeLastYear, spZavarovanecClen),
    sharedInputs,
    currentSettings
  );

  const { prispevki: lanskiPrispevkiNormiranec } = getRealniPrispevek(
    getMinimalnaOsnova(currentSettings.averageIncomeLastYear, spZavarovanecClen),
    {
      ...sharedInputs,
      expenses: getNormiraniExpenses(
        sharedInputs.revenue,
        currentSettings.normiranSPAcceptedExpenses
      ),
    },
    currentSettings
  );

  const splosnoContent = (
    <div className="flex flex-col py-2">
      <CurrencyInput
        icon={<CoinsEuroIcon className="size-5" />}
        label="Lanski prispevki (Vpliva na SP in Normirani SP)"
        placeholder={`Nastavi poljubno vrednost...`}
        value={sharedInputs.lanskiPrispevki || 0}
        description={
          <table className="table-zebra table-xs">
            <tbody>
              <tr>
                <td>Minimalni prispevki</td>
                <td>{formatCurrency(minimalniPrispevki)}</td>
                <td>
                  <button
                    className="link-accent"
                    onClick={() =>
                      handleSharedInputsChange("lanskiPrispevki")(
                        minimalniPrispevki
                      )
                    }
                  >
                    Izberi
                  </button>
                </td>
              </tr>
              <tr>
                <td>Normirani SP</td>
                <td>{formatCurrency(lanskiPrispevkiNormiranec)}</td>
                <td>
                  <button
                    className="link-accent"
                    onClick={() =>
                      handleSharedInputsChange("lanskiPrispevki")(
                        lanskiPrispevkiNormiranec
                      )
                    }
                  >
                    Izberi
                  </button>
                </td>
              </tr>
              <tr>
                <td>SP</td>
                <td>{formatCurrency(lanskiPrispevki)}</td>
                <td>
                  <button
                    className="link-accent"
                    onClick={() =>
                      handleSharedInputsChange("lanskiPrispevki")(
                        lanskiPrispevki
                      )
                    }
                  >
                    Izberi
                  </button>
                </td>
              </tr>
            </tbody>
          </table>
        }
        onChange={handleSharedInputsChange("lanskiPrispevki")}
      />
      <AnimatePresence>
        {(!sharedInputs.lanskiPrispevki ||
          isNaN(sharedInputs.lanskiPrispevki)) && (
          <motion.div
            className="overflow-hidden"
            initial={{ height: 0 }}
            animate={{ height: "auto" }}
            exit={{ height: 0 }}
          >
            <div className="alert text-sm alert-bordered">
              <InformationCircleIcon className="size-5 text-blue-500" />
              <div>
                Prispevki so odvisni od dobička in lanskih prispevkov.
                <br /> Ta kalkulator se poizkuša približati realnim prispevkom s
                tem da naredi 2 iteraciji.
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
      <CurrencyInput
        icon={<CoinsEuroIcon className="size-5" />}
        label="Povprečna plača"
        value={currentSettings.averageIncomeLastYear}
        onChange={handleNumberChange("averageIncomeLastYear")}
        description="Vpliva na izračun prispevkov, minimalne in maksimalne zavarovalne osnove"
      />
      <CurrencyInput
        icon={<CoinsEuroIcon className="size-5" />}
        label="Minimalna plača"
        value={currentSettings.minimalnaPlaca}
        onChange={handleNumberChange("minimalnaPlaca")}
        description="Vpliva na končno plačo pri 'DOO Minimalna Plača'"
      />
    </div>
  );

  const spContent = (
    <div className="flex flex-col gap-3 py-2">
      <div>
        <p className="text-sm font-medium mb-2">Zavarovanec status (ZPIZ-2)</p>
        <div className="flex flex-col gap-1">
          <label className="flex items-center gap-2 cursor-pointer p-2 rounded-lg hover:bg-base-200">
            <input
              type="radio"
              className="radio radio-sm radio-accent"
              checked={spZavarovanecClen === 15}
              onChange={() =>
                updateCurrentSettings({
                  ...currentSettings,
                  spZavarovanecClen: 15,
                })
              }
            />
            <div>
              <span className="text-sm">Samozaposlen (člen 15)</span>
              <p className="text-xs text-gray-500">
                Min. osnova: 60% povprečne plače, množitelj: 0,75
              </p>
            </div>
          </label>
          <label className="flex items-center gap-2 cursor-pointer p-2 rounded-lg hover:bg-base-200">
            <input
              type="radio"
              className="radio radio-sm radio-accent"
              checked={spZavarovanecClen === 16}
              onChange={() =>
                updateCurrentSettings({
                  ...currentSettings,
                  spZavarovanecClen: 16,
                })
              }
            />
            <div>
              <span className="text-sm">Družbenik (člen 16)</span>
              <p className="text-xs text-gray-500">
                Min. osnova: 90% povprečne plače, brez množitelja
              </p>
            </div>
          </label>
          <label className="flex items-center gap-2 cursor-pointer p-2 rounded-lg hover:bg-base-200">
            <input
              type="radio"
              className="radio radio-sm radio-accent"
              checked={spZavarovanecClen === 17}
              onChange={() =>
                updateCurrentSettings({
                  ...currentSettings,
                  spZavarovanecClen: 17,
                })
              }
            />
            <div>
              <span className="text-sm">Kmet (člen 17)</span>
              <p className="text-xs text-gray-500">
                Min. osnova: 60% povprečne plače, množitelj: 0,75
              </p>
            </div>
          </label>
        </div>
      </div>
      <p className="text-xs text-gray-500">
        Vpliva na minimalno zavarovalno osnovo in množitelj za izračun
        prispevkov. Člen 16 (družbenik) ima višjo minimalno osnovo (90% vs 60%)
        in ne uporablja množitelja 0,75.
      </p>
      <a
        href="https://zakonodaja.com/pravilnik/zpiz-2-pdzo/2-clen-zavarovalna-osnova"
        target="_blank"
        rel="noopener noreferrer"
        className="link link-accent text-xs"
      >
        Vir: ZPIZ-2-PDZO, 2. člen — Zavarovalna osnova
      </a>

      <div className="divider my-0" />

      <div>
        <p className="text-sm font-medium mb-2">Znižani prispevki (novo registrirani S.P.)</p>
        <div className="flex flex-col gap-1">
          <label className="flex items-center gap-2 cursor-pointer p-2 rounded-lg hover:bg-base-200">
            <input
              type="radio"
              className="radio radio-sm radio-accent"
              checked={!currentSettings.spZnizaniPrispevki || currentSettings.spZnizaniPrispevki === 'brez'}
              onChange={() =>
                updateCurrentSettings({
                  ...currentSettings,
                  spZnizaniPrispevki: 'brez',
                })
              }
            />
            <div>
              <span className="text-sm">Brez znižanja</span>
            </div>
          </label>
          <label className="flex items-center gap-2 cursor-pointer p-2 rounded-lg hover:bg-base-200">
            <input
              type="radio"
              className="radio radio-sm radio-accent"
              checked={currentSettings.spZnizaniPrispevki === 'prvo'}
              onChange={() =>
                updateCurrentSettings({
                  ...currentSettings,
                  spZnizaniPrispevki: 'prvo',
                })
              }
            />
            <div>
              <span className="text-sm">Prvo leto — 50% znižanje PIZ prispevkov</span>
              <p className="text-xs text-gray-500">
                Prvih 12 mesecev poslovanja
              </p>
            </div>
          </label>
          <label className="flex items-center gap-2 cursor-pointer p-2 rounded-lg hover:bg-base-200">
            <input
              type="radio"
              className="radio radio-sm radio-accent"
              checked={currentSettings.spZnizaniPrispevki === 'drugo'}
              onChange={() =>
                updateCurrentSettings({
                  ...currentSettings,
                  spZnizaniPrispevki: 'drugo',
                })
              }
            />
            <div>
              <span className="text-sm">Drugo leto — 30% znižanje PIZ prispevkov</span>
              <p className="text-xs text-gray-500">
                Naslednjih 12 mesecev poslovanja (13.–24. mesec)
              </p>
            </div>
          </label>
        </div>
      </div>
      <a
        href="https://www.racunovodstvo.net/zakonodaja/zpiz/145-clen"
        target="_blank"
        rel="noopener noreferrer"
        className="link link-accent text-xs"
      >
        Vir: ZPIZ-2, 145. člen, odstavek 14 — Znižani prispevki za nove S.P.
      </a>
    </div>
  );

  const malicaLetna =
    currentSettings.malicaDnevniZnesek * 21 * 12;

  const dooContent = (
    <div className="flex flex-col gap-3 py-2">
      <ToggleOption
        label="Družbenik-poslovodja"
        description="Za enoosebni D.O.O., kjer je lastnik hkrati poslovodja, se minimalna osnova za prispevke izračuna od 90% povprečne plače (zavarovalna podlaga 040), ne glede na dejansko bruto plačo."
        value={currentSettings.dooDruzbenikPoslovodja !== false}
        onValueChange={(value) =>
          updateCurrentSettings({
            ...currentSettings,
            dooDruzbenikPoslovodja: value,
          })
        }
      />
      <a
        href="https://mladipodjetnik.si/novice-in-dogodki/novice/prispevki-za-enoosebni-d-o-o-za-poslovodne-osebe"
        target="_blank"
        rel="noopener noreferrer"
        className="link link-accent text-xs"
      >
        Vir: Mladi Podjetnik
      </a>
      <ToggleOption
        label="Malica"
        description={`Povračilo stroškov prehrane med delom — ${formatCurrency(currentSettings.malicaDnevniZnesek)}/dan × 21 dni × 12 mes. = ${formatCurrency(malicaLetna)}/leto. Neobdavčeno do zakonske meje.`}
        value={currentSettings.malica !== false}
        onValueChange={(value) =>
          updateCurrentSettings({
            ...currentSettings,
            malica: value,
          })
        }
      />
      <a
        href="https://podjetnik.aktualno.si/malica-2025-povracilo-stroska-prehrane-med-delom/"
        target="_blank"
        rel="noopener noreferrer"
        className="link link-accent text-xs"
      >
        Vir: 44. člen ZDoh-2, Uredba o višini povračil stroškov v zvezi z delom
      </a>

      <ToggleOption
        label="Prevozni stroški"
        description={`Povračilo stroškov prevoza na delo — ${formatCurrency(currentSettings.prevozniStroskiMesecniZnesek)}/mes. × 12 mes. = ${formatCurrency(currentSettings.prevozniStroskiMesecniZnesek * 12)}/leto. Neobdavčeno do 0,21 €/km.`}
        value={currentSettings.prevozniStroski === true}
        onValueChange={(value) =>
          updateCurrentSettings({
            ...currentSettings,
            prevozniStroski: value,
          })
        }
      />
      {currentSettings.prevozniStroski && (
        <CurrencyInput
          icon={<CoinsEuroIcon className="size-5" />}
          label="Mesečni znesek prevoza"
          value={currentSettings.prevozniStroskiMesecniZnesek}
          onChange={handleNumberChange("prevozniStroskiMesecniZnesek")}
          description="Prilagodite glede na dejansko razdaljo (0,21 €/km × razdalja × 21 dni)"
        />
      )}
      <a
        href="https://data.si/blog/kilometrina-2025/"
        target="_blank"
        rel="noopener noreferrer"
        className="link link-accent text-xs"
      >
        Vir: Uredba o višini povračil stroškov v zvezi z delom, 3. člen
      </a>

      <ToggleOption
        label="Regres za letni dopust"
        description={`Obvezno letno izplačilo — neobdavčen do ${formatCurrency(currentSettings.averageIncomeLastYear)} (100% povprečne plače).`}
        value={currentSettings.regres !== false}
        onValueChange={(value) =>
          updateCurrentSettings({
            ...currentSettings,
            regres: value,
          })
        }
      />
      <a
        href="https://cekin.si/zaposlitev/zaposleni/za-toliko-se-bo-letos-zvisal-regres.html"
        target="_blank"
        rel="noopener noreferrer"
        className="link link-accent text-xs"
      >
        Vir: 131. člen ZDR-1, 44. člen ZDoh-2
      </a>

      <ToggleOption
        label="Božičnica / Zimski regres"
        description={
          currentSettings.bozicnicaOprostPrispevkov
            ? `Pol minimalne plače (${formatCurrency(currentSettings.minimalnaPlaca / 2)}) — brez dohodnine in prispevkov.`
            : `Pol minimalne plače (${formatCurrency(currentSettings.minimalnaPlaca / 2)}) — brez dohodnine, prispevki se obračunajo.`
        }
        value={currentSettings.bozicnica !== false}
        onValueChange={(value) =>
          updateCurrentSettings({
            ...currentSettings,
            bozicnica: value,
          })
        }
      />
      <a
        href="https://data.si/blog/bozicnica-ni-obdavcena-a-od-nje-so-odvedeni-prispevki/"
        target="_blank"
        rel="noopener noreferrer"
        className="link link-accent text-xs"
      >
        Vir: ZPZR 12. člen, 44. člen ZDoh-2
      </a>

      <ToggleOption
        label="Nagrada za poslovno uspešnost"
        description={`Neobdavčena do ${formatCurrency(getNagradaMax(currentSettings))} (100% povprečne plače${currentSettings.bozicnicaLocenOdNagrade ? '' : ' minus božičnica'}). Prispevki se obračunajo.`}
        value={currentSettings.nagradaPoslovnaUspesnost !== false}
        onValueChange={(value) =>
          updateCurrentSettings({
            ...currentSettings,
            nagradaPoslovnaUspesnost: value,
          })
        }
      />
      {currentSettings.nagradaPoslovnaUspesnost !== false && (
        <CurrencyInput
          icon={<CoinsEuroIcon className="size-5" />}
          label="Znesek nagrade"
          value={currentSettings.nagradaZnesek ?? getNagradaMax(currentSettings)}
          onChange={handleNumberChange("nagradaZnesek")}
          description={`Prilagodite glede na dejanski znesek (največ ${formatCurrency(getNagradaMax(currentSettings))} neobdavčeno)`}
        />
      )}
      <a
        href="https://www.konto.si/aktualno/82/placilo_za_poslovno_uspesnost_bozicnica_zimski_regres/"
        target="_blank"
        rel="noopener noreferrer"
        className="link link-accent text-xs"
      >
        Vir: 44. člen ZDoh-2
      </a>
    </div>
  );

  const steviloOtrok = currentSettings.steviloOtrok ?? 0;
  const olajsavaVzdrzevaniTotal = getOlajsavaVzdrzevaniClani(currentSettings);
  const pdpzZnesek = currentSettings.pdpzZnesek ?? 2400;

  const olajsaveContent = (
    <div className="flex flex-col gap-3 py-2">
      <div>
        <p className="text-sm font-medium mb-2">Vzdrževani otroci</p>
        <p className="text-xs text-gray-500 mb-2">
          Posebna olajšava za vzdrževane otroke — zmanjša davčno osnovo za dohodnino.
          Velja za S.P. in D.O.O. (na plačo). Ne velja za normirani S.P.
        </p>
        <div className="flex gap-1">
          {[0, 1, 2, 3, 4, 5].map((n) => (
            <button
              key={n}
              className={`btn btn-sm ${
                steviloOtrok === n ? "btn-accent" : "btn-ghost"
              }`}
              onClick={() =>
                updateCurrentSettings({
                  ...currentSettings,
                  steviloOtrok: n,
                })
              }
            >
              {n}
            </button>
          ))}
        </div>
        {steviloOtrok > 0 && (
          <p className="text-xs text-gray-500 mt-1">
            Olajšava: {formatCurrency(olajsavaVzdrzevaniTotal - (currentSettings.vzdrzevaniDrugiClani ? currentSettings.olajsavaZaDrugeClane : 0))}/leto
          </p>
        )}
      </div>
      <a
        href="https://www.zvezarfr.si/pripomocki/uporabni-podatki/a-lestvica-za-odmero-dohodnine"
        target="_blank"
        rel="noopener noreferrer"
        className="link link-accent text-xs"
      >
        Vir: 114. člen ZDoh-2 — Posebna olajšava za vzdrževane družinske člane
      </a>

      <ToggleOption
        label="Vzdrževan zakonec/partner"
        description={`Olajšava za vzdrževanega družinskega člana — ${formatCurrency(currentSettings.olajsavaZaDrugeClane)}/leto. Pogoj: zakonec/partner brez lastnih dohodkov ali z dohodki pod zakonsko mejo.`}
        value={currentSettings.vzdrzevaniDrugiClani === true}
        onValueChange={(value) =>
          updateCurrentSettings({
            ...currentSettings,
            vzdrzevaniDrugiClani: value,
          })
        }
      />

      {olajsavaVzdrzevaniTotal > 0 && (
        <div className="text-xs bg-base-200 rounded-lg p-2">
          Skupna olajšava za vzdrževane člane: <span className="font-semibold">{formatCurrency(olajsavaVzdrzevaniTotal)}/leto</span>
        </div>
      )}

      <div className="divider my-0" />

      <ToggleOption
        label="Dodatno pokojninsko zavarovanje (PDPZ)"
        description={`Prostovoljno dodatno pokojninsko zavarovanje — za S.P. zmanjša davčno osnovo, za D.O.O. je strošek podjetja. Največ ${formatCurrency(currentSettings.pdpzMaxZnesek)}/leto (5,844% bruto plače).`}
        value={currentSettings.pdpz === true}
        onValueChange={(value) =>
          updateCurrentSettings({
            ...currentSettings,
            pdpz: value,
          })
        }
      />
      {currentSettings.pdpz && (
        <CurrencyInput
          icon={<CoinsEuroIcon className="size-5" />}
          label="Letni znesek PDPZ"
          value={pdpzZnesek}
          onChange={handleNumberChange("pdpzZnesek")}
          description={`Prilagodite glede na vaš znesek vplačil (največ ${formatCurrency(currentSettings.pdpzMaxZnesek)}/leto)`}
        />
      )}
      <a
        href="https://www.pokojninskad-a.si/varcevanje/dodatno-pokojninsko-zavarovanje-davcna-olajsava"
        target="_blank"
        rel="noopener noreferrer"
        className="link link-accent text-xs"
      >
        Vir: 117. člen ZDoh-2 — Olajšava za prostovoljno dodatno pokojninsko zavarovanje
      </a>
    </div>
  );

  return (
    <Tabs
      tabs={[
        { id: "splosno", label: "Splošno", content: splosnoContent },
        { id: "olajsave", label: "Olajšave", content: olajsaveContent },
        { id: "sp", label: "S.P.", content: spContent },
        { id: "doo", label: "D.O.O.", content: dooContent },
      ]}
    />
  );
}
