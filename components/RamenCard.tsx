import React from 'react'

export interface Shop {
  id: string
  name: string
  imageUrl?: string
  location?: string
}

export default function RamenCard({ shop }: { shop: Shop }) {
  return (
    <div className="border rounded p-4">
      <h2 className="text-xl font-semibold">{shop.name}</h2>
      {shop.location && <p className="text-sm">{shop.location}</p>}
    </div>
  )
}