import { useApiCommunicatorStore } from '../modules/ApiCommunicator/ApiCommunicatorStore.ts'
import { useEffect, useState } from 'react'
import classNames from 'classnames'
import { FiChevronRight, FiChevronLeft } from "react-icons/fi";
import { useTranslation } from 'react-i18next'
import "/node_modules/flag-icons/css/flag-icons.min.css";

const HistorySidebar = () => {
	const { t, i18n } = useTranslation();
	const [isSidebarOpen, setIsSidebarOpen] = useState(true);

	const createNewConversation = useApiCommunicatorStore((state) => state.createConversation)
	const fetchConversations = useApiCommunicatorStore((state) => state.fetchConversations);
	const currentlyOpenConversationId = useApiCommunicatorStore((state) => state.currentlyOpenConversationId);
	const setCurrentlyOpenConversationId = useApiCommunicatorStore((state) => state.setCurrentlyOpenConversationId);
	const conversations = useApiCommunicatorStore((state) => state.conversations);

	const handleClickHistoryEntry = (conversationId: string) => {
		setCurrentlyOpenConversationId(conversationId);
	}

	const handleChangeLanguage = (newLanguage: string) => {
		i18n.changeLanguage(newLanguage);
	}

	useEffect(() => {
		fetchConversations()
	}, [fetchConversations])
	
	return (
		<div
			className={'hidden sm:flex relative'}
		>
			<button
				aria-checked={isSidebarOpen}
				aria-label={'Open/Close Sidebar'}
				onClick={() => setIsSidebarOpen(!isSidebarOpen)}
				className={classNames(
					'absolute top-0 right-0 -mr-4 mt-[16px]',
					'w-8 h-8 bg-white shadow-xs z-30',
					'border border-neutral-300 rounded-full',
					'flex items-center justify-center',
					'hover:bg-gov-light-gray duration-75 active:bg-neutral-300'
				)}
			>
				{ isSidebarOpen ? <FiChevronLeft />:<FiChevronRight /> }
			</button>
			<div
				className={classNames(
					'relative overflow-hidden transition-all duration-100',
					isSidebarOpen ? 'w-64' : 'w-10'
				)}
			>
				<div
					className={classNames(
						'h-screen w-64 border-r border-neutral-300',
						'bg-gov-light-gray shadow-md overflow-hidden',
						'flex flex-col',
						'relative',
					)}
				>
					<div
						className={classNames(
							'w-full h-[64px] px-4 py-3 flex items-center justify-end',
							'border-b border-neutral-300 text-neutral-800',
							'flex items-center justify-center mb-5'
						)}
					>
						<img
							src={'/icon.png'}
							className={'w-6 mr-2'}
							alt={'TaxBot AI logo'}
						/>
						<a
							href={'/'}
							className={'text-lg hover:underline'}
						>
							<b>
								TaxBot AI
							</b>
						</a>
					</div>
					{ conversations.map(conversation => (
						<button
							className={classNames(
								'w-full px-4 py-2',
								'mb-2',
								currentlyOpenConversationId === conversation._id ? 'bg-gov-blue text-white' : 'hover:text-gov-blue'
							)}
							onClick={() => handleClickHistoryEntry(conversation._id)}
						>
							{conversation.label || t("Konwersacja") + " #" + conversation._id.slice(-3)}
						</button>
					))}
					<div
						className={'px-3'}
					>
						<button
							onClick={createNewConversation}
							className={classNames(
								'mt-3 w-full py-2 px-4 border-2 border-gov-blue rounded',
								'text-gov-blue font-bold hover:bg-gov-light-blue hover:border-gov-light-blue hover:text-white'
							)}
						>
							{t("Nowa konwersacja")}
						</button>
					</div>
					<div
						className={ 'mt-auto w-full p-3 mb-6 flex flex-col space-y-4 items-start' }
					>
						<div
							className={ 'w-3/4 h-px bg-neutral-300 mb-2' }
						/>
						<button
							onClick={ () => handleChangeLanguage('pl') }
							className={ 'px-1 hover:text-gov-light-blue text-sm' }
						>
							<span className="fi fi-pl mr-1"></span>
							Polski
						</button>
						<button
							onClick={ () => handleChangeLanguage('en') }
							className={ 'px-1 hover:text-gov-light-blue text-sm' }
						>
							<span className="fi fi-gb mr-1"></span>
							English
						</button>
						<button
							onClick={ () => handleChangeLanguage('ua') }
							className={ 'px-1 hover:text-gov-light-blue text-sm' }
						>
							<span className="fi fi-ua mr-1"></span>
							Українська
						</button>
					</div>
				</div>
			</div>
		</div>
	)
}

export default HistorySidebar;
