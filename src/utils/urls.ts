import urlJoin from 'url-join';
import settings from '@/settings';

export function join(...tokens: string[]) {
  return urlJoin(...tokens);
}

export function buildBaseURL() {
  return settings.BASE_URL;
}

export function buildMediaURL(...tokens: string[]) {
  return join(
    buildBaseURL(),
    settings.MEDIA_URL_PREFIX, 
    ...tokens
  );
}
