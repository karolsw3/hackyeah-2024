import React, { useMemo } from 'react'
import InputArea from './InputArea.tsx'
import ConversationMessage from './ConversationMessage.tsx'
import { useApiCommunicatorStore } from '../modules/ApiCommunicator/ApiCommunicatorStore.ts'
import classNames from 'classnames'
import ConversationHeader from './ConversationHeader.tsx'
import { IConversation } from '../modules/ApiCommunicator/ApiCommunicator.ts'

const MainChatWindow: React.FC = () => {
	const currentlyOpenConversationId = useApiCommunicatorStore((state) => state.currentlyOpenConversationId);
	const currentConversation = useApiCommunicatorStore((state) => {
			return state.conversations.find((conversation: IConversation) => conversation._id === state.currentlyOpenConversationId)
	});

	const messages = useMemo(() => {
		if (!currentConversation) return [];
		return currentConversation.messages
	}, [currentConversation]);

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
						key={`conversation-message-${message.timestamp}-${message.role}`}
						{ ...message }
					/>
				))}
			</div>
			<InputArea />
		</div>
	)
}

export default MainChatWindow;
