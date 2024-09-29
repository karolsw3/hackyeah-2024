import React, { useCallback, useRef } from 'react'
import { useState } from 'react'
import { useApiCommunicatorStore } from '../modules/ApiCommunicator/ApiCommunicatorStore.ts'
import classNames from 'classnames'
import { SendButton } from './SendButton.tsx'
import { FileUploadButton } from './FileUploadButton.tsx'
import { fileToBase64URL } from '../helpers/fileToBase64URL.ts'
import { FiX } from 'react-icons/fi'

const InputArea = () => {
	useApiCommunicatorStore.getState()
	const {
		sendMessage,
		currentlyOpenConversationId,
		createUser,
		createConversation
	} = useApiCommunicatorStore.getState();
	const [inputValue, setInputValue] = useState('');
	const [selectedFile, setSelectedFile] = useState<File | null>(null);
	const [selectedFileURL, setSelectedFileURL] = useState<string | null>(null);
	const [messageRequiredIndicator, setMessageRequiredIndicator] = useState(false);
	const messageRequiredIndicatorTimeout = useRef<number | null>(null);

	const handleSendMessage = useCallback(async () => {
		if (messageRequiredIndicatorTimeout.current) {
			clearTimeout(messageRequiredIndicatorTimeout.current)
		}
		if (inputValue === '') {
			setMessageRequiredIndicator(true)
			messageRequiredIndicatorTimeout.current = setTimeout(() => {
				setMessageRequiredIndicator(false)
			}, 2000)
			return
		}
		try {
			setInputValue('')
			if (!currentlyOpenConversationId) {
				await createUser()
				await createConversation()
			}
			await sendMessage(inputValue, selectedFile ?? undefined)
		} catch (error) {
			console.error(error)
		}
	}, [currentlyOpenConversationId, sendMessage, inputValue, selectedFile, createUser, createConversation])

	const handleFileSelected = async (file: File) => {
		try {
			setSelectedFile(file)
			const url = await fileToBase64URL(file)
			setSelectedFileURL(url)
		} catch (error) {
			console.error(error)
		}
	};

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
				'relative w-full py-4 px-3 flex flex-col items-start',
				'border-t border-neutral-200'
			)}
		>
			{selectedFile && (
				<div className='border-neutral-200 border p-2 rounded-xl mb-4 w-48 relative'>
					<button
						onClick={() => {
							setSelectedFile(null);
							setSelectedFileURL(null);
						}}
						className='absolute -top-2 -right-2 p-1 rounded-full bg-gov-red text-white hover:bg-red-600 active:bg-red-500 duration-150'
					>
						<FiX size={16} />
					</button>
					<div className='w-full h-28'>
						{selectedFileURL && (
							<img
								src={selectedFileURL}
								alt={selectedFile.name}
								className='w-full h-full object-cover rounded-lg'
							/>
						)}
					</div>
					<p className='text-[0.75rem] leading-[0.875rem] mt-2 text-neutral-600'>
						{selectedFile.name}
					</p>
				</div>
			)}
			<div className='flex items-center w-full justify-between'>
				<div
					className={ classNames(
						'relative w-full rounded-full',
						'border border-neutral-300 flex items-center duration-200 focus:ring',
						{ 'ring ring-gov-red': messageRequiredIndicator }
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
					<FileUploadButton
						onFileSelected={handleFileSelected}
						file={selectedFile}
					/>
				</div>
				<SendButton
					className='ml-2'
					onClick={handleSendMessage}
				/>
			</div>
		</div>
	);
}

export default InputArea;
