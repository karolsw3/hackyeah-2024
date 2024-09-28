import classNames from 'classnames'
import { IMessage, MessageRole } from '../modules/ApiCommunicator/ApiCommunicator.ts'
import { useMemo } from 'react'
import { timestampToHHMM } from '../helpers/timestampToHHMM.ts'

type ConversationMessageProps = IMessage & {
	isMessageFirst: boolean;
	isMessageLast: boolean;
}

const ConversationMessage = (props: ConversationMessageProps) => {
	const {
		text,
		role,
		timestamp,
		isMessageFirst,
		isMessageLast
	} = props;
	
	const dateFromTimestamp = useMemo(() => {
		return timestampToHHMM(timestamp)
	}, [timestamp])

	const isUser = role === MessageRole.USER;

	return (
		<div
			className={classNames(
				'w-full px-4 flex items-center group',
				isUser ? 'justify-end':'justify-start'
			)}
		>
			<div
				className={classNames(
					'text-sm text-neutral-400 group-hover:opacity-100',
					'opacity-0 duration-75 mr-2 -mb-1'
				)}
			>
				{ dateFromTimestamp }
			</div>
			<div
				className={classNames(
					isUser ? 'bg-gov-blue text-white' : 'bg-gov-light-gray text-neutral-800',
					'inline-flex items-center justify-end px-4 py-2',
					isUser ? 'text-right' : 'text-left', // Adjust text alignment based on role
					isUser ? 'rounded-l-3xl' : 'rounded-r-3xl', // Control the border rounding depending on role
					isMessageFirst && isMessageLast && 'rounded-3xl',
					isMessageFirst && !isMessageLast && (isUser ? 'rounded-br-sm rounded-tr-3xl' : 'rounded-bl-sm rounded-tl-3xl'),
					isMessageLast && !isMessageFirst && (isUser ? 'rounded-tr-sm rounded-br-3xl mt-1' : 'rounded-tl-sm rounded-bl-3xl mt-1'),
					!isMessageFirst && !isMessageLast && (isUser ? 'rounded-tr-sm rounded-br-sm mt-1' : 'rounded-tl-sm rounded-bl-sm mt-1'),
					'duration-150'
				)}
			>
				{ text }
			</div>
		</div>
	)
}

export default ConversationMessage;
