import classNames from 'classnames';
import type { ConversationMessage } from '../modules/ApiCommunicator/ApiCommunicator.ts'

type ConversationHeaderProps = {
	title: string;
}

const ConversationMessage = (props: ConversationHeaderProps) => {
	const { title } = props;

	return (
		<div
			className={classNames(
				'w-full px-4 py-3 flex items-center justify-end',
				'border-b border-neutral-200 text-neutral-800',
				'flex items-center justify-center'
			)}
		>
			{ title }
		</div>
	)
}

export default ConversationMessage;
