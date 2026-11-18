import { Text } from "../Text/Text";
import { Link } from "@remix-run/react";
import { NewTwitterIcon, Linkedin02Icon, ArrowRight01Icon, Github01Icon } from "hugeicons-react";

export default function Footer() {
  return (
    <>
      <div className="text-center pt-32 space-y-8">
        <Text variant="bodyLarge">Najdi me na socialnih omrežjih</Text>
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
        >
          <NewTwitterIcon className="w-8 h-8 text-[#ffffff]" />
        </Link>
        <Link
          to="https://linkedin.com/in/meznaric"
          className="bg-[#0077b5] rounded-full p-2 hover:bg-gray-400"
        >
          <Linkedin02Icon className="w-8 h-8 text-[#f5f5f5]" />
        </Link>
      </div>
      <a
        className="card bg-green-800 text-green-200 max-w-screen-sm shadow-xl mx-auto hover:bg-green-700"
        href="https://grandpacad.com/"
      >
        <div className="card-body flex-row gap-6 items-center">
          <img src="https://grandpacad.com/logos/house_logo_128.png" alt="GrandpaCAD.com"
            className="size-20"
          />
          <div className="space-y-2">
            <h2 className="card-title">
              <span>
                GrandpaCAD.com
              </span>
            </h2>
            <p>
              Imaš 3D printer? To je moj nov projekt za vse, ki se jim ne da ali ne znajo modelirati.
            </p>
          </div>
        <ArrowRight01Icon className="size-16 shrink-0 ml-auto" />
        </div>
      </a>
      <a className="card bg-indigo-800 text-indigo-200 max-w-screen-sm shadow-xl mx-auto hover:bg-indigo-700"
              href="https://stanovanjskiproblem.com/"
      >
        <div className="card-body flex-row gap-6 items-center">
          <div>
            <h2 className="card-title">
              <span>
                Stanovanjski<span className="opacity-70">Problem</span>.com
              </span>
            </h2>
            <p>
              Kakšno stanovanje si lahko privoščiš? Kalkulator naših prijateljev!
            </p>
          </div>
        <ArrowRight01Icon className="size-16 shrink-0 ml-auto" />
        </div>
      </a>
    </>
  );
}
