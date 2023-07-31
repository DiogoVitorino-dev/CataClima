import {describe,it, expect, afterEach} from '@jest/globals';
import { cleanup } from '@testing-library/react-native';
import renderer from 'react-test-renderer'
import TimeAgo from '../../components/TimeAgo';

describe('TimeAgo component', () => {    
    afterEach(cleanup)

    it('should renders correctly', () => {
        const date = new Date().toISOString()
        const tree = renderer.create(
        <TimeAgo dateIsoFormat={date} />).toJSON();
        expect(tree).toMatchSnapshot()    
    })
})
