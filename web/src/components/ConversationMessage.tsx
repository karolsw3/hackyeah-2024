import classNames from 'classnames';
import type { ConversationMessage } from '../modules/ApiCommunicator/ApiCommunicator.ts'

const ConversationMessage = (props: ConversationMessage) => {
	const { timestamp, message } = props;
	return (
		<div
			className={'w-full pt-1 px-4 flex items-center justify-end'}
		>
			<div
				className={classNames(
					'inline-flex items-center justify-end bg-blue-500 rounded-full px-4 py-2 text-white',
					'text-right'
				)}
			>
				{ message }
			</div>
		</div>
	)
}

export default ConversationMessage;
