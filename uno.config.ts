import { defineConfig, presetMini, presetWind } from 'unocss'
import tokens from './src/share/design-system/tokens'

export default defineConfig({
  presets: [presetMini(), presetWind()],
  dark: 'class',
  theme: {
    colors: {
      primary: tokens.colors.colorPrimary,
      text: tokens.colors.colorText,
      surface: tokens.colors.colorBgContainer,
      border: tokens.colors.colorBorder,
      success: tokens.colors.colorSuccess,
      warning: tokens.colors.colorWarning,
      danger: tokens.colors.colorError,
    },
    spacing: {
      xs: `${tokens.spacing.sizeXS}px`,
      sm: `${tokens.spacing.sizeSM}px`,
      md: `${tokens.spacing.sizeMD}px`,
      lg: `${tokens.spacing.sizeLG}px`,
      xl: `${tokens.spacing.sizeXL}px`,
    },
    borderRadius: {
      sm: `${tokens.radii.borderRadiusXS ?? tokens.radii.borderRadius}px`,
      DEFAULT: `${tokens.radii.borderRadius}px`,
    },
    fontFamily: {
      sans: tokens.typography.fontFamily,
      mono: tokens.typography.fontFamilyCode,
    },
    boxShadow: {
      panel: '0 8px 24px rgba(0, 0, 0, 0.12)',
    },
    zIndex: {
      popup: `${tokens.zIndex.zIndexPopupBase}`,
    },
  },
  shortcuts: {
    'luna-component': 'luna-theme-surface rounded border border-border bg-surface text-text',
    'luna-input': 'rounded border border-border bg-surface px-sm py-1 text-sm text-text outline-none',
    'luna-button': 'inline-flex items-center justify-center rounded border border-border bg-surface px-sm py-1 text-sm transition-colors hover:bg-gray-100 dark:hover:bg-gray-800',
  },
})
