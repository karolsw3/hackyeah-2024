import {
	EndConversationResponse, GetConversationHistoryResponse,
	GetHistoriesResponse,
	ApiCommunicator,
	SendMessageProps,
	SendMessageResponse
} from './ApiCommunicator.ts'

const mockupSendMessageResponse: SendMessageResponse = {
	conversationId: 'adfss',
	message: 'asdjfskd'
}

const mockupEndConversationResponse: EndConversationResponse = {
	xmlString: '',
	xmlDownloadURL: ''
}

const mockupGetHistoriesResponse: GetHistoriesResponse = [{
	label: '',
	conversationId: ''
}];

const mockupGetConversationHistory: GetConversationHistoryResponse = {
	messages: [
		{
			timestamp: 0,
			message: ''
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
