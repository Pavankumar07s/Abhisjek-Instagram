"use client"

import type React from "react"

import { useEffect, useState } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"

export function SearchHeader() {
  const router = useRouter()
  const params = useSearchParams()
  const initial = params.get("username") || ""
  const [value, setValue] = useState(initial)

  useEffect(() => {
    // Keep input in sync if user navigates back/forward
    const current = params.get("username") || ""
    setValue(current)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [params])

  function onSubmit(e: React.FormEvent) {
    e.preventDefault()
    const q = value.trim()
    const next = q ? `?username=${encodeURIComponent(q)}` : ""
    router.push(`/${next}`)
  }

  return (
    <form onSubmit={onSubmit} className="flex items-center gap-2">
      <Input
        value={value}
        onChange={(e) => setValue(e.target.value)}
        placeholder="Enter Instagram username (e.g. natgeo, instagram)"
        aria-label="Search username"
        className="w-72 focus:w-80 transition-all duration-200"
      />
      <Button type="submit" className="px-4 py-2 text-sm font-medium">
        🔍 Search
      </Button>
    </form>
  )
}
