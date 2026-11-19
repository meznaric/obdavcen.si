import { Link } from "react-router";
import { NewsIcon, InformationCircleIcon, Mail02Icon } from "hugeicons-react";
import NewsletterForm from "~/ui/common/NewsletterForm";
import { Text } from "~/ui/common/Text/Text";

export default function WhatsNext() {
  return (
    <>
      <Text variant="h2" as="span" className="text-center pt-24 block">
        Kam naprej?
      </Text>
      <div className="alert text-sm max-w-xl mx-auto" role="alert">
        <NewsIcon className="w-6 h-6 " />
        <div>
          <Text variant="h3">Uči se z mano</Text>
          <p className="py-2">
            Pripravil sem e-novice, v katerih vsakih nekaj tednov delim nove
            stvari, ki sem se jih naučil – o davčnih optimizacijah, delu na
            daljavo in podobnem.
          </p>
          <NewsletterForm />
        </div>
      </div>
      <div className="alert text-sm max-w-xl mx-auto" role="alert">
        <InformationCircleIcon className="w-6 h-6 " />
        <div>
          <Text variant="h3">Kontaktiraj me</Text>
          <p className="py-2">
            Si opazil napake ali imaš predlog, kako bi lahko izboljšal to
            stran?
          </p>
          <Link
            className="btn-sm btn-neutral btn mt-2"
            to="mailto:vito@otivia.com"
          >
            <Mail02Icon className="w-4 h-4 mr-1" />
            vito@otivia.com
          </Link>
        </div>
      </div>
    </>
  );
}
