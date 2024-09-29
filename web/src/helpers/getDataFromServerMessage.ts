import { DATA_START_TAG, DATA_END_TAG } from '../../../constants';

export function getDataFromServerMessage(serverMessage: string): string {
	const startIndex = serverMessage.indexOf(DATA_END_TAG);
	if (startIndex === -1) {
		// <|som|> not found, return an empty string
		return '';
	}
	
	const contentStartIndex = startIndex + DATA_START_TAG.length;
	const endIndex = serverMessage.indexOf(DATA_END_TAG, contentStartIndex);
	
	if (endIndex === -1) {
		// <|eom|> not found, extract till the end
		return serverMessage.substring(contentStartIndex);
	} else {
		// Extract content between <|som|> and <|eom|>
		return serverMessage.substring(contentStartIndex, endIndex);
	}
}
