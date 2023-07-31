import { render, fireEvent } from '@testing-library/react-native';
import {Button} from '../../../components/shared'

describe('Button component', () => {
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