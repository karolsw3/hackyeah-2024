import classNames from 'classnames';
import type { ConversationMessage } from '../modules/ApiCommunicator/ApiCommunicator.ts'

type ConversationHeaderProps = {
	title: string;
	xml?: string | null;
}

const ConversationMessage = (props: ConversationHeaderProps) => {
	const { title } = props;

	return (
		<div
			className={classNames(
				'w-full px-6 py-3 flex items-center justify-end',
				'border-b border-neutral-200 text-neutral-800',
				'flex items-center justify-between'
			)}
		>
			{ title }
			{props.xml && (
				<a
					className={classNames(
						'bg-gov-blue text-white p-2 rounded-md'
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
