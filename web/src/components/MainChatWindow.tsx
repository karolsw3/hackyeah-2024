import React, { useCallback, useMemo, useState } from 'react'
import InputArea from './InputArea.tsx'
import ConversationMessage from './ConversationMessage.tsx'
import { useApiCommunicatorStore } from '../modules/ApiCommunicator/ApiCommunicatorStore.ts'
import classNames from 'classnames'
import ConversationHeader from './ConversationHeader.tsx'
import { getDataFromServerMessage } from '../helpers/getDataFromServerMessage.ts'
import { AnimatePresence, motion } from 'framer-motion'
import { useTranslation } from 'react-i18next'

const MainChatWindow: React.FC = () => {
	const { t } = useTranslation();
	const apiCommunicatorState = useApiCommunicatorStore()
	const updateConversation = apiCommunicatorState.updateConversation;
	const currentConversation = useMemo(() => {
		return apiCommunicatorState.conversations.find(
			conversation => conversation._id === apiCommunicatorState.currentlyOpenConversationId
		)
	}, [apiCommunicatorState.currentlyOpenConversationId, apiCommunicatorState.conversations]);
	const [isUpdateConversationLoading, setIsUpdateConversationLoading] = useState(false);

	const messages = useMemo(() => {
		if (!currentConversation) return [];
		return currentConversation.messages
	}, [currentConversation]);

	const pccXml = useMemo(() => {
		for (let i = messages.length - 1; i >= 0; i--) {
			const dataString = getDataFromServerMessage(messages[i].text);
			if (!dataString) continue;
			return dataString;
		}
	}, [messages]);

	const handleTitleChange = useCallback(async (newTitle: string) => {
		if (!currentConversation) return;
		setIsUpdateConversationLoading(true);
		await updateConversation({
			conversationId: currentConversation._id,
			label: newTitle
		});
		setIsUpdateConversationLoading(false);
	}, [currentConversation, updateConversation]);

	const currentConversationLabel = useMemo(() => {
		if (!currentConversation) return '-';
		return currentConversation.label ?? t("Konwersacja") + " #" + currentConversation._id.slice(0, 3);
	}, [currentConversation]);

	return (
		<div
			className={classNames(
				'w-full h-screen flex flex-col'
			)}
		>
			<ConversationHeader
				title={currentConversationLabel}
				xml={pccXml}
				onTitleChange={handleTitleChange}
				isTitleChangeDisabled={isUpdateConversationLoading}
			/>
			<div
				className={'py-10 flex-1 overflow-y-scroll flex flex-col-reverse gap-4'}
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
								{...message}
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
