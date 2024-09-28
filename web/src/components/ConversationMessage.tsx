import type { ConversationMessage } from '../modules/ApiCommunicator/ApiCommunicator.ts'

const ConversationMessage = (props: ConversationMessage) => {
	const { timestamp, message } = props;
	return (
		<>
			{ message }
			{ timestamp }
		</>
	)
}

export default ConversationMessage;
