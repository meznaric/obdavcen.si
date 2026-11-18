export default function OptionHolder({
  children,
}: {
  children: React.ReactNode;
}) {
  return <div className="bg-gray-900 rounded-lg h-full">{children}</div>;
}
