import {describe,it, expect, jest, afterEach} from '@jest/globals';
import { render, fireEvent, cleanup } from '@testing-library/react-native';
import renderer from 'react-test-renderer'
import Searchbar from '../../components/Searchbar';

describe('SearchBar component', () => {  
  afterEach(cleanup)

  it('should renders correctly', () => {    
      const tree = renderer.create(
      <Searchbar      
        onChangeText={()=>{}}
        placeholder='a'      
        backgroundColor='#fff'
      />).toJSON();
      expect(tree).toMatchSnapshot()    
  })
  
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