import { useApiCommunicatorStore } from '../modules/ApiCommunicator/ApiCommunicatorStore.ts'
import { useEffect } from 'react'
import classNames from 'classnames'

const HistorySidebar = () => {
	const fetchHistories = useApiCommunicatorStore((state) => state.fetchHistories);
	const currentlyOpenConversationId = useApiCommunicatorStore((state) => state.currentlyOpenConversationId);
	const setCurrentlyOpenConversationId = useApiCommunicatorStore((state) => state.setCurrentlyOpenConversationId);
	const histories = useApiCommunicatorStore((state) => state.histories);
	
	useEffect(() => {
		fetchHistories()
	}, [fetchHistories])
	
	return (
		<div
			className={'h-screen w-64 border-r border-neutral-300 px-2 py-2'}
		>
			{histories.map(historyEntry => (
				<button
					className={classNames(
						'w-full px-4 py-2 border border-gray-200 rounded-lg',
						'mb-5',
						currentlyOpenConversationId === historyEntry.conversationId && 'bg-neutral-200'
					)}
					onChange={() => setCurrentlyOpenConversationId(historyEntry.conversationId)}
				>
					{ historyEntry.label }
				</button>
			))}
		</div>
	)
}

export default HistorySidebar;
