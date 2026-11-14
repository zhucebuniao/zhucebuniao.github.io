import { getCollection, type CollectionEntry } from 'astro:content';

export type CategoryKey = 'dream' | 'travel' | 'novel' | 'diary';

export const CN: Record<CategoryKey, string> = {
  dream: '梦境',
  travel: '游记',
  novel: '小说',
  diary: '日记',
};

export const CI: Record<CategoryKey, string> = {
  dream: '🌙',
  travel: '🧭',
  novel: '🌊',
  diary: '🌱',
};

export interface CityInfo {
  name: string;
  province: string;
}

export const CITY_DIRECTORY: CityInfo[] = [
  { name: '喀什', province: '新疆' },
  { name: '大理', province: '云南' },
  { name: '丽江', province: '云南' },
  { name: '西双版纳', province: '云南' },
  { name: '平遥', province: '山西' },
  { name: '西江千户苗寨', province: '贵州' },
  { name: '镇远古镇', province: '贵州' },
  { name: '恩施', province: '湖北' },
  { name: '凤凰古城', province: '湖南' },
  { name: '景德镇', province: '江西' },
  { name: '黄山', province: '安徽' },
  { name: '西塘古镇', province: '浙江' },
  { name: '绍兴', province: '浙江' },
  { name: '霞浦', province: '福建' },
  { name: '泉州', province: '福建' },
  { name: '涠洲岛', province: '广西' },
];

const SLUG_CITY_MAP: Record<string, string> = {
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

export function detectCity(title: string, filename: string): CityInfo | undefined {
  for (const city of CITY_DIRECTORY) {
    if (title.includes(city.name) || filename.includes(city.name)) {
      return city;
    }
  }
  const lower = filename.toLowerCase();
  for (const [slug, cityName] of Object.entries(SLUG_CITY_MAP)) {
    if (lower.includes(slug)) {
      return CITY_DIRECTORY.find((c) => c.name === cityName);
    }
  }
  return undefined;
}

/** Deterministic static tilt angle in ±2.4deg based on post URL hash. */
export function hashRot(u: string): number {
  let h = 2166136261;
  for (let i = 0; i < u.length; i++) {
    h ^= u.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  const idx = ((h >>> 0) % 7) - 3;
  return Number((idx * 0.8).toFixed(2));
}

function stripMarkdown(md = ''): string {
  return md
    .replace(/^---\n[\s\S]*?\n---\n*/, '')
    .replace(/^#\s+[^\n]+\n*/m, '')
    .replace(/```[\s\S]*?```/g, '')
    .replace(/!\[[^\]]*\]\([^)]+\)/g, '')
    .replace(/\[([^\]]+)\]\([^)]+\)/g, '$1')
    .replace(/[#>*_`~-]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

function formatDateCN(date: Date): string {
  // Format in Asia/Shanghai (UTC+8) so dates match frontmatter regardless of build runner TZ
  const parts = new Intl.DateTimeFormat('en-CA', {
    timeZone: 'Asia/Shanghai',
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  }).formatToParts(date);
  const y = parts.find((p) => p.type === 'year')?.value ?? '2026';
  const m = parts.find((p) => p.type === 'month')?.value ?? '01';
  const d = parts.find((p) => p.type === 'day')?.value ?? '01';
  return `${y}.${m}.${d}`;
}

export interface PostItem {
  entry: CollectionEntry<'posts'>;
  id: string;
  u: string;
  c: CategoryKey;
  city: string;
  loc: string;
  d: string;
  date: Date;
  t: string;
  st: string;
  ex: string;
  w: number;
  rot: number;
}

export function enrichPost(entry: CollectionEntry<'posts'>): PostItem {
  const rawBody = entry.body || '';
  const firstLineMatch = rawBody.trimStart().match(/^#\s+([^\n]+)/);
  let displayTitle = entry.data.title;
  let subtitle = entry.data.subtitle ?? '';

  if (!subtitle && firstLineMatch) {
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
  } else if (!subtitle && (entry.data.title.includes('：') || entry.data.title.includes('·'))) {
    const sep = entry.data.title.includes('：') ? '：' : '·';
    const parts = entry.data.title.split(sep);
    if (parts.length >= 2 && parts[0].trim().length <= 8) {
      displayTitle = parts[0].trim();
      subtitle = parts.slice(1).join(' · ').trim();
    }
  }

  const plainText = stripMarkdown(rawBody);
  const ex =
    entry.data.excerpt ||
    entry.data.description ||
    (plainText.length > 80 ? plainText.slice(0, 80) + '…' : plainText);
  const w = plainText.replace(/\s+/g, '').length;

  const c = entry.data.category as CategoryKey;
  const detected = c === 'travel' ? detectCity(entry.data.title, entry.id) : undefined;
  const city = entry.data.city ?? detected?.name ?? '';
  const loc = entry.data.location ?? (detected ? `${detected.province} · ${detected.name}` : '');
  const u = `/posts/${entry.id}/`;

  return {
    entry,
    id: entry.id,
    u,
    c,
    city,
    loc,
    d: formatDateCN(entry.data.date),
    date: entry.data.date,
    t: displayTitle,
    st: subtitle,
    ex,
    w,
    rot: hashRot(u),
  };
}

export async function getPosts(): Promise<PostItem[]> {
  const all = await getCollection('posts');
  return all
    .map(enrichPost)
    .sort((a, b) => b.date.getTime() - a.date.getTime());
}

export interface CityStat {
  name: string;
  count: number;
}

export function getCityStats(posts: PostItem[]): CityStat[] {
  const map = new Map<string, number>();
  for (const p of posts) {
    if (p.city) {
      map.set(p.city, (map.get(p.city) ?? 0) + 1);
    }
  }
  return Array.from(map.entries())
    .map(([name, count]) => ({ name, count }))
    .sort((a, b) => b.count - a.count);
}
