import { create } from 'zustand'
import type { ApiCommunicator, ConversationMessage, SendMessageProps } from './ApiCommunicator.ts'
import { ApiCommunicatorMockup } from './ApiCommunicatorMockup.tsx'

type ApiCommunicatorState = {
	currentlyOpenConversationId: string,
	messages: ConversationMessage[];
	fetchMessages: (conversationId?: string) => Promise<void>
	sendMessage: (message: string) => Promise<void>
};

export const apiCommunicator: ApiCommunicator = new ApiCommunicatorMockup();

export const useApiCommunicatorStore = create<ApiCommunicatorState>((set, get) => ({
	currentlyOpenConversationId: '',
	messages: [],
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
