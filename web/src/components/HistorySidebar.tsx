import { useApiCommunicatorStore } from '../modules/ApiCommunicator/ApiCommunicatorStore.ts'
import { useEffect } from 'react'
import classNames from 'classnames'

const HistorySidebar = () => {
	const fetchConversations = useApiCommunicatorStore((state) => state.fetchConversations);
	const currentlyOpenConversationId = useApiCommunicatorStore((state) => state.currentlyOpenConversationId);
	const setCurrentlyOpenConversationId = useApiCommunicatorStore((state) => state.setCurrentlyOpenConversationId);
	const conversations = useApiCommunicatorStore((state) => state.conversations);

	const handleClickHistoryEntry = (conversationId: string) => {
		setCurrentlyOpenConversationId(conversationId);
	}

	useEffect(() => {
		fetchConversations()
	}, [fetchConversations])
	
	return (
		<div
			className={'h-screen w-64 border-r border-neutral-300 py-2 bg-gov-light-gray shadow-md'}
		>
			{conversations.map(conversation => (
				<button
					className={classNames(
						'w-full px-4 py-2',
						'mb-2',
						currentlyOpenConversationId === conversation._id ? 'bg-gov-blue text-white':'hover:text-gov-blue'
					)}
					onClick={() => handleClickHistoryEntry(conversation._id)}
				>
					{ conversation._id }
				</button>
			))}
		</div>
	)
}

export default HistorySidebar;
