import { Logo } from "@/components/ui/Logo";
import { getFooterData } from "@/utils/api";

const SOCIAL_LINKS = [
  {
    label: "Facebook",
    href: "https://www.facebook.com/resortian",
    path: "M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z",
  },
  // {
  //   label: "Twitter",
  //   href: "#",
  //   path: "M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.3-18 11.6 2.2.1 4.4-.6 6-2C3 15.5.5 9.6 3 5c2.2 2.6 5.6 4.1 9 4-.9-4.2 4-6.6 7-3.8 1.1 0 3-1.2 3-1.2z",
  // },
  // {
  //   label: "Instagram",
  //   href: "#",
  //   path: "M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37zM17.5 6.5h.01M7.5 2h9A5.5 5.5 0 0 1 22 7.5v9a5.5 5.5 0 0 1-5.5 5.5h-9A5.5 5.5 0 0 1 2 16.5v-9A5.5 5.5 0 0 1 7.5 2z",
  // },
  {
    label: "YouTube",
    href: "https://www.youtube.com/@resortian",
    path: "M2.5 17a24.12 24.12 0 0 1 0-10 2 2 0 0 1 1.4-1.4 49.56 49.56 0 0 1 16.2 0A2 2 0 0 1 21.5 7a24.12 24.12 0 0 1 0 10 2 2 0 0 1-1.4 1.4 49.55 49.55 0 0 1-16.2 0A2 2 0 0 1 2.5 17zM10 15l5-3-5-3z",
  },
];

export async function Footer() {
  const columns = await getFooterData();

  return (
    <footer className="border-t border-gray-200 bg-gradient-to-b from-primary-100/80 via-white to-primary-50 dark:border-gray-800 dark:from-gray-900 dark:via-gray-900 dark:to-gray-900/80">
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-6">
          <div className="sm:col-span-2">
            <Logo />
            {/* <Image
              src="/images/logoBlack.svg"
              alt="Resortian"
              width={100}
              height={100}
              className="rounded-lg dark:hidden"
            />
            <Image
              src="/images/logo.svg"
              alt="Resortian"
              width={100}
              height={100}
              className="hidden rounded-lg dark:block"
            /> */}
            <p className="mt-4 max-w-xs text-sm text-gray-600 dark:text-gray-400">
              Resortian.com is trademark of{" "}
              <strong>Resortian Tourism Services</strong>, officially registered
              under Dhaka North City Corporation.
            </p>
            <p className="mt-2 max-w-xs text-sm text-gray-600 dark:text-gray-400">
              Our Office: Army Building, Dorji Bari, Uttarpara, Khilkhet,
              Dhaka 1229
            </p>
            <div className="mt-6 flex items-center gap-3">
              {SOCIAL_LINKS.map((social) => (
                <a
                  key={social.label}
                  href={social.href}
                  target="_blank"
                  className="flex h-9 w-9 items-center justify-center rounded-lg text-gray-500 transition-colors hover:bg-gray-100 hover:text-gray-900 dark:text-gray-400 dark:hover:bg-gray-800 dark:hover:text-white"
                  aria-label={social.label}
                >
                  <svg
                    className="h-4 w-4"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d={social.path} />
                  </svg>
                </a>
              ))}
            </div>
          </div>

          {columns.map((column) => (
            <div key={column.title}>
              <h3 className="text-sm font-semibold text-gray-900 dark:text-white">
                {column.title}
              </h3>
              <ul className="mt-4 space-y-2.5">
                {column.links.map((link) => (
                  <li key={link.label}>
                    <a
                      href={link.href}
                      className="text-sm text-gray-600 transition-colors hover:text-primary-600 dark:text-gray-400 dark:hover:text-primary-400"
                    >
                      {link.label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="mt-12 flex flex-col items-center justify-between gap-4 border-t border-gray-200 pt-8 dark:border-gray-800 sm:flex-row">
          <p className="text-sm text-gray-500 dark:text-gray-400">
            &copy; {new Date().getFullYear()} Resortian. All rights reserved.
          </p>
          <div className="flex gap-6">
            <a
              href="/privacy"
              className="text-sm text-gray-500 transition-colors hover:text-gray-900 dark:text-gray-400 dark:hover:text-white"
            >
              Privacy Policy
            </a>
            <a
              href="/terms"
              className="text-sm text-gray-500 transition-colors hover:text-gray-900 dark:text-gray-400 dark:hover:text-white"
            >
              Terms of Service
            </a>
            <a
              href="/sitemap.xml"
              className="text-sm text-gray-500 transition-colors hover:text-gray-900 dark:text-gray-400 dark:hover:text-white"
            >
              Sitemap
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
