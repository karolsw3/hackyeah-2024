import React, { useMemo } from 'react'
import InputArea from './InputArea.tsx'
import ConversationMessage from './ConversationMessage.tsx'
import { useApiCommunicatorStore } from '../modules/ApiCommunicator/ApiCommunicatorStore.ts'
import classNames from 'classnames'
import ConversationHeader from './ConversationHeader.tsx'

const MainChatWindow: React.FC = () => {
	const conversations = useApiCommunicatorStore((state) => state.conversations);
	const currentlyOpenConversationId = useApiCommunicatorStore((state) => state.currentlyOpenConversationId);
	const messages = useMemo(() => {
		const currentConversation = conversations.find(conversation => conversation._id === currentlyOpenConversationId);
		if (!currentConversation) return [];
		return currentConversation.messages;
	}, [conversations, currentlyOpenConversationId]);

	return (
		<div
			className={classNames(
				'w-full h-screen flex flex-col'
			)}
		>
			<ConversationHeader
				title={currentlyOpenConversationId}
			/>
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
