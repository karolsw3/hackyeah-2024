import classNames from 'classnames';
import { useEffect, useState } from 'react';
import { LuClipboardEdit } from 'react-icons/lu';
import { FiDownloadCloud } from "react-icons/fi";

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
				'w-full pl-6 pr-4 py-3 flex items-center justify-end',
				'border-b border-neutral-200 text-neutral-800',
				'flex items-center justify-between h-16 z-20 bg-white'
			)}
		>
			<div className='flex items-center gap-2'>
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
				<LuClipboardEdit size={16} className='text-neutral-400' />
			</div>
			{props.xml && (
				<a
					className={classNames(
						'hover:bg-gov-light-gray text-neutral-800 px-4 py-2',
						'rounded-md border border-neutral-200',
						'flex items-center justify-center space-x-2',
						'hover:underline'
					)}
					href={`data:text/xml;charset=utf-8,${encodeURIComponent(props.xml)}`}
				>
					<span>
						Eksportuj plik XML
					</span>
					<FiDownloadCloud />
				</a>
			)}
		</div>
	)
}

export default ConversationMessage;
