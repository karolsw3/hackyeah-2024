import React, { useMemo } from 'react'
import InputArea from './InputArea.tsx'
import ConversationMessage from './ConversationMessage.tsx'
import { useApiCommunicatorStore } from '../modules/ApiCommunicator/ApiCommunicatorStore.ts'
import classNames from 'classnames'
import ConversationHeader from './ConversationHeader.tsx'
import { IConversation } from '../modules/ApiCommunicator/ApiCommunicator.ts'
import { getDataFromServerMessage } from '../helpers/getDataFromServerMessage.ts'
import { AnimatePresence, motion } from 'framer-motion'

const MainChatWindow: React.FC = () => {
	const currentlyOpenConversationId = useApiCommunicatorStore((state) => state.currentlyOpenConversationId);
	const currentConversation = useApiCommunicatorStore((state) => {
			return state.conversations.find((conversation: IConversation) => conversation._id === state.currentlyOpenConversationId)
	});

	const messages = useMemo(() => {
		if (!currentConversation) return [];
		return currentConversation.messages
	}, [currentConversation]);

	const pccXml = useMemo(() => {
		const lastMessage = messages[messages.length - 1];
		if (!lastMessage) return null;
		return getDataFromServerMessage(lastMessage.text);
	}, [messages]);

	return (
		<div
			className={classNames(
				'w-full h-screen flex flex-col'
			)}
		>
			<ConversationHeader
				title={currentlyOpenConversationId}
				xml={pccXml}
			/>
			<div
				className={'py-10 flex-1 overflow-y-scroll flex flex-col-reverse'}
			>
      	<AnimatePresence initial={true} mode='popLayout'>
					{[...messages].reverse().map((message, index) => (
						<motion.div
							initial={{ opacity: 0, scale: 0.9 }}
							animate={{ opacity: 1, scale: 1 }}
							exit={{ opacity: 0, scale: 0.9 }}
							transition={{
								delay: 0.05 * index,
							}}
							key={`conversation-message-${message.timestamp}-${message.role}`}
						>
							<ConversationMessage
								isMessageFirst={index === 0 || messages[index - 1]?.role !== message.role}
								isMessageLast={index === messages.length - 1 || messages[index - 1]?.role !== message.role}
								{ ...message }
							/>
						</motion.div>
					))}
				</AnimatePresence>
			</div>
			<InputArea />
		</div>
	)
}

export default MainChatWindow;
