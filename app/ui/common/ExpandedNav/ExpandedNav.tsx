import { NavLink } from "react-router";
import { AlertCircleIcon, ChartIncreaseIcon, Home11Icon } from "hugeicons-react";
import { twMerge } from "tailwind-merge";

export default function ExpandedNav() {
  return (
    <div className="flex justify-center sm:mx-auto gap-4 p-2 rounded-lg bg-base-100 shadow-lg flex-col sm:flex-row">
      <CustomNavLink to="/" icon={Home11Icon}>
        Primerjava
      </CustomNavLink>
      <CustomNavLink to="/novosti" icon={AlertCircleIcon} iconClassName="text-info">
        Novosti 2026
      </CustomNavLink>
      <CustomNavLink
        to="/davek-na-delnice-in-etf"
        icon={ChartIncreaseIcon}
        iconClassName="text-success"
      >
        Delnice in ETF
      </CustomNavLink>
      {/* <CustomNavLink to="/izplacilo/normirani-sp">Normirani s. p.</CustomNavLink> */}
      {/* <CustomNavLink to="/izplacilo/sp">S. p.</CustomNavLink> */}
      {/* <CustomNavLink to="/izplacilo/doo">D. o. o.</CustomNavLink> */}
    </div>
  );
}

function CustomNavLink({
  children,
  to,
  icon: Icon,
  iconClassName,
}: {
  children: React.ReactNode;
  to: string;
  icon: React.ComponentType<{ className?: string }>;
  // Barva ikone, ko povezava ni aktivna (na aktivnem gumbu ima barvo besedila)
  iconClassName?: string;
}) {
  return (
    <NavLink
      className={({ isActive }) => twMerge("btn btn-sm", isActive && "btn-accent")}
      to={to}
      prefetch="intent"
    >
      {({ isActive }) => (
        <>
          <Icon className={twMerge("size-4", !isActive && iconClassName)} />
          {children}
        </>
      )}
    </NavLink>
  );
}
