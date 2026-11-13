import { getCollection, type CollectionEntry } from 'astro:content';

export type CategoryKey = 'dream' | 'travel' | 'novel' | 'diary';

export interface CategoryMeta {
  key: CategoryKey;
  label: string;
  enLabel: string;
  icon: string;
  tagline: string;
  description: string;
  href: string;
  accentVar: string;
}

export const CATEGORIES: Record<CategoryKey, CategoryMeta> = {
  dream: {
    key: 'dream',
    label: '梦境',
    enLabel: 'DREAMS',
    icon: '🌙',
    tagline: '凌晨三点的星群与低语',
    description: '那些在夜色里浮现、醒来后匆忙拾起的荒诞与温柔。',
    href: '/dreams',
    accentVar: 'var(--c-dream)',
  },
  travel: {
    key: 'travel',
    label: '游记',
    enLabel: 'TRAVELS',
    icon: '🧭',
    tagline: '山海入眸，步履不停',
    description: '把吹过的风、淋过的雨和陌生的街巷留在字里行间。',
    href: '/travels',
    accentVar: 'var(--c-travel)',
  },
  novel: {
    key: 'novel',
    label: '小说',
    enLabel: 'FICTION',
    icon: '🌊',
    tagline: '灯塔、海底城与漫长叙事',
    description: '虚构的潮汐深处，藏着比现实更真实的回响。',
    href: '/novel',
    accentVar: 'var(--c-novel)',
  },
  diary: {
    key: 'diary',
    label: '日记',
    enLabel: 'JOURNAL',
    icon: '🌱',
    tagline: '泥土、雨水与人间日常',
    description: '田里的草木、屋檐下的雨声，以及不想被遗忘的寻常时刻。',
    href: '/diary',
    accentVar: 'var(--c-diary)',
  },
};

export interface EnrichedPost {
  entry: CollectionEntry<'posts'>;
  id: string;
  url: string;
  title: string;
  subtitle?: string;
  date: Date;
  dateFormatted: string;
  shortDate: string;
  year: number;
  month: string;
  category: CategoryKey;
  categoryMeta: CategoryMeta;
  excerpt: string;
  wordCount: number;
  readingMinutes: number;
  coverImage?: string;
  city?: CityInfo;
  plainText: string;
}

export interface CityInfo {
  name: string;
  province: string;
  region: string;
  lat: number;
  lng: number;
  /** Normalized SVG coordinates on our 800x560 China starry map */
  mapX: number;
  mapY: number;
  poeticNote: string;
}

export const CITY_DIRECTORY: CityInfo[] = [
  { name: '喀什', province: '新疆', region: '西北大漠', lat: 39.47, lng: 75.99, mapX: 145, mapY: 205, poeticNote: '丝路尽头的黄墙绿顶与迷宫老城' },
  { name: '大理', province: '云南', region: '滇西苍洱', lat: 25.60, lng: 100.27, mapX: 405, mapY: 418, poeticNote: '苍山洱海间的雨季与二十度微风' },
  { name: '丽江', province: '云南', region: '滇西北', lat: 26.87, lng: 100.23, mapX: 408, mapY: 395, poeticNote: '玉龙雪山下的石板路与流水人家' },
  { name: '西双版纳', province: '云南', region: '滇南雨林', lat: 22.01, lng: 100.80, mapX: 412, mapY: 468, poeticNote: '热带雨林深处湿漉漉的仲夏夜' },
  { name: '平遥', province: '山西', region: '晋中大地', lat: 37.20, lng: 112.18, mapX: 545, mapY: 245, poeticNote: '二十六度晴天里活着的明清县城' },
  { name: '西江千户苗寨', province: '贵州', region: '黔东南', lat: 26.49, lng: 108.17, mapX: 496, mapY: 402, poeticNote: '层叠吊脚楼与雨雾中的万家灯火' },
  { name: '镇远古镇', province: '贵州', region: '黔东南', lat: 27.05, lng: 108.42, mapX: 505, mapY: 390, poeticNote: '舞阳河畔碧水穿城的夏日慢时光' },
  { name: '恩施', province: '湖北', region: '鄂西秘境', lat: 30.27, lng: 109.49, mapX: 515, mapY: 342, poeticNote: '峡谷绝壁与翡翠般的屏山清江' },
  { name: '凤凰古城', province: '湖南', region: '湘西边城', lat: 27.95, lng: 109.60, mapX: 518, mapY: 378, poeticNote: '沱江薄雾、吊脚飞檐与翠翠的梦' },
  { name: '景德镇', province: '江西', region: '赣东北', lat: 29.27, lng: 117.18, mapX: 602, mapY: 360, poeticNote: '千年窑火未冷，捏一只歪扭的瓷杯' },
  { name: '黄山', province: '安徽', region: '古徽州', lat: 30.13, lng: 118.17, mapX: 614, mapY: 344, poeticNote: '奇松云海间淋一场酣畅的山雨' },
  { name: '西塘古镇', province: '浙江', region: '江南水乡', lat: 30.95, lng: 120.89, mapX: 648, mapY: 332, poeticNote: '烟雨长廊下摇橹声与温热黄酒' },
  { name: '绍兴', province: '浙江', region: '越中水乡', lat: 30.00, lng: 120.58, mapX: 644, mapY: 348, poeticNote: '乌篷船、鲁镇旧影与青石板巷' },
  { name: '霞浦', province: '福建', region: '闽东海岸', lat: 26.88, lng: 120.01, mapX: 636, mapY: 396, poeticNote: '潮汐在滩涂上写下的光影诗行' },
  { name: '泉州', province: '福建', region: '闽南刺桐', lat: 24.87, lng: 118.67, mapX: 618, mapY: 426, poeticNote: '半城烟火半城仙，红砖古厝与海风' },
  { name: '涠洲岛', province: '广西', region: '北部湾', lat: 21.04, lng: 109.12, mapX: 510, mapY: 486, poeticNote: '火山岩礁与香蕉林里的热带海岛夏日' },
];

