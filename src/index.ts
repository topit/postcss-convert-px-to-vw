import type { PluginCreator, Plugin } from 'postcss'
import Converter, { Options } from './Converter'

const px2remvw: PluginCreator<Options> = (opts = {}) => {
  const plugin: Plugin = {
    postcssPlugin: 'postcss-px-to-remvw',
    Once(root, helper) {
      const converter = new Converter(opts)
      const targetCssText = converter.convert(root.source?.input.css ?? '')

      root.removeAll()
      root.append(helper.postcss.parse(targetCssText))
    },
  }

  return plugin
}
px2remvw.postcss = true

export default px2remvw
