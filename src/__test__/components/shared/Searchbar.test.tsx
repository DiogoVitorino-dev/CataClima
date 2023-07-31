import { render, fireEvent } from '@testing-library/react-native';
import {Searchbar} from '../../../components/shared';

describe('SearchBar component', () => {  
  it('should show placeholder text', () => {
    const {getByPlaceholderText} = render(
      <Searchbar      
        onChangeText={()=>{}}
        placeholder='test'
      />)

    expect(getByPlaceholderText('test')).toBeTruthy()   
  })
  
  it('should a function receives a text when user types', () => {
    const changedTextFN = jest.fn()
    const {getByPlaceholderText} = render(
      <Searchbar      
        onChangeText={changedTextFN}
        placeholder='test'
      />)

      fireEvent.changeText(getByPlaceholderText('test'),'user types')

      expect(changedTextFN).toBeCalledWith('user types')
  })   

})