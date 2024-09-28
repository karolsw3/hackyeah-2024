import React from 'react'
import InputArea from './InputArea.tsx'
import ConversationMessage from './ConversationMessage.tsx'
import { useEffect } from 'react'
import { useApiCommunicatorStore } from '../modules/ApiCommunicator/ApiCommunicatorStore.ts'
import classNames from 'classnames'

const MainChatWindow: React.FC = () => {
	const messages = useApiCommunicatorStore((state) => state.messages);
	const fetchMessages = useApiCommunicatorStore((state) => state.fetchMessages);

	useEffect(() => {
		fetchMessages()
	}, [fetchMessages])

	return (
		<div
			className={classNames(
				'w-full h-screen flex flex-col'
			)}
		>
			<div
				className={'py-10 flex-1 overflow-y-scroll'}
			>
				{ messages.map((message, index) => (
					<ConversationMessage
						isMessageFirst={index === 0}
						isMessageLast={index === messages.length - 1}
						key={`conversation-message-${message.timestamp }`}
						{ ...message }
					/>
				))}
			</div>
			<InputArea/>
		</div>
	)
}

export default MainChatWindow;
