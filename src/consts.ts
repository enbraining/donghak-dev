import type { IconMap, SocialLink, Site } from '@/types'

export const SITE: Site = {
  title: 'DONGHAK>DEV',
  description:
    '다양한 기술과 도구를 활용하여 문제를 해결한 사례를 공유하는 블로그입니다.',
  href: 'https://donghak.dev',
  author: 'enbraining',
  locale: 'ko-KR',
  featuredPostCount: 2,
  postsPerPage: 3,
}

export const NAV_LINKS: SocialLink[] = [
  {
    href: '/blog',
    label: 'blog',
  },
]

export const SOCIAL_LINKS: SocialLink[] = [
  {
    href: 'https://github.com/enbraining',
    label: 'GitHub',
  },
  {
    href: 'mailto:enbraining@gmail.com',
    label: 'Email',
  },
  {
    href: '/rss.xml',
    label: 'RSS',
  },
]

export const ICON_MAP: IconMap = {
  Website: 'lucide:globe',
  GitHub: 'lucide:github',
  LinkedIn: 'lucide:linkedin',
  Email: 'lucide:mail',
  RSS: 'lucide:rss',
}
