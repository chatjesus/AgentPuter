import { defineConfig } from 'astro/config';
import tailwind from '@astrojs/tailwind';
import sitemap from '@astrojs/sitemap';

export default defineConfig({
  site: 'https://www.agentputer.com',
  integrations: [
    tailwind(),
    sitemap({
      i18n: {
        defaultLocale: 'en',
        locales: {
          en: 'en',
          zh: 'zh-CN',
          ja: 'ja',
          ko: 'ko',
          es: 'es',
          'pt-br': 'pt-BR',
          de: 'de',
          fr: 'fr',
          ru: 'ru',
          'zh-tw': 'zh-TW',
        },
      },
      // 为所有页面加 lastmod，帮助 Google 判断内容新鲜度
      serialize(item) {
        item.lastmod = new Date().toISOString();
        return item;
      },
      // 排除不需要索引的页面（demo 是交互应用，privacy/terms 是法律页）
      filter: (page) =>
        !page.includes('/privacy') &&
        !page.includes('/terms') &&
        !page.includes('/demo'),
    }),
  ],
  output: 'static',
});
