import React, { memo, useCallback } from 'react';
import { FixedSizeList as List } from 'react-window';
import Image from 'next/image';

/**
 * VirtualizedTable
 * A reusable table component that efficiently renders large lists (500–1000+ rows)
 * using react-window virtualization. Rows are memoized to avoid unnecessary re‑renders.
 *
 * Props:
 *   columns: Array<{ header: string, accessor: string, width?: number }>
 *   data:    Array<object>
 *   rowHeight?: number (default 56)
 *   height?: number (default 400)
 */
export const VirtualizedTable = memo(function VirtualizedTable({
  columns,
  data,
  rowHeight = 56,
  height = 400,
}) {
  // Memoized row renderer – receives index and style from react-window
  const Row = useCallback(
    ({ index, style }) => {
      const item = data[index];
      return (
        <div
          style={style}
          className="grid items-center border-b border-slate-200/50 hover:bg-slate-50/30"
          role="row"
        >
          {columns.map((col, i) => (
            <div
              key={i}
              className="px-3 py-2 text-sm"
              style={{ width: col.width || 'auto' }}
            >
              {col.accessor === 'preview' ? (
                <div className="w-16 h-12 relative">
                  <Image
                    src={item[col.accessor]}
                    alt={item.title}
                    fill
                    className="object-cover rounded"
                    sizes="(max-width: 640px) 64px, 128px"
                  />
                </div>
              ) : (
                item[col.accessor]
              )}
            </div>
          ))}
        </div>
      );
    },
    [data, columns]
  );

  return (
    <List
      height={height}
      itemCount={data.length}
      itemSize={rowHeight}
      width="100%"
      overscanCount={5}
    >
      {Row}
    </List>
  );
});
