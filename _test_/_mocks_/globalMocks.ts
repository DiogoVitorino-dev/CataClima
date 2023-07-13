import { jest } from "@jest/globals";
export * from '@react-native-async-storage/async-storage/jest/async-storage-mock';

jest.mock("expo-font");
jest.mock("expo-asset");

jest.mock('react-native/Libraries/Utilities/BackHandler', () => {
    return jest.requireActual(
      'react-native/Libraries/Utilities/__mocks__/BackHandler.js',
    );
});

jest.mock('@react-native-async-storage/async-storage', () =>
  require('@react-native-async-storage/async-storage/jest/async-storage-mock')
);