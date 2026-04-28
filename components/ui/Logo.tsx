import Link from "next/link";
import Image from "next/image";

export function Logo() {
  return (
    <Link href="/" className="flex items-center gap-2">
      <Image
        src="/images/logo.svg"
        alt="Resortian"
        width={100}
        height={100}
        className="rounded-lg dark:hidden"
      />
      <Image
        src="/images/logoDark.svg"
        alt="Resortian"
        width={100}
        height={100}
        className="hidden rounded-lg dark:block"
      />
    </Link>
  );
}
