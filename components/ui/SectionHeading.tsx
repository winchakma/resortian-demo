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
      <h2 className="text-2xl font-bold text-gray-900 dark:text-white sm:text-3xl">
        {title}
      </h2>
      {subtitle && (
        <p className="mt-2 text-gray-600 dark:text-gray-400">{subtitle}</p>
      )}
    </div>
  );
}
