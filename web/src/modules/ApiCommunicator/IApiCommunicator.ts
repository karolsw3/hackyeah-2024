type SendMessageResponse = {
	conversationId?: string;
	message: string;
};

type EndConversationResponse = {
	xmlString: string;
	xmlDownloadURL: string;
};

type GetHistoriesResponse = {
	label: string;
	conversationId: string;
}[];

type ConversationMessage = {
	timestamp: number;
	message: string;
}

type GetConversationHistoryResponse = {
	messages: ConversationMessage[];
}

type SendMessageProps = {
	message: string;
	conversationId?: string;
	xmlString: string;
	// TODO: Fix file upload type
	file: unknown;
}

interface IApiCommunicator {
	/* Conversations */
	sendMessage: (props: SendMessageProps) => SendMessageResponse;
	endConversation: () => EndConversationResponse;
	
	/* History */
	getHistories: (sessionId: string) => GetHistoriesResponse;
	getConversationHistory: (conversationId: string) => GetConversationHistoryResponse;
}
