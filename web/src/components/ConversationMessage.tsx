import classNames from 'classnames'
import { IMessage, MessageRole } from '../modules/ApiCommunicator/ApiCommunicator.ts'
import { useMemo } from 'react'
import { timestampToHHMM } from '../helpers/timestampToHHMM.ts'
import { parseServerMessage } from '../helpers/parseServerMessage.ts'
import ReactMarkdown from 'react-markdown'

type ConversationMessageProps = IMessage

const ConversationMessage = (props: ConversationMessageProps) => {
	const {
		text,
		role,
		timestamp
	} = props;
	
	const dateFromTimestamp = useMemo(() => {
		return timestampToHHMM(timestamp)
	}, [timestamp])

	const isUser = role === MessageRole.USER;
	
	const messageText = useMemo(() => {
		if (isUser) return text;
		return parseServerMessage(text);
	}, [text, isUser])

	return (
		<div
			className={classNames(
				'w-full px-4 flex items-center group justify-end gap-3',
				!isUser && 'flex-row-reverse',
			)}
		>
			<div
				className={classNames(
					'text-sm text-neutral-400 group-hover:opacity-100',
					'opacity-0 duration-75'
				)}
			>
				{ dateFromTimestamp }
			</div>
			<div
				className={classNames(
					isUser ? 'bg-gov-blue text-white' : 'bg-gov-light-gray text-neutral-800',
					'px-4 py-2 rounded-3xl text-left',
					'duration-150 sm:max-w-2xl max-w-[90%]'
				)}
			>
				<ReactMarkdown>
					{ messageText }
				</ReactMarkdown>
			</div>
		</div>
	)
}

export default ConversationMessage;
