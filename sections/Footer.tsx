import { Logo } from "@/components/ui/Logo";
import { getFooterData } from "@/utils/api";

const SOCIAL_LINKS = [
  {
    label: "Facebook",
    href: "https://www.facebook.com/resortian",
    icon: (
      <svg className="h-6 w-6 text-[#1877F2]" fill="currentColor" viewBox="0 0 24 24">
        <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.469h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.469h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
      </svg>
    ),
    hoverClass: "hover:bg-[#1877F2]/10 hover:border-[#1877F2]/50"
  },
  {
    label: "YouTube",
    href: "https://www.youtube.com/@resortian",
    icon: (
      <svg className="h-6 w-6 text-[#FF0000]" fill="currentColor" viewBox="0 0 24 24">
        <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
      </svg>
    ),
    hoverClass: "hover:bg-[#FF0000]/10 hover:border-[#FF0000]/50"
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
            <p className="mt-4 max-w-xs text-sm font-medium text-black dark:text-gray-200">
              Resortian.com is trademark of{" "}
              <strong>Resortian Tourism Services</strong>, officially registered
              under Dhaka North City Corporation.
            </p>
            <p className="mt-2 max-w-xs text-sm font-medium text-black dark:text-gray-200">
              Our Office: Army Building, Dorji Bari, Uttarpara, Khilkhet,
              Dhaka 1229
            </p>
            <div className="mt-6 flex items-center gap-4">
              {SOCIAL_LINKS.map((social) => (
                <a
                  key={social.label}
                  href={social.href}
                  target="_blank"
                  className={`flex h-11 w-11 items-center justify-center rounded-xl bg-white dark:bg-gray-800 shadow-sm border border-gray-200 dark:border-gray-700 transition-all duration-300 hover:scale-105 ${social.hoverClass}`}
                  aria-label={social.label}
                >
                  {social.icon}
                </a>
              ))}
            </div>
          </div>

          {columns.map((column) => (
            <div key={column.title}>
              <h3 className="text-base font-extrabold text-black dark:text-white">
                {column.title}
              </h3>
              <ul className="mt-4 space-y-2.5">
                {column.links.map((link) => (
                  <li key={link.label}>
                    <a
                      href={link.href}
                      className="text-sm font-medium text-black transition-colors hover:text-primary-600 dark:text-gray-300 dark:hover:text-primary-400"
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
          <p className="text-sm font-medium text-black dark:text-gray-300">
            &copy; {new Date().getFullYear()} Resortian. All rights reserved.
          </p>
          <div className="flex gap-6">
            <a
              href="/privacy"
              className="text-sm font-medium text-black transition-colors hover:text-gray-900 dark:text-gray-300 dark:hover:text-white"
            >
              Privacy Policy
            </a>
            <a
              href="/terms"
              className="text-sm font-medium text-black transition-colors hover:text-gray-900 dark:text-gray-300 dark:hover:text-white"
            >
              Terms of Service
            </a>
            <a
              href="/sitemap.xml"
              className="text-sm font-medium text-black transition-colors hover:text-gray-900 dark:text-gray-300 dark:hover:text-white"
            >
              Sitemap
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
