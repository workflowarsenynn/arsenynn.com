export type LinkType = 'telegram' | 'website' | 'portfolio' | 'listen' | 'other';

export type ProjectLink = {
  label: string;
  url: string;
  type: LinkType;
  primary?: boolean;
};

export type ProjectStatus = 'active' | 'coming-soon' | 'private';

export type Project = {
  id: string;
  order: number;
  /** Резерв будущего маршрута /<slug>. В MVP страниц нет. */
  slug: string;
  title: string;
  tags: string[];
  shortDescription: string;
  /** Абзацы для About, не больше четырёх. Пусто — кнопки About нет. */
  longDescription?: string[];
  status: ProjectStatus;
  /** Подпись вместо ссылок, когда публичного URL нет. */
  statusLabel?: string;
  links: ProjectLink[];
  /** Логотип вместо текстового названия. Файл в public/logos/. */
  logo?: { src: string; width: number; height: number };
  detailPageEnabled: boolean;
};
