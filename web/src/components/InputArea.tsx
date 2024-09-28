import { useState } from 'react'
import { useApiCommunicatorStore } from '../modules/ApiCommunicator/ApiCommunicatorStore.ts'

const InputArea = () => {
	const sendMessage = useApiCommunicatorStore((state) => state.sendMessage);
	const [inputValue, setInputValue] = useState('');

	const handleInputKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
		if (event.key !== 'Enter') {
			return;
		}
		handleInputEnterPressed()
	}

	const handleInputEnterPressed = async () => {
		try {
			await sendMessage(inputValue)
			setInputValue('')
		} catch (error) {
			console.error(error)
		}
	}

	return (
		<>
			<input
				type={'text'}
				value={inputValue}
				onChange={e => setInputValue(e.target.value)}
				onKeyDown={handleInputKeyDown}
			/>
		</>
	);
}

export default InputArea;
