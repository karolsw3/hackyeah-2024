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

export enum IMessageRole {
	USER = "USER",
	COMPLETION = "COMPLETION",
}

export type IMessage = {
	text: string;
	role: IMessageRole;
	timestamp: number;
};

export type IConversation = {
	_id: string;
	messages: IMessage[];
	userId: string;
};

export type GetConversationsResponse = {
	conversations: IConversation[];
};

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
	sendMessage: (props: SendMessageProps) => Promise<SendMessageResponse>;
	getConversations: () => Promise<GetConversationsResponse>;
	createConversation: () => Promise<IConversation>;
	/* Users */
	createUser: () => Promise<void>;
}
