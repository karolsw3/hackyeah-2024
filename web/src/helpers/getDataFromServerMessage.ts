import { DATA_START_TAG, DATA_END_TAG } from '../../../constants';

export function getDataFromServerMessage(serverMessage: string) {
	const startIndex = serverMessage.indexOf(DATA_END_TAG);
	if (startIndex === -1) {
		// tag not found, return an empty string
		return null;
	}
	
	const contentStartIndex = startIndex + DATA_START_TAG.length;
	const endIndex = serverMessage.indexOf(DATA_END_TAG, contentStartIndex);
	
	if (endIndex === -1) {
		// tag not found, extract till the end
		return serverMessage.substring(contentStartIndex);
	} else {
		// Extract content between tag and tag
		return serverMessage.substring(contentStartIndex, endIndex);
	}
}
