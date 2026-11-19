import { Text } from "../Text/Text";
import { Link } from "react-router";
import { NewTwitterIcon, Linkedin02Icon, ArrowRight01Icon, Github01Icon } from "hugeicons-react";

export default function Footer() {
  return (
    <>
      <div className="text-center pt-32 space-y-8">
        <Text variant="bodyLarge">Najdi me na družbenih omrežjih</Text>
      </div>
      <div className="flex justify-center mt-8 gap-4 pb-4">
        <Link
          to="https://github.com/meznaric/obdavcen.si"
          className="bg-[#F0F6FB] rounded-full p-2 hover:bg-gray-400"
          aria-label="Izvorna koda na GitHubu"
        >
          <Github01Icon className="w-8 h-8 text-[#02040A]" />
        </Link>
        <Link
          to="https://twitter.com/otivdev"
          className="bg-[#000000] rounded-full p-2 hover:bg-gray-400"
          aria-label="Profil na omrežju X"
        >
          <NewTwitterIcon className="w-8 h-8 text-[#ffffff]" />
        </Link>
        <Link
          to="https://linkedin.com/in/meznaric"
          className="bg-[#0077b5] rounded-full p-2 hover:bg-gray-400"
          aria-label="Profil na LinkedInu"
        >
          <Linkedin02Icon className="w-8 h-8 text-[#f5f5f5]" />
        </Link>
      </div>
      <a
        className="card bg-green-800 text-green-200 max-w-(--breakpoint-sm) shadow-xl mx-auto hover:bg-green-700"
        href="https://grandpacad.com/"
      >
        <div className="card-body flex-row gap-4 sm:gap-6 items-center max-sm:p-5">
          <img src="https://grandpacad.com/logos/house_logo_128.png" alt="GrandpaCAD.com"
            className="size-16 sm:size-20"
          />
          <div className="space-y-2 min-w-0">
            <h2 className="card-title">
              <span>
                GrandpaCAD.com
              </span>
            </h2>
            <p>
              Imaš 3D-tiskalnik? To je moj novi projekt za vse, ki se jim ne da ali ne znajo modelirati.
            </p>
          </div>
        <ArrowRight01Icon className="size-8 sm:size-16 shrink-0 ml-auto" />
        </div>
      </a>
      <a className="card bg-indigo-800 text-indigo-200 max-w-(--breakpoint-sm) shadow-xl mx-auto hover:bg-indigo-700"
              href="https://stanovanjskiproblem.com/"
      >
        <div className="card-body flex-row gap-4 sm:gap-6 items-center max-sm:p-5">
          <div className="min-w-0">
            <h2 className="card-title">
              <span>
                Stanovanjski<wbr /><span className="opacity-80">Problem</span><wbr />.com
              </span>
            </h2>
            <p>
              Kakšno stanovanje si lahko privoščiš? Kalkulator naših prijateljev!
            </p>
          </div>
        <ArrowRight01Icon className="size-8 sm:size-16 shrink-0 ml-auto" />
        </div>
      </a>
    </>
  );
}
