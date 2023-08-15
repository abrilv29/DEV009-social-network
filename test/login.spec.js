import { loginView } from '../src/component/login.js';
// import { loginView } from '../src/controller/loginController.js';

describe('loginView es una function', () => {
  it('is a function', () => {
    expect(typeof loginView).toBe('function');
  });
});
