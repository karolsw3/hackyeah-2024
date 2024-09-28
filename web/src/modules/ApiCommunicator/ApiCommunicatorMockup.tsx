import {
	ApiCommunicator,
	GetConversationsResponse, IConversation,
	MessageRole,
	SendMessageProps,
} from './ApiCommunicator.ts'

const mockupCreateConversationResponse: IConversation = {
	_id: 'fadsf',
	messages: [],
	userId: 'jadsfk'
}

const mockupGetConversationsResponse: GetConversationsResponse = {
	conversations: [
		{
			_id: 'dupa',
			messages: [
				{
					text: 'fajsdlf',
					role: MessageRole.COMPLETION,
					timestamp: 0,
				},
				{
					text: 'kfasjldf',
					role: MessageRole.USER,
					timestamp: 1000,
				}
			],
			userId: 'slfkjalkdfj'
		}
	]
};

export class ApiCommunicatorMockup implements ApiCommunicator {
	sendMessage = async (props: SendMessageProps) => {
		console.log(props)
		return;
	}

	createUser = async () => {
		return;
	}

	createConversation = async () => {
		return mockupCreateConversationResponse;
	}

	getConversations = async () => {
		return mockupGetConversationsResponse;
	}
}
