import {describe,it, expect, afterEach} from '@jest/globals';
import renderer from 'react-test-renderer'
import SimpleModal from '../../components/SimpleModal';
import { render, fireEvent, cleanup } from '@testing-library/react-native';

describe('SimpleModal component', () => {  
    afterEach(cleanup)

    it('should renders correctly', () => {    
        const tree = renderer.create(<SimpleModal message='test' visible />).toJSON();
        expect(tree).toMatchSnapshot()    
    })
  
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