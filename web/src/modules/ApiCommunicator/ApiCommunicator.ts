export type SendMessageResponse = {
	conversationId?: string;
	message: string;
};

export type EndConversationResponse = {
	xmlString: string;
	xmlDownloadURL: string;
};

export type GetHistoriesResponse = {
	label: string;
	conversationId: string;
}[];

export type ConversationMessage = {
	timestamp: number;
	message: string;
}

export type GetConversationHistoryResponse = {
	messages: ConversationMessage[];
}

export type SendMessageProps = {
	message: string;
	conversationId?: string;
	xmlString?: string;
	// TODO: Fix file upload type
	file?: unknown;
}

export interface ApiCommunicator {
	/* Conversations */
	sendMessage: (props: SendMessageProps) => SendMessageResponse;
	endConversation: () => EndConversationResponse;
	
	/* History */
	getHistories: (sessionId: string) => GetHistoriesResponse;
	getConversationHistory: (conversationId: string) => GetConversationHistoryResponse;
}
