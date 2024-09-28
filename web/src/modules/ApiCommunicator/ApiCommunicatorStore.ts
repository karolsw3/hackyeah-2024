import { create } from 'zustand'
import type {
	ApiCommunicator,
	IConversation,
	SendMessageProps
} from './ApiCommunicator.ts'
import { ApiCommunicatorMockup } from './ApiCommunicatorMockup.tsx'

type ApiCommunicatorState = {
	currentlyOpenConversationId: string,
	setCurrentlyOpenConversationId: (newConversationId: string) => void;
	conversations: IConversation[];
	fetchConversations: () => Promise<void>;
	sendMessage: (message: string) => Promise<void>;
};

export const apiCommunicator: ApiCommunicator = new ApiCommunicatorMockup();

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
	sendMessage: async (message) => {
		const payload: SendMessageProps = {
			message
		}
	
		if (get().currentlyOpenConversationId) {
			payload.conversationId = get().currentlyOpenConversationId;
		}

		await apiCommunicator.sendMessage(payload)
	}
}))
