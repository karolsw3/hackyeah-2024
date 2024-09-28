import InputArea from './InputArea.tsx'
import ConversationMessage from './ConversationMessage.tsx'
import { useEffect, useState } from 'react'
import { mockupApiCommunicator } from '../main.tsx'

type MainChatWindowProps = {
	title: string;
}

const MainChatWindow = (props: MainChatWindowProps) => {
	const { title } = props;
	const [messages, setMessages] = useState<ConversationMessage[]>([]);
	
	const handleGetMessages = async () => {
		const { messages: newMessages } = mockupApiCommunicator.getConversationHistory('randomId')
		setMessages(newMessages);
		return
	}

	useEffect(() => {
		handleGetMessages()
	}, [])

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
