// Este arquivo é a fonte da verdade visual do seu app.
// NUNCA coloque cores, tamanhos ou fontes hardcoded fora daqui.

export const Colors = {
  text: {
    50: '#f0eef6', 100: '#e1deed', 200: '#c3bddb', 300: '#a59cc9',
    400: '#887ab8', 500: '#6a59a6', 600: '#554785', 700: '#3f3663',
    800: '#2a2442', 900: '#151221', 950: '#0b0911',
  },
  background: {
    50: '#f0edf7', 100: '#e0dbf0', 200: '#c2b8e0', 300: '#a394d1',
    400: '#8570c2', 500: '#664db3', 600: '#523d8f', 700: '#3d2e6b',
    800: '#291f47', 900: '#140f24', 950: '#0a0812',
  },
  primary: {
    50: '#eeebf9', 100: '#ddd7f4', 200: '#bcafe9', 300: '#9a88dd',
    400: '#7960d2', 500: '#5738c7', 600: '#462d9f', 700: '#342277',
    800: '#231650', 900: '#110b28', 950: '#090614',
  },
  secondary: {
    50: '#eee9fb', 100: '#dcd4f7', 200: '#b9a9ef', 300: '#967ee7',
    400: '#7353df', 500: '#5128d7', 600: '#4020ac', 700: '#301881',
    800: '#201056', 900: '#10082b', 950: '#080416',
  },
  accent: {
    50: '#ede8fc', 100: '#dbd1fa', 200: '#b7a4f4', 300: '#9276ef',
    400: '#6e48ea', 500: '#4a1be4', 600: '#3b15b7', 700: '#2c1089',
    800: '#1e0b5b', 900: '#0f052e', 950: '#070317',
  },

  // Status
  success: { bg: "#d1fae5", text: "#065f46", border: "#34d399" },
  warning: { bg: "#fef3c7", text: "#92400e", border: "#fbbf24" },
  danger:  { bg: "#fee2e2", text: "#991b1b", border: "#f87171" },
  info:    { bg: "#dbeafe", text: "#1e40af", border: "#60a5fa" },

  // Atalhos semânticos (os mais usados no dia a dia - mapeados pela paleta)
  appBackground: "#f0edf7",    // background-50 do light
  surface:       "#ffffff",    
  textPrimary:   "#151221",    // text-900 (padrão principal)
  textSecondary: "#6a59a6",    // text-500
  border:        "#c3bddb",    // text-200 (para suavizar)
  white:         "#ffffff",
  black:         "#000000",
};

export const Typography = {
  fontSize: {
    xs:   10, sm: 12, base: 14, md: 16,
    lg: 18, xl: 22, "2xl": 28, "3xl": 36,
  },
  fontWeight: {
    regular: "400" as const,
    medium:  "500" as const,
    semibold:"600" as const,
    bold:    "700" as const,
    black:   "900" as const,
  },
  lineHeight: { tight: 1.2, normal: 1.5, relaxed: 1.8 },
};

export const Spacing = {
  1: 4,   2: 8,  3: 12, 4: 16, 5: 20,
  6: 24,  8: 32, 10: 40, 12: 48, 16: 64,
};

export const Radius = {
  sm: 6, md: 8, lg: 12, xl: 16, full: 9999,
};