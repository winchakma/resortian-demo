interface SectionHeadingProps {
  title: string;
  subtitle?: string;
  align?: "left" | "center";
}

export function SectionHeading({
  title,
  subtitle,
  align = "left",
}: SectionHeadingProps) {
  return (
    <div
      className={`mb-8 ${
        align === "center" ? "text-center" : ""
      }`}
    >
      <h2 className="text-3xl font-extrabold text-black dark:text-white sm:text-4xl">
        {title}
      </h2>
      {subtitle && (
        <p className="mt-2 text-base font-medium text-black dark:text-gray-300">{subtitle}</p>
      )}
    </div>
  );
}
