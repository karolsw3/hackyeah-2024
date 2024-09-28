import classNames from 'classnames';
import type { ConversationMessage } from '../modules/ApiCommunicator/ApiCommunicator.ts'

type ConversationMessageProps = ConversationMessage & {
	isMessageFirst: boolean;
	isMessageLast: boolean;
}

const ConversationMessage = (props: ConversationMessageProps) => {
	const {
		message,
		isMessageFirst,
		isMessageLast
	} = props;

	return (
		<div
			className={'w-full px-4 flex items-center justify-end'}
		>
			<div
				className={classNames(
					'inline-flex items-center justify-end bg-blue-500 px-4 py-2 text-white',
					'text-right rounded-l-3xl',
					isMessageFirst && 'rounded-br-sm rounded-tr-3xl',
					isMessageLast && 'rounded-tr-sm rounded-br-3xl mt-1',
					!isMessageFirst && !isMessageLast && 'rounded-tr-sm rounded-br-sm mt-1',
				)}
			>
				{ message } {isMessageFirst}
			</div>
		</div>
	)
}

export default ConversationMessage;
