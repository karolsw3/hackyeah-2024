import { useApiCommunicatorStore } from '../modules/ApiCommunicator/ApiCommunicatorStore.ts'
import { useEffect, useState } from 'react'
import classNames from 'classnames'

const HistorySidebar = () => {
	const [isSidebarOpen, setIsSidebarOpen] = useState(true);

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
			className={'relative'}
		>
			<button
				aria-checked={isSidebarOpen}
				aria-label={'Open/Close Sidebar'}
				onClick={() => setIsSidebarOpen(!isSidebarOpen)}
				className={classNames(
					'absolute top-0 right-0 -mr-4 mt-[8px]',
					'w-8 h-8 bg-white z-20 shadow-xs',
					'border border-neutral-300 rounded-full',
					'flex items-center justify-center',
					'hover:bg-gov-light-gray duration-75 active:bg-neutral-300'
				)}
			>
				{ isSidebarOpen ? '>':'<' }
			</button>
			<div
				className={classNames(
					'relative overflow-hidden transition-all duration-100',
					isSidebarOpen ? 'w-10' : 'w-64'
				)}
			>
				<div
					className={classNames(
						'h-screen w-64 border-r border-neutral-300',
						'bg-gov-light-gray shadow-md overflow-hidden',
						'relative',
					)}
				>
					<div
						className={classNames(
							'w-full px-4 py-3 flex items-center justify-end',
							'border-b border-neutral-200 text-neutral-800',
							'flex items-center justify-center mb-5'
						)}
					>
						<b>TaxBot AI</b>
					</div>
					{conversations.map(conversation => (
						<button
							className={classNames(
								'w-full px-4 py-2',
								'mb-2',
								currentlyOpenConversationId === conversation._id ? 'bg-gov-blue text-white' : 'hover:text-gov-blue'
							)}
							onClick={() => handleClickHistoryEntry(conversation._id)}
						>
							{ conversation._id }
						</button>
					))}
				</div>
			</div>
		</div>
	)
}

export default HistorySidebar;
