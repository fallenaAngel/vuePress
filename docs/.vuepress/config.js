module.exports = {
  title: 'Ding\'s blog',
  description: '我的个人网站',
  head: [ // 注入到当前页面的 HTML <head> 中的标签
    ['link', { rel: 'icon', href: '/logo.jpg' }], // 增加一个自定义的 favicon(网页标签的图标)
  ],
  serviceWorker: false, // 是否开启 PWA
  base: '/vuePress/', // 这是部署到github相关的配置
  markdown: {
    lineNumbers: false // 代码块显示行号
  },
  displayAllHeaders: true,
  lastUpdated: 'Last Updated', // string | boolean
  themeConfig: {
    nav: [ // 导航栏配置
      { text: '首页', link: '/' },
      {
        text: '日常',
        items: [
          {
            text: '日常问题记录',
            link: '/dailyNotes/problemRecords'
          },
          {
            text: 'TS',
            link: '/dailyNotes/ts/'
          },
          {
            text: '工具网站合集',
            link: '/dailyNotes/toolWebsite'
          },
          {
            text: '生活',
            link: '/dailyNotes/lifeTips'
          }
        ]
      },
      { text: '算法', link: '/algorithm/' },
      { text: '我的CSDN', link: 'https://blog.csdn.net/weixin_43869192' },
      { text: 'GitHub', link: 'https://github.com/fallenaAngel' }
    ],
    sidebar: 'auto',
    sidebarDepth: 2, // 侧边栏显示2级
  }
};