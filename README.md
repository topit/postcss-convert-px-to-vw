# postcss-px-to-remvw

用于转换 px 单位至 rem 和 vw 单位。

## install

```shell
npm i postcss-px-to-remvw
```

## Options

- `baseSize`: 转换基准，默认 `{ rem: 75, vw: 7.5 }`，如原始大小为 `36px` ,则转换后为 `0.48rem` 和 `4.8vw`。
- `precision`: 默认 `6` ，转换保留有效位数。
- `forceRemProps`: 只生成 `rem` 单位，不生成 `vw` 单位的属性。
- `keepRuleComment`: 默认 `'no'` ，不转换的行注释。
- `keepFileComment`: 默认 `'pxtoremvw-disable'` ，不转换的文件注释。
- `toRem`: 默认 `true`，是否生成 `rem` 单位。
- `toVw`: 默认 `true`，是否生成 `vw` 单位。

## Usage

### Postcss

```javascript
  import postcss from 'postcss'
  import pxToRemVw from 'postcss-px-to-remvw'
  const opts = {}

  postcss([pxToRemVw(opts)])
    .process(css, { from: './input.css', to: './output.css' })
    .then(result => {
      fs.writeFileSync('./output.css', result.css)
      if ( result.map ) fs.writeFile('./output.css.map', result.map)
    })
    .catch(err => {
      console.error(err)
    })
```

### postcss-loader

```javascript
  {
    test: /.css$/,
    loader: {
      loader: require.resolve('postcss-loader'),
      options: {
        // ...
        plugins: () => [
          // ...
          require('postcss-px-to-remvw')({
            baseSize: {
              rem: 750,
              vw: 7.5
            },
            precision: 6,
            forceRemProps: [ 'font', 'font-size' ],
            keepRuleComment: 'no',
            keepFileComment: 'pxconverter-disable',
            toVw: shouldPostCssGenVw,
            toRem: shouldPostCssGenRem
          }),
        ],
        // ...
      },
    }
  }
```

