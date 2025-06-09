import sinon from 'sinon';

// Clean up Sinon stubs after each test
afterEach(() => {
  sinon.restore();
});