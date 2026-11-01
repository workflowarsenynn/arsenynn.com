// Путь к файлу из public/ с учётом base: сайт работает и на arsenynn.com,
// и на workflowarsenynn.github.io/arsenynn.com/ до подключения DNS.
export const asset = (path: string) => `${import.meta.env.BASE_URL.replace(/\/$/, '')}${path}`;
