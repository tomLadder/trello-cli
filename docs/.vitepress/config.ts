import { defineConfig } from 'vitepress'

export default defineConfig({
  title: 'trello-cli',
  description: 'CLI for Trello - Manage your boards from the terminal',

  base: '/trello-cli/',

  head: [
    ['meta', { name: 'theme-color', content: '#0055CC' }],
    ['meta', { name: 'og:type', content: 'website' }],
    ['meta', { name: 'og:site_name', content: 'trello-cli' }],
  ],

  themeConfig: {
    nav: [
      { text: 'Guide', link: '/guide/getting-started' },
      { text: 'Commands', link: '/commands/' },
    ],

    sidebar: {
      '/guide/': [
        {
          text: 'Introduction',
          items: [
            { text: 'Getting Started', link: '/guide/getting-started' },
            { text: 'Installation', link: '/guide/installation' },
            { text: 'Configuration', link: '/guide/configuration' },
          ]
        }
      ],
      '/commands/': [
        {
          text: 'Commands',
          items: [
            { text: 'Overview', link: '/commands/' },
            { text: 'login', link: '/commands/login' },
            { text: 'logout', link: '/commands/logout' },
            { text: 'whoami', link: '/commands/whoami' },
            { text: 'status', link: '/commands/status' },
            { text: 'boards', link: '/commands/boards' },
            { text: 'lists', link: '/commands/lists' },
            { text: 'cards', link: '/commands/cards' },
            { text: 'labels', link: '/commands/labels' },
            { text: 'checklists', link: '/commands/checklists' },
            { text: 'custom-fields', link: '/commands/custom-fields' },
            { text: 'search', link: '/commands/search' },
            { text: 'config', link: '/commands/config' },
          ]
        }
      ],
    },

    socialLinks: [
      { icon: 'github', link: 'https://github.com/tomLadder/trello-cli' }
    ],

    footer: {
      message: 'Released under the MIT License.',
      copyright: 'Made with ❤️ in Austria'
    },

    search: {
      provider: 'local'
    }
  }
})
