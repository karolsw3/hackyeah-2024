import { mockupApiCommunicator } from '../main.tsx'
import { useState } from 'react'

const InputArea = () => {
	const [inputValue, setInputValue] = useState('');

	const handleInputKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
		if (event.key !== 'Enter') {
			return;
		}
		handleInputEnterPressed()
	}

	const handleInputEnterPressed = () => {
		mockupApiCommunicator.sendMessage({
			message: inputValue,
		})
		setInputValue('')
	}

	return (
		<>
			<input
				type={'text'}
				onChange={e => setInputValue(e.target.value)}
				onKeyDown={handleInputKeyDown}
			/>
		</>
	);
}

export default InputArea;
