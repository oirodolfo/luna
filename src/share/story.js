import { withKnobs, optionsKnob } from './storybook/knobs'
import camelCase from './native/compat/camelCase'
import spaceCase from './native/compat/spaceCase'
import map from './native/compat/map'
import h from './native/compat/h'
import waitUntil from './native/compat/waitUntil'
import isArr from './native/compat/isArr'
import isDarkMode from './native/compat/isDarkMode'
import contain from './native/compat/contain'
import upperFirst from './native/compat/upperFirst'
import extend from './native/compat/extend'
import { addReadme } from './storybook/readme'
import each from './native/compat/each'
import ReactDOM from 'react-dom'
import { createApp, defineComponent } from 'vue'

export default function story(
  name,
  storyFn,
  {
    i18n = null,
    readme,
    changelog = '',
    source,
    layout = 'padded',
    themes = {},
    ReactComponent = false,
    VueComponent = false,
  } = {}
) {
  if (changelog) {
    readme += `\n## Changelog\n${changelog.replace(/## /g, '### ')}`
  }

  const ret = {
    title: map(spaceCase(name).split(' '), upperFirst).join(' '),
    decorators: [withKnobs, addReadme],
    parameters: {
      knobs: {
        escapeHTML: false,
      },
      readme: {
        sidebar: readme,
      },
      storySource: {
        source,
      },
      layout,
    },
    [camelCase(name)]: () => {
      const container = h('div')

      fixKnobs(name)

      waitUntil(() => container.parentElement).then(() => {
        const { theme, language } = createKnobs()
        if (language) {
          i18n.locale(language)
        }
        const story = storyFn(container, theme)
        if (isArr(story)) {
          window.components = story
        } else {
          window.components = [story]
        }
        window.component = window.components[0]
        window.componentName = upperFirst(camelCase(name))

        updateBackground(theme)

        each(window.components, (component) =>
          component.setOption('theme', theme)
        )
      })

      return container
    },
  }

  if (ReactComponent) {
    ret.react = function () {
      const container = h('div')

      fixKnobs(`react-${name}`)

      const { theme, language } = createKnobs()
      if (language) {
        i18n.locale(language)
      }
      window.components = []
      delete window.component
      window.componentName = upperFirst(camelCase(`react-${name}`))

      ReactDOM.render(<ReactComponent theme={theme} />, container)
      window.reactComponent = container

      updateBackground(theme)

      return container
    }
  }

  if (VueComponent) {
    ret.vue = function () {
      const container = h('div')

      fixKnobs(`vue-${name}`)

      const { theme } = createKnobs()
      window.components = []
      delete window.component
      window.componentName = upperFirst(camelCase(`vue-${name}`))

      const app = createApp(
        defineComponent({
          render() {
            return VueComponent({ theme })
          },
        })
      )
      app.mount(container)
      window.vueComponent = app

      updateBackground(theme)

      return container
    }
  }

  function createKnobs() {
    const theme = optionsKnob(
      'Theme',
      extend(
        {
          Light: 'light',
          Dark: 'dark',
          Auto: 'auto',
        },
        themes
      ),
      'light',
      {
        display: 'select',
      }
    )

    if (i18n) {
      const language = optionsKnob(
        'Language',
        {
          English: 'en-US',
          中文: 'zh-CN',
        },
        navigator.language,
        {
          display: 'select',
        }
      )

      return {
        theme,
        language,
      }
    }

    return {
      theme,
    }
  }

  return ret
}

function fixKnobs(name) {
  if (window.components) {
    const lastComponentName = window.componentName
    if (upperFirst(camelCase(name)) !== lastComponentName) {
      globalThis.__LUNA_STORY_ARGS__ = {}
    }
    each(window.components, (component) => component.destroy())
    if (window.reactComponent) {
      ReactDOM.unmountComponentAtNode(window.reactComponent)
    }
    if (window.vueComponent) {
      window.vueComponent.unmount()
    }
  }
}

function updateBackground(theme) {
  if (theme === 'auto') {
    theme = isDarkMode() ? 'dark' : 'light'
  }

  document.documentElement.style.background = contain(theme, 'dark')
    ? '#000'
    : '#fff'
}
