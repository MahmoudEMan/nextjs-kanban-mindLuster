import { createTheme } from '@mui/material/styles'

const theme = createTheme({
  palette: {
    mode: 'light',
    background: { default: '#f4f5f7' },
    primary: { main: '#0052cc' },
  },
  typography: {
    fontFamily: '"Inter", "Roboto", sans-serif',
  },
  shape: { borderRadius: 8 },
  components: {
    MuiButton: {
      defaultProps: { disableElevation: true, suppressHydrationWarning: true },
    },
    MuiPaper: {
      defaultProps: { elevation: 0 },
    },
    MuiDialog: {
      defaultProps: { disableScrollLock: true },
    },
  },
})

export default theme
