export function parseServerMessage(serverMessage: string): string {
	const startOfMessageTag = '<|som|>';
	const endOfMessageTag = '<|eom|>';
	
	// Replace declarations with a markdown 'Download' link
	serverMessage = serverMessage.replace(/<\|sod\|>[\s\S]*?<\|eod\|>/g, '#### [Download](#)');
	
	const startIndex = serverMessage.indexOf(startOfMessageTag);
	if (startIndex === -1) {
		// <|som|> not found, return an empty string
		return '';
	}
	
	const contentStartIndex = startIndex + startOfMessageTag.length;
	const endIndex = serverMessage.indexOf(endOfMessageTag, contentStartIndex);
	
	if (endIndex === -1) {
		// <|eom|> not found, extract till the end
		return serverMessage.substring(contentStartIndex);
	} else {
		// Extract content between <|som|> and <|eom|>
		return serverMessage.substring(contentStartIndex, endIndex);
	}
}
