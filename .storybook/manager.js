import { addons } from '@storybook/manager-api'
import theme from './theme'
import './style.css'

addons.setConfig({
  theme,
  panelPosition: 'right',
  enableShortcuts: false,
})
