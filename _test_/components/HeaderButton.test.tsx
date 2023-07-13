import {describe,it, expect, afterEach} from '@jest/globals';
import { cleanup } from '@testing-library/react-native';
import renderer from 'react-test-renderer'
import HeaderButton from '../../components/HeaderButton';

describe('HeaderButton component', () => {
  afterEach(cleanup)

  it('should renders correctly', () => {    
      const tree = renderer.create(
      <HeaderButton
        href='/'
        onPress={()=>{}}
        params={{test:'test'}}
        style={{margin:5}}
        icon='cloud' 
        iconColor='#fff' 
        iconSize={20} 
      />).toJSON();
      
      expect(tree).toMatchSnapshot()    
  }) 
})