export function detectCity(title: string, filename: string): CityInfo | undefined {
  for (const city of CITY_DIRECTORY) {
    if (title.includes(city.name) || filename.includes(city.name)) {
      return city;
    }
  }
  const slugMap: Record<string, string> = {
    kashgar: '喀什',
    dali: '大理',
    lijiang: '丽江',
    xishuangbanna: '西双版纳',
    pingyao: '平遥',
    xijiang: '西江千户苗寨',
    zhenyuan: '镇远古镇',
    enshi: '恩施',
    fenghuang: '凤凰古城',
    jingdezhen: '景德镇',
    huangshan: '黄山',
    xitang: '西塘古镇',
    shaoxing: '绍兴',
    xiapu: '霞浦',
    quanzhou: '泉州',
    weizhou: '涠洲岛',
  };
  for (const [slug, cityName] of Object.entries(slugMap)) {
    if (filename.toLowerCase().includes(slug)) {
      return CITY_DIRECTORY.find((c) => c.name === cityName);
    }
  }
  return undefined;
}

function stripMarkdown(md: string): string {
  return md
    .replace(/^---\n[\s\S]*?\n---\n*/, '')
    .replace(/^#\s+[^\n]+\n*/m, '')
    .replace(/!\[[^\]]*\]\([^)]+\)/g, '')
    .replace(/\[([^\]]+)\]\([^)]+\)/g, '$1')
    .replace(/[#>*_`~-]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

export function enrichPost(entry: CollectionEntry<'posts'>): EnrichedPost {
  const rawBody = entry.body || '';
  const firstLineMatch = rawBody.trimStart().match(/^#\s+([^\n]+)/);
  let displayTitle = entry.data.title;
  let subtitle: string | undefined;

  if (firstLineMatch) {
    const h1Text = firstLineMatch[1].trim();
    if (h1Text !== entry.data.title) {
      if (h1Text.includes('：') || h1Text.includes('·')) {
        const parts = h1Text.split(/[：·]/);
        if (parts[0].trim() === entry.data.title && parts[1]) {
          subtitle = parts.slice(1).join(' · ').trim();
        } else {
          subtitle = h1Text;
        }
      } else {
        subtitle = h1Text;
      }
    }
  } else if (entry.data.title.includes('：') || entry.data.title.includes('·')) {
    const sep = entry.data.title.includes('：') ? '：' : '·';
    const parts = entry.data.title.split(sep);
    if (parts.length >= 2 && parts[0].trim().length <= 8) {
      displayTitle = parts[0].trim();
      subtitle = parts.slice(1).join(' · ').trim();
    }
  }

  const imageMatch = rawBody.match(/!\[[^\]]*\]\(([^)]+)\)/);
  const coverImage = imageMatch ? imageMatch[1] : undefined;

  const plainText = stripMarkdown(rawBody);
  const excerpt = entry.data.description || (plainText.length > 88 ? plainText.slice(0, 88) + '…' : plainText);
  const charCount = plainText.replace(/\s+/g, '').length;
  const readingMinutes = Math.max(1, Math.round(charCount / 360));

  const d = entry.data.date;
  const yyyy = d.getFullYear();
  const mm = String(d.getMonth() + 1).padStart(2, '0');
  const dd = String(d.getDate()).padStart(2, '0');

  const cat = entry.data.category as CategoryKey;
  const city = cat === 'travel' ? detectCity(entry.data.title, entry.id) : undefined;

  return {
    entry,
    id: entry.id,
    url: `/posts/${entry.id}/`,
    title: displayTitle,
    subtitle,
    date: d,
    dateFormatted: `${yyyy}.${mm}.${dd}`,
    shortDate: `${mm}/${dd}`,
    year: yyyy,
    month: `${yyyy} 年 ${mm} 月`,
    category: cat,
    categoryMeta: CATEGORIES[cat] || CATEGORIES.dream,
    excerpt,
    wordCount: charCount,
    readingMinutes,
    coverImage,
    city,
    plainText,
  };
}

export async function getAllPosts(): Promise<EnrichedPost[]> {
  const raw = await getCollection('posts');
  return raw
    .map(enrichPost)
    .sort((a, b) => b.date.getTime() - a.date.getTime());
}

export interface CitySummary {
  city: CityInfo;
  posts: EnrichedPost[];
  latestDate: string;
}

export function groupTravelsByCity(posts: EnrichedPost[]): CitySummary[] {
  const travelPosts = posts.filter((p) => p.category === 'travel');
  const map = new Map<string, EnrichedPost[]>();

  for (const post of travelPosts) {
    const cityName = post.city?.name;
    if (!cityName) continue;
    const arr = map.get(cityName) || [];
    arr.push(post);
    map.set(cityName, arr);
  }

  const summaries: CitySummary[] = [];
  for (const city of CITY_DIRECTORY) {
    const cityPosts = map.get(city.name);
    if (cityPosts && cityPosts.length > 0) {
      summaries.push({
        city,
        posts: cityPosts,
        latestDate: cityPosts[0].dateFormatted,
      });
    }
  }

  return summaries.sort((a, b) => b.posts.length - a.posts.length);
}
