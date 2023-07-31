import {SimpleModal} from '../../../components/shared';
import { render, fireEvent } from '@testing-library/react-native';

describe('SimpleModal component', () => { 
    it('should show title', () => {
        const {getByText} = render(<SimpleModal message='test' visible />)
        expect(getByText('test')).toBeTruthy()   
    })

    it('should hide on button click', () => {
        const {getAllByRole,queryAllByRole} = render(<SimpleModal message='test' visible />)

        const button = getAllByRole('button')[1]
        expect(button).toBeDefined()        

        fireEvent.press(button)

        expect(queryAllByRole('button').length).toBeLessThanOrEqual(0)
    })
    
    it('should hide when clicking anywhere on the screen', () => {
        const {getAllByRole,queryAllByRole} = render(<SimpleModal message='test' visible />)

        const button = getAllByRole('button')[0]
        expect(button).toBeDefined()        

        fireEvent.press(button)

        expect(queryAllByRole('button').length).toBeLessThanOrEqual(0)
    })
  
 

})