// Подпись поста на английской версии: списки постов общие для обоих языков.
const months: Record<string, string> = {
  января: 'January', февраля: 'February', марта: 'March', апреля: 'April', мая: 'May', июня: 'June',
  июля: 'July', августа: 'August', сентября: 'September', октября: 'October', ноября: 'November', декабря: 'December',
};

export const englishDate = (date: string) => date
  .replace(/^(\d+) ([а-я]+) (\d{4})$/, (_, day, month, year) => `${months[month]} ${day}, ${year}`);
