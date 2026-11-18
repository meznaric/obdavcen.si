import { NavLink } from "@remix-run/react";
import { AlertCircleIcon, Home11Icon } from "hugeicons-react";

export default function ExpandedNav() {
  return (
    <div className="flex justify-center sm:mx-auto gap-4 p-2 rounded-lg bg-base-100 shadow-lg flex-col sm:flex-row">
      <CustomNavLink to="/">
        <Home11Icon className="size-4" />
        Primerjava
      </CustomNavLink>
      <CustomNavLink to="/novosti">
        <AlertCircleIcon className="size-4 text-amber-500" />
        Novosti 2026
      </CustomNavLink>
      {/* <CustomNavLink to="/izplacilo/normirani-sp">Normirani S.P.</CustomNavLink> */}
      {/* <CustomNavLink to="/izplacilo/sp">S.P.</CustomNavLink> */}
      {/* <CustomNavLink to="/izplacilo/doo">D.O.O.</CustomNavLink> */}
    </div>
  );
}

function CustomNavLink({
  children,
  to,
}: {
  children: React.ReactNode;
  to: string;
}) {
  return (
    <NavLink
      className={({ isActive }) => `btn btn-sm ${isActive ? "btn-accent" : ""}`}
      to={to}
      prefetch="intent"
    >
      {children}
    </NavLink>
  );
}
