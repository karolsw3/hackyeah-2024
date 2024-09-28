import React, { useCallback } from 'react'
import { useState } from 'react'
import { useApiCommunicatorStore } from '../modules/ApiCommunicator/ApiCommunicatorStore.ts'
import classNames from 'classnames'
import { SendButton } from './SendButton.tsx'

const InputArea = () => {
	useApiCommunicatorStore.getState()
	const {
		sendMessage, currentlyOpenConversationId, createUser, createConversation
	} = useApiCommunicatorStore.getState();
	const [inputValue, setInputValue] = useState('');

	const trySendMessage = useCallback(async () => {
		try {
			if (!currentlyOpenConversationId) {
				await createUser()
				await createConversation()
			}
			await sendMessage(inputValue)
			setInputValue('')
		} catch (error) {
			console.error(error)
		}
	}, [sendMessage, inputValue, currentlyOpenConversationId, createUser, createConversation])

	const handleInputEnterPressed = useCallback(async () => {
		trySendMessage()
	}, [trySendMessage])

	const handleInputKeyDown = useCallback((event: React.KeyboardEvent<HTMLInputElement>) => {
		if (event.key !== 'Enter') {
			return;
		}
		handleInputEnterPressed()
	}, [handleInputEnterPressed])

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
			<SendButton
				className='ml-2'
				onClick={trySendMessage}
				disabled={inputValue === ''}
			/>
		</div>
	);
}

export default InputArea;
