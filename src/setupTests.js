// jest-dom adds custom jest matchers for asserting on DOM nodes.
// allows you to do things like:
// expect(element).toHaveTextContent(/react/i)
// learn more: https://github.com/testing-library/jest-dom
import '@testing-library/jest-dom';

import { jest } from '@jest/globals';

jest.mock('react-player', () => () => ({
  type: 'div',
  props: { children: 'Mocked ReactPlayer' },
}));
import 'react-player';
// Mocking the react-player library to avoid issues with video playback in tests

if (!window.matchMedia) {
  window.matchMedia = function () {
    return {
      matches: false,
      addListener: () => {},
      removeListener: () => {},
      addEventListener: () => {},
      removeEventListener: () => {},
      dispatchEvent: () => {},
    };
  };
}
