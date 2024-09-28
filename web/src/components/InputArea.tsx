import { useState } from 'react'
import { useApiCommunicatorStore } from '../modules/ApiCommunicator/ApiCommunicatorStore.ts'
import classNames from 'classnames'

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
		<div
			className={classNames(
				'w-full py-4 px-4 flex items-center justify-center',
				'border-t border-neutral-200'
			)}
		>
			<input
				type={'text'}
				value={inputValue}
				placeholder={'Message...'}
				onChange={e => setInputValue(e.target.value)}
				className={classNames(
					'w-full max-w-96 rounded-full px-4 py-2',
					'border border-neutral-300'
				)}
				onKeyDown={handleInputKeyDown}
			/>
		</div>
	);
}

export default InputArea;
