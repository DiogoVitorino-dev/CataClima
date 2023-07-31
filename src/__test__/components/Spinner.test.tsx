import {describe,it, expect, afterEach} from '@jest/globals';
import { cleanup } from '@testing-library/react-native';
import renderer from 'react-test-renderer'
import Spinner from '../../components/Spinner';

describe('Spinner component', () => {
  afterEach(cleanup)

  it('should renders correctly', () => {    
      const tree = renderer.create(<Spinner />).toJSON();
      expect(tree).toMatchSnapshot()    
  })
})