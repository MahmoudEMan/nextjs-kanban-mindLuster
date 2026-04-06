'use client'

import { Box, Typography } from '@mui/material'
import SearchBar from './SearchBar'

export default function Header() {
  return (
    <Box
      sx={{
        px: { xs: 2, sm: 3 },
        py: 2,
        display: 'flex',
        alignItems: { xs: 'flex-start', sm: 'center' },
        flexDirection: { xs: 'column', sm: 'row' },
        justifyContent: 'space-between',
        gap: { xs: 1.5, sm: 0 },
        borderBottom: '1px solid',
        borderColor: 'divider',
        bgcolor: 'white',
      }}
    >
      <Typography
        variant="h6"
        fontWeight={700}
        letterSpacing={1}
        sx={{ textTransform: 'uppercase', fontSize: 13 }}
      >
        Kanban Board
      </Typography>
      <SearchBar />
    </Box>
  )
}
