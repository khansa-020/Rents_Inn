'use client'

import { Card, CardContent } from './UIComponents' // optional: reuse your Card + CardContent

export default function SkeletonCard() {
  return (
    <Card className="animate-pulse">
      <div className="h-48 sm:h-56 lg:h-64 bg-gray-300 rounded-t-lg" />
      <CardContent>
        <div className="h-4 bg-gray-300 rounded w-3/4 mb-2"></div>
        <div className="h-3 bg-gray-300 rounded w-1/2 mb-1"></div>
        <div className="h-3 bg-gray-300 rounded w-2/3 mb-4"></div>
        <div className="flex gap-2">
          <div className="h-8 bg-gray-300 rounded w-20"></div>
          <div className="h-8 bg-gray-300 rounded w-32"></div>
        </div>
      </CardContent>
    </Card>
  )
}
