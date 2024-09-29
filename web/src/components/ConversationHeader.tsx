import classNames from 'classnames';
import type { ConversationMessage } from '../modules/ApiCommunicator/ApiCommunicator.ts'
import { useEffect, useState } from 'react';
import { LuClipboardEdit } from 'react-icons/lu';

type ConversationHeaderProps = {
	title: string;
	xml?: string | null;
	onTitleChange?: (newTitle: string) => void;
	isTitleChangeDisabled?: boolean;
}

const ConversationMessage = (props: ConversationHeaderProps) => {
	const [title, setTitle] = useState(props.title);

	useEffect(() => {
		setTitle(props.title)
	}, [props.title])

	return (
		<div
			className={classNames(
				'w-full px-6 py-3 flex items-center justify-end',
				'border-b border-neutral-200 text-neutral-800',
				'flex items-center justify-between h-16'
			)}
		>
			<div className='flex items-center gap-1'>
				<LuClipboardEdit size={16} className='text-neutral-600' />
				<span 
					role="textbox" 
					contentEditable
					onBlur={(e) => {
						setTitle(e.currentTarget.innerText)
						if (props.onTitleChange && e.currentTarget.innerText !== props.title) {
							props.onTitleChange(e.currentTarget.innerText)
						}
					}}
					className={classNames(
						'px-1 py-0.5 rounded-md duration-150',
						props.isTitleChangeDisabled && 'opacity-50 pointer-events-none'
					)}
					suppressContentEditableWarning
				>
					{title}
				</span>
			</div>
			{props.xml && (
				<a
					className={classNames(
						'bg-gov-blue text-white px-4 py-2 rounded-md'
					)}
					href={`data:text/xml;charset=utf-8,${encodeURIComponent(props.xml)}`}
				>
					Eksportuj plik XML
				</a>
			)}
		</div>
	)
}

export default ConversationMessage;
