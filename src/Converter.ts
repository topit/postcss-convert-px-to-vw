import css, { StyleRules } from 'css'

export interface Options {
  baseSize?: {
    rem?: number;
    vw?: number;
  };
  precision?: number;
  forceRemProps?: string[];
  keepRuleComment?: string;
  keepFileComment?: string;
  toRem?: boolean;
  toVw?: boolean;
}

const pxRegExp = /\b(\d+(\.\d+)?)px\b/
const pxGlobalRegExp = new RegExp(pxRegExp.source, 'g')
const defaultConfig = {
  baseSize: { rem: 75, vw: 7.5 },
  precision: 6,
  forceRemProps: ['font', 'font-size'],
  keepRuleComment: 'no',
  keepFileComment: 'pxtoremvw-disable',
  toRem: true,
  toVw: true,
}

export default class PxConverter {
  config: Options

  constructor(options: Options = {}) {
    this.config = Object.assign({}, defaultConfig, options)
    // this.originConfig = deepMerge(this.config)
  }

  convert(cssText: string) {
    const astObj = css.parse(cssText)
    const firstRule = astObj.stylesheet!.rules[0]
    if (!firstRule) return cssText
    // 忽略整个文件
    const isDisabled = firstRule.type === 'comment' &&
      (firstRule as css.Comment)?.comment?.trim() === this.config.keepFileComment
    if (isDisabled) return cssText

    // const disableToVw = firstRule.type === 'comment' &&
    //   firstRule.comment.trim() === this.config.disableToVwComment
    // if (disableToVw) {
    //   this.config.toVw = false
    // } else {
    //   this.config.toVw = this.originConfig.toVw
    // }

    // const disableToRem = firstRule.type === 'comment' &&
    //   firstRule.comment.trim() === this.config.disableToRemComment
    // if (disableToRem) {
    //   this.config.toRem = false
    // } else {
    //   this.config.toRem = this.originConfig.toRem
    // }

    this.processRules(astObj?.stylesheet?.rules)
    return css.stringify(astObj)
  }

  processRules(rules?: StyleRules['rules']) {
    rules?.forEach(rule => {
      if (rule.type === 'media') return this.processRules((rule as css.Media).rules)
      if (rule.type === 'keyframes') return this.processRules((rule as css.KeyFrames).keyframes)
      if (rule.type !== 'rule' && rule.type !== 'keyframe') return

      const processDeclarations = (index: number): void => {
        const dec = (rule as css.Rule)?.declarations?.[index]
        if (!dec) return

        // 必须为可转换的规则，否则去下一条
        if (dec.type !== 'declaration' || !pxRegExp.test((dec as css.Declaration)?.value ?? '')) return processDeclarations(index + 1)

        // 如果下一条规则为禁用注释，一起跳过
        const nextDec = (rule as css.Rule)?.declarations?.[index + 1]
        const isDisabled = nextDec &&
          nextDec.type === 'comment' &&
          (nextDec as css.Comment)?.comment?.trim() === this.config.keepRuleComment
        if (isDisabled) {
          return processDeclarations(index + 2)
        }

        const sourceValue = (dec as css.Declaration)?.value ?? ''
        // 将原本的 px 替换为 rem
        if (this.config.toRem) {
          (dec as css.Declaration).value = this.getCalcValue('rem', sourceValue)
        }
        // 增加一条更高级的 vw 规则用于覆盖
        if (this.config.toVw && this.config.forceRemProps?.indexOf((dec as css.Declaration)?.property ?? '') === -1) {
          (rule as css.Rule)?.declarations?.splice(index + 1, 0, {
            type: 'declaration',
            property: (dec as css.Declaration).property,
            value: this.getCalcValue('vw', sourceValue),
          })
          processDeclarations(index + 2)
        } else {
          processDeclarations(index + 1)
        }
      }

      processDeclarations(0)
    })
  }

  getCalcValue(targetUnit: 'rem' | 'vw', sourceValue: string) {
    const baseSize = this.config.baseSize![targetUnit]!
    if (!baseSize) return sourceValue

    return sourceValue.replace(pxGlobalRegExp, ($0, $1) => {
      return `${parseFloat(($1 / baseSize).toFixed(this.config.precision))}${targetUnit}`
    })
  }
}
