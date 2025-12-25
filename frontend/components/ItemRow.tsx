'use client';
import React from 'react';

export default function ItemRow({ item, index, onChange, onRemove }: any) {
  return (
    <tr>
      <td className="border p-2">{index + 1}</td>
      <td className="border p-2">
        <input className="w-full" value={item.description} onChange={(e) => onChange(index, 'description', e.target.value)} />
      </td>
      <td className="border p-2">
        <input type="number" className="w-20 text-right" value={item.quantity} onChange={(e) => onChange(index, 'quantity', Number(e.target.value))} />
      </td>
      <td className="border p-2">
        <input type="number" className="w-28 text-right" value={item.price} onChange={(e) => onChange(index, 'price', Number(e.target.value))} />
      </td>
      <td className="border p-2 text-right">{(Number(item.quantity || 0) * Number(item.price || 0)).toFixed(2)}</td>
      <td className="border p-2">
        <button className="text-red-500" onClick={() => onRemove(index)}>Remove</button>
      </td>
    </tr>
  );
}
