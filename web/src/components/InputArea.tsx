import React from 'react'
import { useState } from 'react'
import { useApiCommunicatorStore } from '../modules/ApiCommunicator/ApiCommunicatorStore.ts'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
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
		trySendMessage()
	}
	
	const trySendMessage = async () => {
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
				'relative w-full py-4 px-3 flex items-center justify-center',
				'border-t border-neutral-200'
			)}
		>
			<input
				autoFocus={true}
				type={'text'}
				value={inputValue}
				placeholder={'Message...'}
				onChange={e => setInputValue(e.target.value)}
				className={classNames(
					'w-full rounded-full px-4 py-3',
					'border border-neutral-300'
				)}
				onKeyDown={handleInputKeyDown}
			/>
			<button
				disabled={inputValue === ''}
				title={'Send message'}
				aria-label={'Send message'}
				className={classNames(
					'ml-2 rounded-full w-12 h-12 flex-shrink-0 bg-gov-red',
					'text-white flex items-center justify-center',
					'active:opacity-50 duration-75 disabled:opacity-50 disabled:cursor-not-allowed'
				)}
				onClick={trySendMessage}
			>
				<FontAwesomeIcon icon={"paper-plane"} />
			</button>
		</div>
	);
}

export default InputArea;
