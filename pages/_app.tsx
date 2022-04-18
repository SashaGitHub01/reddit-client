import '../styles/globals.css'
import type { AppProps } from 'next/app'
import { createTheme, ThemeProvider } from '@mui/material'

function MyApp({ Component, pageProps }: AppProps) {
   const theme = createTheme({
      palette: {
         myGray: {
            main: 'rgba(0, 0, 0, 0.5)'
         }
      },
      typography: {
         fontFamily: [
            "Sora",
            '"Segoe UI"',
            '"Fira Sans"',
            'sans-serif'
         ].join(',')
      }
   })

   return <ThemeProvider theme={theme}>
      <Component {...pageProps} />
   </ThemeProvider>
}

export default MyApp
