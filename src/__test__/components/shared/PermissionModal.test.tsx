import { render, fireEvent } from '@testing-library/react-native';
import {PermissionModal} from '../../../components/shared';


describe('PermissionModal component', () => {  
  it('should hide and call a function when clicking on the (First) button option', () => {     
    const firstOptionFN = jest.fn()
    
    const {getAllByRole,queryAllByRole} = render(
      <PermissionModal 
        visible 
        onPressFirstButton={firstOptionFN} 
        onPressSecondButton={()=>{}} 
        onDismiss={()=>{}} 
      />
    )    
    fireEvent.press(getAllByRole('button')[0]) 

    expect(firstOptionFN).toBeCalled()

    expect(queryAllByRole('button').length).toBeLessThanOrEqual(0)
  })
  
  it('should hide and call a function when clicking on the (Second) button option', () => {     
    const secondOptionFN = jest.fn()
    
    const {getAllByRole,queryAllByRole} = render(
      <PermissionModal 
        visible 
        onPressFirstButton={()=>{}} 
        onPressSecondButton={secondOptionFN} 
        onDismiss={()=>{}} 
      />
    )    
    fireEvent.press(getAllByRole('button')[1]) 

    expect(secondOptionFN).toBeCalled()   

    expect(queryAllByRole('button').length).toBeLessThanOrEqual(0)
  }) 
  
})