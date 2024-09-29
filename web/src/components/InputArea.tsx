import React, { useCallback } from 'react'
import { useState } from 'react'
import { useApiCommunicatorStore } from '../modules/ApiCommunicator/ApiCommunicatorStore.ts'
import classNames from 'classnames'
import { SendButton } from './SendButton.tsx'
import { FiPaperclip } from "react-icons/fi";

const InputArea = () => {
	useApiCommunicatorStore.getState()
	const {
		sendMessage, currentlyOpenConversationId, createUser, createConversation
	} = useApiCommunicatorStore.getState();
	const [inputValue, setInputValue] = useState('');

	const handleSendMessage = useCallback(async () => {
		try {
			setInputValue('')
			if (!currentlyOpenConversationId) {
				await createUser()
				await createConversation()
			}
			await sendMessage(inputValue)
		} catch (error) {
			console.error(error)
		}
	}, [sendMessage, inputValue, currentlyOpenConversationId, createUser, createConversation])

	const handleInputEnterPressed = useCallback(async () => {
		handleSendMessage()
	}, [handleSendMessage])

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
			<div
				className={ classNames(
					'relative w-full rounded-full',
					'border border-neutral-300 flex items-center'
				)}
			>
				<input
					autoFocus={true}
					type={'text'}
					value={inputValue}
					placeholder={'Wiadomość...'}
					onChange={e => setInputValue(e.target.value)}
					className={classNames(
						'w-full h-full px-4 py-3 rounded-full'
					)}
					onKeyDown={handleInputKeyDown}
				/>
				<button
					aria-label={'Upload file'}
					className={ classNames(
						'absolute right-0 mr-2 w-8 h-8 rounded-full',
						'inline-flex items-center text-xl justify-center text-neutral-500',
						'active:opacity-50 duration-75'
					)}
				>
					<FiPaperclip/>
				</button>
			</div>
			<SendButton
				className='ml-2'
				onClick={ handleSendMessage }
				disabled={ inputValue === '' }
			/>
		</div>
	);
}

export default InputArea;
