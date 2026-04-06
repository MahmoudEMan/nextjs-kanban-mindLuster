'use client'

import { useEffect, useState } from 'react'
import { TextField, InputAdornment, IconButton } from '@mui/material'
import SearchIcon from '@mui/icons-material/Search'
import ClearIcon from '@mui/icons-material/Clear'
import useBoardStore from '@/store/useBoardStore'

export default function SearchBar() {
  const setSearch = useBoardStore((s) => s.setSearch)
  const [value, setValue] = useState('')

  useEffect(() => {
    const timer = setTimeout(() => setSearch(value), 300)
    return () => clearTimeout(timer)
  }, [value, setSearch])

  return (
    <TextField
      size="small"
      placeholder="Search tasks..."
      value={value}
      onChange={(e) => setValue(e.target.value)}
      slotProps={{
        input: {
          startAdornment: (
            <InputAdornment position="start">
              <SearchIcon fontSize="small" sx={{ color: 'text.secondary' }} />
            </InputAdornment>
          ),
          endAdornment: value ? (
            <InputAdornment position="end">
              <IconButton size="small" onClick={() => setValue('')} edge="end">
                <ClearIcon fontSize="small" />
              </IconButton>
            </InputAdornment>
          ) : null,
        },
        htmlInput: { suppressHydrationWarning: true },
      }}
      sx={{ width: { xs: '100%', sm: 260 }, bgcolor: 'white', borderRadius: 1 }}
    />
  )
}
