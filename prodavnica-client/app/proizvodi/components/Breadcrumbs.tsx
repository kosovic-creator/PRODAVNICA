import Link from 'next/link';
import { ChevronRight } from 'lucide-react';

interface BreadcrumbsProps {
  items: Array<{ label: string; href?: string }>;
}

export default function Breadcrumbs({ items }: BreadcrumbsProps) {
  return (
    <nav className="flex items-center space-x-2 text-sm mb-6 overflow-x-auto">
      <Link href="/" className="text-gray-600 hover:text-gray-900 whitespace-nowrap uppercase font-medium">
        POČETNA
      </Link>
      {items.map((item, index) => (
        <div key={index} className="flex items-center space-x-2">
          <ChevronRight className="w-4 h-4 text-gray-400" />
          {item.href ? (
            <Link
              href={item.href}
              className="text-gray-600 hover:text-gray-900 whitespace-nowrap uppercase font-medium"
            >
              {item.label}
            </Link>
          ) : (
            <span className="text-gray-900 whitespace-nowrap uppercase font-medium">
              {item.label}
            </span>
          )}
        </div>
      ))}
    </nav>
  );
}
