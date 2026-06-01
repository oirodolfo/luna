import type { Preview } from '@storybook/html'
import '../src/share/design-system/theme.css'

const preview: Preview = {
  decorators: [
    (story, context) => {
      ;(globalThis as any).__LUNA_STORY_ARGS__ = context.args || {}
      return story()
    },
  ],
  parameters: {
    controls: {
      expanded: true,
    },
    layout: 'padded',
  },
}

export default preview
