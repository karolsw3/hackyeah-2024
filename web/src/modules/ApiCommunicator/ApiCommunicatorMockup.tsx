import {
	EndConversationResponse, GetConversationHistoryResponse,
	GetHistoriesResponse,
	ApiCommunicator,
	SendMessageProps,
	SendMessageResponse
} from './ApiCommunicator.ts'

const mockupSendMessageResponse: SendMessageResponse = {
	conversationId: 'randomId',
	message: 'Random message which you should display.'
}

const mockupEndConversationResponse: EndConversationResponse = {
	xmlString: '<xml></xml>',
	xmlDownloadURL: 'https://google.com'
}

const mockupGetHistoriesResponse: GetHistoriesResponse = [{
	label: 'Test',
	conversationId: 'randomId'
}];

const mockupGetConversationHistory: GetConversationHistoryResponse = {
	messages: [
		{
			timestamp: 0,
			message: 'test'
		}
	]
};

export class ApiCommunicatorMockup implements ApiCommunicator {
	sendMessage = (props: SendMessageProps) => {
		console.log(props)
		return mockupSendMessageResponse;
	}

	endConversation = () => {
		return mockupEndConversationResponse;
	}

	getHistories = (sessionId: string) => {
		console.log(sessionId)
		return mockupGetHistoriesResponse;
	}

	getConversationHistory = (conversationId: string) => {
		console.log(conversationId)
		return mockupGetConversationHistory;
	}
}
