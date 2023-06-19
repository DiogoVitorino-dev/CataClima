import * as React from 'react';
import renderer from 'react-test-renderer';

import { OpenText } from '../StyledText';

it(`renders correctly`, () => {
  const tree = renderer.create(<OpenText>Snapshot test!</OpenText>).toJSON();

  expect(tree).toMatchSnapshot();
});
