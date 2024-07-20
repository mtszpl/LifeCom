import { createTheme } from "@mui/material"
import { createContext, useMemo, useState } from "react"

export const tokens = (mode: string) => ({
    ...(mode === "dark") ? {
        primary: {
          100: "#d6d6d9",
          200: "#adadb3",
          300: "#85848e",
          400: "#5c5b68",
          500: "#333242",
          600: "#292835",
          700: "#1f1e28",
          800: "#14141a",
          900: "#0a0a0d"
        },
        gray: {
          100: "#e0e0e0",
          200: "#c2c2c2",
          300: "#a3a3a3",
          400: "#858585",
          500: "#666666",
          600: "#525252",
          700: "#3d3d3d",
          800: "#292929",
          900: "#141414"
        },
        black: {
          100: "#d7d7d7",
          200: "#afafaf",
          300: "#868686",
          400: "#5e5e5e",
          500: "#363636",
          600: "#2b2b2b",
          700: "#202020",
          800: "#161616",
          900: "#0b0b0b"
        },
        yellowAccent: {
          100: "#fff5d0",
          200: "#ffeba1",
          300: "#ffe072",
          400: "#ffd643",
          500: "#ffcc14",
          600: "#cca310",
          700: "#997a0c",
          800: "#665208",
          900: "#332904"
        },

        redAccent: {
          100: "#f2d8d9",
          200: "#e6b2b2",
          300: "#d98b8c",
          400: "#cd6565",
          500: "#c03e3f",
          600: "#9a3232",
          700: "#732526",
          800: "#4d1919",
          900: "#260c0d"
        },
        white: {
          100: "#fcfcfc",
          200: "#fafafa",
          300: "#f7f7f7",
          400: "#f5f5f5",
          500: "#f2f2f2",
          600: "#c2c2c2",
          700: "#919191",
          800: "#616161",
          900: "#303030"
        },
        blueAccent: {
          100: "#e1e2fe",
          200: "#c3c6fd",
          300: "#a4a9fc",
          400: "#868dfb",
          500: "#6870fa",
          600: "#535ac8",
          700: "#3e4396",
          800: "#2a2d64",
          900: "#151632"
        }

    } : {
        primary: {
          100: "#e7e7e7",
          200: "#cecece",
          300: "#b6b6b6",
          400: "#9d9d9d",
          500: "#858585",
          600: "#6a6a6a",
          700: "#505050",
          800: "#353535",
          900: "#1b1b1b"
        },
        gray: {
            100: "#141414",
            200: "#292929",
            300: "#3d3d3d",
            400: "#525252",
            500: "#666666",
            600: "#858585",
            700: "#a3a3a3",
            800: "#c2c2c2",
            900: "#e0e0e0"
        },
        black: {
          100: "#d7d7d7",
          200: "#afafaf",
          300: "#868686",
          400: "#5e5e5e",
          500: "#363636",
          600: "#2b2b2b",
          700: "#202020",
          800: "#161616",
          900: "#0b0b0b"
        },
        redAccent: {
            100: "#260c0d",
            200: "#4d1919",
            300: "#732526",
            400: "#9a3232",
            500: "#c03e3f",
            600: "#cd6565",
            700: "#d98b8c",
            800: "#e6b2b2",
            900: "#f2d8d9"
        },
        yellowAccent: {
            100: "#332904",
            200: "#665208",
            300: "#997a0c",
            400: "#cca310",
            500: "#ffcc14",
            600: "#ffd643",
            700: "#ffe072",
            800: "#ffeba1",
            900: "#fff5d0"
        },
        white: {
          100: "#fcfcfc",
          200: "#fafafa",
          300: "#f7f7f7",
          400: "#f5f5f5",
          500: "#f2f2f2",
          600: "#c2c2c2",
          700: "#919191",
          800: "#616161",
          900: "#303030"
        },
        blueAccent: {
            100: "#151632",
            200: "#2a2d64",
            300: "#3e4396",
            400: "#535ac8",
            500: "#6870fa",
            600: "#868dfb",
            700: "#a4a9fc",
            800: "#c3c6fd",
            900: "#e1e2fe"
        }
    }
})

export const themeSettings = (mode: string) => {
  const colors = tokens(mode)
  return {
    palette: {
      mode: mode,
      ...(mode === 'dark' ? {
        primary: {
          main: colors.primary[500],
          dark: colors.primary[900],
          light: colors.primary[300],
        },
        secondary: {
          //#3bb9cc
          main: colors.blueAccent[500],
          light: colors.blueAccent[100],
          dark: colors.blueAccent[700]
        },
        tonalOffset: {
          main: colors.blueAccent[500],
          light: colors.blueAccent[300],
          dark: colors.blueAccent[800],
        },
        warn: {
          main: colors.redAccent[500]
        },
        neutral: {
          dark: colors.gray[700],
          main: colors.gray[500],
          light: colors.gray[100],
        },
        background: {
          default: colors.black[700],
          dark: colors.black[900],
          light: colors.black[500],
        }
        
      } : {
        //light mode
        primary: {
          main: colors.primary[200],
          light: colors.primary[100],
          dark: colors.primary[600],
        },
        secondary:{
          main: colors.white[500],
          light: colors.white[100],
          dark: colors.white[900]
        },
        tonalOffset: {
          main: colors.redAccent[500],
          light: colors.blueAccent[300],
          dark: colors.blueAccent[800],
        },
        warn: {
          main: colors.redAccent[500]
        },
        neutral: {
          dark: colors.gray[100],
          main: colors.gray[500],
          light: colors.gray[700],
        },
        background: {
          default: colors.gray[500],
          light: colors.gray[700],
          dark: colors.gray[200], 
        }
      })
    },
    typography: {
      fontFamily: ["Nueva", "sans-serif"].join(","),
      fontSize: 12,
      h1: {
        fontFamily: ["Nueva", "sans-serif"].join(","),
        fontSize: 40,
      },
      h2: {
        fontFamily: ["Nueva", "sans-serif"].join(","),
        fontSize: 32,
      },
      h3: {
        fontFamily: ["Nueva", "sans-serif"].join(","),
        fontSize: 24,
      },
      h4: {
        fontFamily: ["Nueva", "sans-serif"].join(","),
        fontSize: 20,
      },
      h5: {
        fontFamily: ["Nueva", "sans-serif"].join(","),
        fontSize: 16,
      },
      h6: {
        fontFamily: ["Nueva", "sans-serif"].join(","),
        fontSize: 14,
      },
    }
  }
}

//context
export const ColorModecontext = createContext({
  toggleTheme: () => {}
})

export const useMode = () => {
  const [mode, SetMode] = useState("dark")
  const colorMode = useMemo(
    () => ({
      toggleColorMode: () => {
        console.log("changing mode");
        SetMode(prev => {if(prev === "light") return "dark"
           else return "light"})
        console.log(mode);
      }
    }), [])

  const theme: Theme = useMemo(() => createTheme(themeSettings(mode)), [mode])
  return [theme, colorMode]
}