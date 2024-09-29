export function base64URLtoBase64 (base64Url: string): string {
	return base64Url.split(',')[1];
}
