

export function parsePgTimeStampToISODateTime(timeStamp: string): string {
  return new Date(timeStamp.replace(' ', 'T')).toISOString();
}

export function parseISODateTimeToPgTimeStamp(dateTime: string): string {
  const date = new Date(dateTime);

  // Format: YYYY-MM-DD HH:MM:SS.ssssss
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');

  const hours = String(date.getHours()).padStart(2, '0');
  const minutes = String(date.getMinutes()).padStart(2, '0');
  const seconds = String(date.getSeconds()).padStart(2, '0');
  const milliseconds = String(date.getMilliseconds()).padStart(3, '0');

  return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}.${milliseconds}`;
}