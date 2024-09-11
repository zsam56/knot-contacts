import { Link } from "@inertiajs/react";

export default function Pagination({links}) {
  return (
    <nav className="text-center mt-4">
      <div className="flex gap-x-3 justify-center">
        {links.map((link, index) => (
          <Link 
            href={link.url || ""}
            preserveScroll
            key={index}
            dangerouslySetInnerHTML={{__html:link.label}}
            className={
              (!link.url ? "opacity-50 cursor-default" : 'hover:font-semibold')
            }
          >
          </Link>
        ))}
      </div>
    </nav>
  )
}