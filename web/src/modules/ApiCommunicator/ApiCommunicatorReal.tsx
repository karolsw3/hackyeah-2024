import { AxiosResponse } from 'axios';
import { coreClient } from '../../helpers/coreClient.ts';
import {
	ApiCommunicator,
	GetConversationsResponse,
	IConversation,
	SendMessageProps,
	UpdateConversationParams,
} from './ApiCommunicator.ts'

export class ApiCommunicatorReal implements ApiCommunicator {
	sendMessage = async (props: SendMessageProps) => {
		const response = await coreClient.post('/messages', props, {
			responseType: 'stream'
		});
		return response.data
	}

	createUser = async () => {
		await coreClient.post('/users');
	}

	createConversation = async () => {
		const conversation = await coreClient.post<null, AxiosResponse<IConversation>>('/conversations');
		return conversation.data;
	}

	getConversations = async () => {
		const conversations = await coreClient.get<null, AxiosResponse<GetConversationsResponse>>('/conversations');
		return conversations.data;
	}

	updateConversation = async (params: UpdateConversationParams) => {
		const conversation = await coreClient.post<UpdateConversationParams, AxiosResponse<IConversation>>(`/conversations/${params.conversationId}`, params);
		return conversation.data;
	}
}
