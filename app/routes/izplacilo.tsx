import { Outlet } from "@remix-run/react";
import { AiIdeaIcon, ChartDecreaseIcon } from "hugeicons-react";
import ExpandedNav from "~/ui/common/ExpandedNav/ExpandedNav";
import Footer from "~/ui/common/Footer/Footer";
import WhatsNext from "~/ui/pages/IndexPage/WhatsNext";

export default function BlogsIndex() {
  return (
    <div className="p-4 gap-4 flex flex-col">
      <ChartDecreaseIcon className="size-12 text-red-500 mx-auto" />
      <ExpandedNav />
      <div className="alert shadow-lg max-w-xl mx-auto" role="alert">
        <AiIdeaIcon className="w-6 h-6 text-yellow-500" />
        <div>
          <strong>Članek je informativne narave</strong>
          <br />
          <span className="text-xs">
            Za 100% legalno pravilne nasvete se obrnite na davčnega svetovalca.
          </span>
        </div>
      </div>
      <article className="prose mx-auto mt-8 max-md:max-w-full">
        <Outlet />
      </article>
      <WhatsNext />
      <Footer />
    </div>
  );
}
