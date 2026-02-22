"use client";
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from '@/components/ui/table';

export default function ProizvodiSkeleton() {
  return (
    <div className="space-y-6 animate-pulse">
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <Table className="min-w-full">
            <TableHeader className="bg-gray-50">
              <TableRow>
                <TableHead className="px-6 py-3 text-xs text-gray-300 uppercase tracking-wider">Naziv</TableHead>
                <TableHead className="px-6 py-3 text-xs text-gray-300 uppercase tracking-wider">Kategorija</TableHead>
                <TableHead className="px-6 py-3 text-xs text-gray-300 uppercase tracking-wider">Cena</TableHead>
                <TableHead className="px-6 py-3 text-xs text-gray-300 uppercase tracking-wider">Na stanju</TableHead>
                <TableHead className="px-6 py-3 text-xs text-gray-300 uppercase tracking-wider">Akcije</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {[...Array(8)].map((_, i) => (
                <TableRow key={i}>
                  <TableCell className="px-6 py-4">
                    <div className="h-4 bg-gray-200 rounded w-24" />
                  </TableCell>
                  <TableCell className="px-6 py-4">
                    <div className="h-4 bg-gray-200 rounded w-20" />
                  </TableCell>
                  <TableCell className="px-6 py-4">
                    <div className="h-4 bg-gray-200 rounded w-12" />
                  </TableCell>
                  <TableCell className="px-6 py-4">
                    <div className="h-4 bg-gray-200 rounded w-16" />
                  </TableCell>
                  <TableCell className="px-6 py-4">
                    <div className="h-4 bg-gray-200 rounded w-20" />
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </div>
    </div>
  );
}
