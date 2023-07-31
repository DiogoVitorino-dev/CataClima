import renderer from 'react-test-renderer'
import { Button, HeaderButton, Loading, PermissionModal, Searchbar, SimpleModal, TimeAgo } from '../../../components/shared';


describe('Components Snapshots', () => {
	it('should Button component renders correctly', () => {    
		const tree = renderer.create(<Button label='test' onPress={()=>{}} />).toJSON();
		expect(tree).toMatchSnapshot()    
	})

	it('should HeaderButton component renders correctly', () => {    
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

	it('should Loading component renders correctly', () => {    
		const tree = renderer.create(<Loading />).toJSON();
		expect(tree).toMatchSnapshot()    
	})

	it('should PermissionModal component renders correctly', () => {    
		const tree = renderer.create(
		<PermissionModal 
		visible 
		onPressFirstButton={()=>{}} 
		onPressSecondButton={()=>{}} 
		onDismiss={()=>{}} />).toJSON();
		expect(tree).toMatchSnapshot()    
	})

	it('should Searchbar component renders correctly', () => {    
		const tree = renderer.create(
		<Searchbar      
			onChangeText={()=>{}}
			placeholder='a'      
			backgroundColor='#fff'
		/>).toJSON();
		expect(tree).toMatchSnapshot()    
	})

	it('should SimpleModal component renders correctly', () => {    
		const tree = renderer.create(<SimpleModal message='test' visible />).toJSON();
		expect(tree).toMatchSnapshot()    
	})

	it('should TimeAgo component renders correctly', () => {
		const date = new Date().toISOString()
		const tree = renderer.create(
		<TimeAgo dateIsoFormat={date} />).toJSON();
		expect(tree).toMatchSnapshot()    
	})
})