import { AxiosResponse } from "axios";

export enum MessageRole {
	USER = "USER",
	COMPLETION = "COMPLETION",
}

export type IMessage = {
	text: string;
	role: MessageRole;
	timestamp: number;
};

export type IConversation = {
	_id: string;
	label?: string;
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

export type SendMessageProps = {
	message: string;
	conversationId?: string;
	xmlString?: string;
	fileData?: string;
	mimeType?: string;
}

export type UpdateConversationParams = {
	conversationId: string;
	label: string;
}

export interface ApiCommunicator {
	/* Conversations */
	sendMessage: (props: SendMessageProps) => Promise<AxiosResponse>;
	getConversations: () => Promise<GetConversationsResponse>;
	createConversation: () => Promise<IConversation>;
	updateConversation: (params: UpdateConversationParams) => Promise<IConversation>;
	/* Users */
	createUser: () => Promise<void>;
}
