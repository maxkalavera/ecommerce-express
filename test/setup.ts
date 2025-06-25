import sinon from 'sinon';
import { getDatabase } from '@/db';
import { clearData } from '@/utils/db';
import settings from '@/settings';

// Clean up Sinon stubs after each test
afterEach(async () => {
  sinon.restore();

  const db = getDatabase(settings.TESTING_DATABASE);
  await clearData(db);
});