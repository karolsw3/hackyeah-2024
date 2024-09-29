import React, { useRef } from 'react';
import { FiPaperclip } from 'react-icons/fi'
import classNames from 'classnames'

interface FileUploaderProps {
	onFileSelected: (file: File) => void;
}

export const FileUploadButton: React.FC<FileUploaderProps> = ({ onFileSelected }) => {
	const hiddenFileInput = useRef<HTMLInputElement>(null);
	
	const handleClick = () => {
		hiddenFileInput.current?.click();
	};
	
	const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
		const fileUploaded = event.target.files?.[0];
		if (fileUploaded) {
			onFileSelected(fileUploaded);
		}
	};
	
	return (
		<>
			<button
				aria-label={'Upload file'}
				className={classNames(
					'absolute right-0 mr-2 w-8 h-8 rounded-full',
					'inline-flex items-center text-xl justify-center text-neutral-500',
					'active:opacity-50 duration-75'
				)}
				onClick={handleClick}
			>
				<FiPaperclip/>
			</button>
			<input
				type="file"
				ref={hiddenFileInput}
				onChange={handleChange}
				style={{ display: 'none' }}
			/>
		</>
	);
};
