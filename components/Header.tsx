import Link from "next/link";

export default function Header() {
  return (
    <header className="border-b border-dust-line">
      <div className="max-w-content mx-auto px-4 sm:px-6 py-4 flex items-center justify-between">
        <Link href="/" className="font-brand text-xl text-rust tracking-tight">
          Salvage Row
        </Link>
        <nav className="flex gap-5 text-sm">
          <Link href="/" className="hover:text-rust transition-colors">
            Browse
          </Link>
          <Link href="/#qa" className="hover:text-rust transition-colors">
            Catalogue Q&amp;A
          </Link>
          <Link href="/notes" className="hover:text-rust transition-colors">
            Notes
          </Link>
        </nav>
      </div>
    </header>
  );
}
