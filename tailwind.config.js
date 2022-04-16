module.exports = {
   content: [
      './pages/**/*.{js,ts,jsx,tsx}',
      './components/**/*.{js,ts,jsx,tsx}'
   ],
   theme: {
      extend: {
         colors: {
            btn_primary: "var(--btn_primary)"
         },
         fontFamily: {
            'sans': '"Sora", "Segoe UI", "Fira Sans", sans-serif'
         },
         fontSize: {
            tn: 'var(--font_tn)',
            sm: 'var(--font_sm)',
            main: 'var(--font_main)',
            md: 'var(--font_md)',
            lg: 'var(--font_lg)',
            xl: 'var(--font_xl)',
         }
      }
   },
   plugins: [],
   corePlugins: {
      preflight: false,
   }
}
