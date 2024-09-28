import classNames from 'classnames';
import type { ConversationMessage, IMessage } from '../modules/ApiCommunicator/ApiCommunicator.ts'
import { useMemo } from 'react'
import { timestampToHHMM } from '../helpers/timestampToHHMM.ts'

type ConversationMessageProps = IMessage & {
	isMessageFirst: boolean;
	isMessageLast: boolean;
}

const ConversationMessage = (props: ConversationMessageProps) => {
	const {
		text,
		timestamp,
		isMessageFirst,
		isMessageLast
	} = props;
	
	const dateFromTimestamp = useMemo(() => {
		return timestampToHHMM(timestamp)
	}, [timestamp])

	return (
		<div
			className={'w-full px-4 flex items-center justify-end group'}
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
					'inline-flex items-center justify-end bg-gov-blue px-4 py-2 text-white',
					'text-right rounded-l-3xl',
					isMessageFirst && isMessageLast && 'rounded-3xl',
					isMessageFirst && !isMessageLast && 'rounded-br-sm rounded-tr-3xl',
					isMessageLast && !isMessageFirst && 'rounded-tr-sm rounded-br-3xl mt-1',
					!isMessageFirst && !isMessageLast && 'rounded-tr-sm rounded-br-sm mt-1',
				)}
			>
				{ text }
			</div>
		</div>
	)
}

export default ConversationMessage;
