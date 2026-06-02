import path from 'path'
import webpack from 'webpack'
import type { StorybookConfig } from '@storybook/html-webpack5'

const components = Object.keys(require('../index.json'))

const config: StorybookConfig = {
  framework: '@storybook/html-webpack5',
  stories: components.map((component) => `../src/${component}/story.js`),
  addons: ['@storybook/addon-essentials', '@storybook/addon-docs'],
  babel: async (options) => ({
    ...options,
    presets: [
      ...(options?.presets || []),
      [
        '@babel/preset-react',
        {
          runtime: 'automatic',
        },
      ],
    ],
  }),
  webpackFinal: async (config) => {
    for (const component of components) {
      config.resolve = config.resolve || {}
      config.resolve.alias = config.resolve.alias || {}
      config.resolve.alias[`luna-${component}`] = path.resolve(
        __dirname,
        `../dist/${component}/luna-${component}.js`
      )
      for (const extension of ['css', 'js']) {
        config.resolve.alias[`luna-${component}.${extension}`] = path.resolve(
          __dirname,
          `../dist/${component}/luna-${component}.${extension}`
        )
      }
    }

    Object.assign(config.resolve.alias, {
      '@storybook/addon-knobs': path.resolve(
        __dirname,
        '../src/share/storybook/knobs.js'
      ),
      '@storybook/addon-knobs/dist/registerKnobs': path.resolve(
        __dirname,
        '../src/share/storybook/knobs.js'
      ),
      'storybook-readme/html': path.resolve(
        __dirname,
        '../src/share/storybook/readme.js'
      ),
    })

    config.plugins = config.plugins || []
    config.plugins.push(
      new webpack.DefinePlugin({
        __VUE_OPTIONS_API__: true,
        __VUE_PROD_DEVTOOLS__: false,
        __VUE_PROD_HYDRATION_MISMATCH_DETAILS__: false,
      })
    )

    return config
  },
  staticDirs: ['../public'],
}

export default config
