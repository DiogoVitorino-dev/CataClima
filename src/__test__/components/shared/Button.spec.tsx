import { render, cleanup } from '@testing-library/react-native';
import {Button} from '../../../components/shared'

describe('Integration Test Button component', () => {
  afterEach(cleanup)
  
  it("should show title", () => { 
    const {getByText} = render(<Button label='test' onPress={()=>{}} />)
    getByText('test')
  })
})