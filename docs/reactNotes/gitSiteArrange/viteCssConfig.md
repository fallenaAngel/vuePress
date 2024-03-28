# css配置

[vite配置文件中的css配置](https://cn.vitejs.dev/config/shared-options.html#css-modules) 配置 CSS modules 的行为。选项将被传递给 postcss-modules。这里配置如下：

```js
css: {
  // 在开发过程中是否启用 sourcemap
  devSourcemap: true,
  modules: {
    generateScopedName: '[local]-[hash:base64:5]',
    localsConvention: 'dashes',
  },
  postcss: {
    plugins: [
      postcssNest(),
      postcssPresetEnv({
        stage: 3,
        autoprefixer: {
          flexbox: 'no-2009',
        },
      }),
    ],
  },
}
```

## modules.generateScopedName

配置构建时 生成自定义类名的格式。

## modules.localsConvention

配置生成 css 类名的格式，在react中，经常会在js中书写class，一般class使用中划线，写在js中不优雅，可以用这个配置。dashes表示只在js中使用时通过驼峰引用。

## postcss配置

### 允许css样式嵌套写

如果你想要像Sass一样的嵌套规则，你可能需要使用[PostCSS nested](https://www.npmjs.com/package/postcss-nesting)。

### postcssPresetEnv

[PostCSS Preset Env](https://www.npmjs.com/package/postcss-preset-env)tcss 的插件；
它可以帮助我们将一些现代的 CSS 特性，转成大多数浏览器认识的 CSS，并且会根据目标浏览器或运行时环境添加所需的 polyfill，也包括会自动帮助我们添加 autoprefixer。

配置项：

- stage选项根据 CSS 特性在成为实施的 Web 标准过程中的稳定性来确定要进行 Polyfill 的 CSS 特性。值是从0（实验性的）到4（稳定的），默认是2，这里是3。
- autoprefixer选项表示是否应该为属性添加前缀，配置flexbox: 'no-2009'表示将仅为最终版本和 IE 10 版本的规范添加前缀。
