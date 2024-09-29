import { create } from 'zustand'
import { produce } from 'immer'
import {
	ApiCommunicator,
	IConversation,
	MessageRole,
	SendMessageProps,
	UpdateConversationParams
} from './ApiCommunicator.ts'
import { ApiCommunicatorReal } from './ApiCommunicatorReal.tsx';
import { fileToBase64URL } from '../../helpers/fileToBase64URL.ts'
import { base64URLtoBase64 } from '../../helpers/base64URLtoBase64.ts'

type ApiCommunicatorState = {
	currentlyOpenConversationId: string,
	setCurrentlyOpenConversationId: (newConversationId: string) => void;
	conversations: IConversation[];
	fetchConversations: () => Promise<void>;
	sendMessage: (message: string, file?: File) => Promise<void>;
	createUser: () => Promise<void>;
	createConversation: () => Promise<void>;
	updateConversation: (params: UpdateConversationParams) => Promise<void>;
};

export const apiCommunicator: ApiCommunicator = new ApiCommunicatorReal();

export const useApiCommunicatorStore = create<ApiCommunicatorState>((set, get) => ({
	currentlyOpenConversationId: '',
	setCurrentlyOpenConversationId: (newConversationId: string) => {
		set({ currentlyOpenConversationId: newConversationId })
	},
	conversations: [],
	fetchConversations: async () => {
		const { conversations } = await apiCommunicator.getConversations();
		set({ conversations })
		if (get().currentlyOpenConversationId === '' && conversations.length > 0) {
			set({
				currentlyOpenConversationId: conversations[0]._id
			})
		}
	},
	sendMessage: async (message, file) => {
		/* Add new message to store */
		const currentlyOpenConversationId = get().currentlyOpenConversationId;
		const conversations = get().conversations;
		const currentConversationIndex = conversations.findIndex(conversation => conversation._id === currentlyOpenConversationId);
		if (currentConversationIndex < 0) {
			console.warn('Attempted to push to a non-existent conversation.')
			return;
		}
		set(produce((state: ApiCommunicatorState) => {
			state.conversations[currentConversationIndex].messages.push({
				timestamp: new Date().getTime(),
				text: message,
				role: MessageRole.USER
			})
		}))

		/* Send new message to API */
		const payload: SendMessageProps = {
			message
		}
		
		if (file) {
			const base64URL = await fileToBase64URL(file);
			payload.fileData = base64URLtoBase64(base64URL);
			payload.mimeType = file.type;
		}
	
		if (get().currentlyOpenConversationId) {
			payload.conversationId = get().currentlyOpenConversationId;
		}

		const response = await fetch("https://hackyeah-2024.onrender.com/messages", {
			method: 'POST',
			signal: AbortSignal.timeout(30000),
			credentials: 'include',
			body: JSON.stringify(payload),
			headers: {
				'Content-Type': 'application/json'
			}
		});
		
		const reader = response.body?.getReader();

		let processedMessage = '';
		let newMessageIndex = -1;
		if (reader) {
			while (true) {
				const { done, value } = await reader.read();
				if (done) break;
				processedMessage += new TextDecoder().decode(value);
				set(produce((state: ApiCommunicatorState) => {
					const conversationIndex = state.conversations.findIndex(conversation => conversation._id === payload.conversationId);
					if (conversationIndex < 0) {
						console.warn('Attempted to push to a non-existent conversation.')
						return;
					}
					if (newMessageIndex >= 0) {
						state.conversations[conversationIndex].messages[newMessageIndex].text = processedMessage;
					} else {
						state.conversations[conversationIndex].messages.push({
							timestamp: new Date().getTime(),
							text: processedMessage,
							role: MessageRole.COMPLETION
						})
						newMessageIndex = state.conversations[conversationIndex].messages.length - 1;
					}
				}));
			}
		}
	},
	createUser: async () => {
		await apiCommunicator.createUser();
	},
	createConversation: async () => {
		const conversation = await apiCommunicator.createConversation();
		set(produce((state: ApiCommunicatorState) => {
			state.conversations.unshift(conversation)
			state.currentlyOpenConversationId = conversation._id
		}))
	},
	updateConversation: async (params: UpdateConversationParams) => {
		const conversation = await apiCommunicator.updateConversation(params);
		set(produce((state: ApiCommunicatorState) => {
			const conversationIndex = state.conversations.findIndex(conversation => conversation._id === params.conversationId);
			if (conversationIndex < 0) {
				console.warn('Attempted to update a non-existent conversation.')
				return;
			}
			state.conversations[conversationIndex] = conversation;
		}))
	}
}))
