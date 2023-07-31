import {describe,it, expect, jest, afterEach} from '@jest/globals';
import { render, fireEvent, cleanup } from '@testing-library/react-native';
import renderer from 'react-test-renderer'
import Button from '../../components/Button'

describe('Button component', () => {
  afterEach(cleanup)

  it('should renders correctly', () => {    
      const tree = renderer.create(<Button label='test' onPress={()=>{}} />).toJSON();
      expect(tree).toMatchSnapshot()    
  })
  
  it('should call a function on Pressable click', () => { 
    const fnTest = jest.fn()
    const {getByTestId} = render(<Button label='test' onPress={fnTest} />)

    fireEvent.press(getByTestId('pressableTestID'))
    expect(fnTest).toBeCalled()
  })
  
  it("shouldn't call a function if Pressable is disabled", () => { 
    const fnTest = jest.fn()
    const {getByTestId} = render(<Button label='test' onPress={fnTest} disabled />)

    fireEvent.press(getByTestId('pressableTestID'))
    expect(fnTest).not.toBeCalled()
  })
})