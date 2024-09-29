export async function fileToBase64(file: File): Promise<string> {
	const reader = new FileReader();
	
	return new Promise<string>((resolve, reject) => {
		reader.onload = () => {
			const base64String = reader.result as string;
			resolve(base64String);
		};
		
		reader.onerror = (error) => {
			reject(error);
		};
		
		reader.readAsDataURL(file);
	});
}
