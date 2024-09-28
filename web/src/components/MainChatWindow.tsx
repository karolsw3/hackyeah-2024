import React from 'react'
import InputArea from './InputArea.tsx'
import ConversationMessage from './ConversationMessage.tsx'
import { useEffect } from 'react'
import { useApiCommunicatorStore } from '../modules/ApiCommunicator/ApiCommunicatorStore.ts'

type MainChatWindowProps = {
	title: string;
}

const MainChatWindow: React.FC<MainChatWindowProps> = (props) => {
	const { title } = props;
	const messages = useApiCommunicatorStore((state) => state.messages);
	const fetchMessages = useApiCommunicatorStore((state) => state.fetchMessages);

	useEffect(() => {
		console.log('fetching messages')
		fetchMessages()
	}, [fetchMessages])

	return (
		<>
			<div>
				{ title }
				{messages.map((message) => (
					<ConversationMessage
						key={`conversation-message-${message.timestamp}`}
						{...message}
					/>
				)) }
			</div>
			<InputArea />
		</>
	)
}

export default MainChatWindow;
