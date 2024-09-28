import { useApiCommunicatorStore } from '../modules/ApiCommunicator/ApiCommunicatorStore.ts'
import { useEffect } from 'react'
import classNames from 'classnames'

const HistorySidebar = () => {
	const fetchHistories = useApiCommunicatorStore((state) => state.fetchHistories);
	const currentlyOpenConversationId = useApiCommunicatorStore((state) => state.currentlyOpenConversationId);
	const setCurrentlyOpenConversationId = useApiCommunicatorStore((state) => state.setCurrentlyOpenConversationId);
	const histories = useApiCommunicatorStore((state) => state.histories);

	const handleClickHistoryEntry = (conversationId: string) => {
		setCurrentlyOpenConversationId(conversationId);
	}

	useEffect(() => {
		fetchHistories()
	}, [fetchHistories])
	
	return (
		<div
			className={'h-screen w-64 border-r border-neutral-300 py-2 bg-gov-light-gray'}
		>
			{histories.map(historyEntry => (
				<button
					className={classNames(
						'w-full px-4 py-2',
						'mb-2',
						currentlyOpenConversationId === historyEntry.conversationId ? 'bg-gov-blue text-white':'hover:text-gov-blue'
					)}
					onClick={() => handleClickHistoryEntry(historyEntry.conversationId)}
				>
					{ historyEntry.label }
				</button>
			))}
		</div>
	)
}

export default HistorySidebar;
