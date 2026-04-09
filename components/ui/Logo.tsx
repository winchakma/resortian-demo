import Link from "next/link";
import Image from "next/image";

export function Logo() {
  return (
    <Link href="/" className="flex items-center gap-2">
      <Image
        src="/images/logo.png"
        alt="Logo"
        width={140}
        height={140}
        className="rounded-lg"
      />
    </Link>
  );
}
