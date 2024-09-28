import { create } from 'zustand'
import type { ApiCommunicator, ConversationMessage, GetHistoriesResponse, SendMessageProps } from './ApiCommunicator.ts'
import { ApiCommunicatorMockup } from './ApiCommunicatorMockup.tsx'

type ApiCommunicatorState = {
	currentlyOpenConversationId: string,
	setCurrentlyOpenConversationId: (newConversationId: string) => void;
	histories: GetHistoriesResponse;
	messages: ConversationMessage[];
	fetchMessages: (conversationId?: string) => Promise<void>;
	fetchHistories: () => Promise<void>;
	sendMessage: (message: string) => Promise<void>;
};

export const apiCommunicator: ApiCommunicator = new ApiCommunicatorMockup();

export const useApiCommunicatorStore = create<ApiCommunicatorState>((set, get) => ({
	currentlyOpenConversationId: '',
	setCurrentlyOpenConversationId: (newConversationId: string) => {
		set({ currentlyOpenConversationId: newConversationId })
	},
	histories: [],
	messages: [],
	fetchHistories: async () => {
		const sessionId = 'sessionId'
		const response = await apiCommunicator.getHistories(sessionId);
		set({
			histories: response
		})
		if (get().currentlyOpenConversationId === '' && response.length > 0) {
			set({
				currentlyOpenConversationId: response[0].conversationId
			})
		}
	},
	fetchMessages: async (conversationId?: string) => {
		const currentlyOpenConversationId = get().currentlyOpenConversationId;
		const { messages } = await apiCommunicator.getConversationHistory(conversationId ?? currentlyOpenConversationId)
		set({ messages })
	},
	sendMessage: async (message) => {
		const payload: SendMessageProps = {
			message
		}
	
		if (get().currentlyOpenConversationId) {
			payload.conversationId = get().currentlyOpenConversationId;
		}

		await apiCommunicator.sendMessage(payload)
		const newConversationMessage: ConversationMessage = {
			message,
			timestamp: new Date().getTime(),
		}
		set({
			messages: [
				...get().messages,
				newConversationMessage
			]
		})
	}
}))
