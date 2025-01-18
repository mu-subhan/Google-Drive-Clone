'use client';

import { useCallback, useState } from 'react';
import { useDropzone } from 'react-dropzone';
import { Button } from './ui/button';
import { cn, convertFileToUrl, getFileType } from '@/lib/utils';
import Image from 'next/image';
import Thumbnail from './Thumbnail';

interface Props {
  ownerId: string;
  accountId: string;
  className?: string;
}

const FileUploader = ({ ownerId, accountId, className }: Props) => {
  // Initialize files as an empty array
  const [files, setFiles] = useState<File[]>([]);

  const onDrop = useCallback(
    async (acceptedFiles: File[]) => {
      console.log('Accepted files:', acceptedFiles); // Debugging line to check the files
      setFiles(acceptedFiles); // Update the state with dropped files
    },
    []
  );

  const { getRootProps, getInputProps, isDragActive } = useDropzone({ onDrop });

  // Debugging line to check the length of files
  console.log('Files length:', files.length);

const handleRemoveFile = (e:React.MouseEvent<HTMLImageElement,MouseEvent>,fileName:string)=>{
  e.stopPropagation();
  setFiles((prevFiles) =>prevFiles.filter((file) =>file.name !== fileName))
}


  return (
    <div {...getRootProps()} className="cursor-pointer">
      <input {...getInputProps()} />
      <Button type="button" className={cn('uploader-button', className)}>
        <Image
          src="/assets/icons/upload.svg"
          alt="upload"
          width={24}
          height={24}
        />
        <p>Upload</p>
      </Button>
      {files.length > 0 && (
        <ul className="uploader-preview-list">
          <h4 className="h4 test-light-100">Uploading</h4>

          {files.map((file, index) => {
            const { type, extension } = getFileType(file.name);
            return (
              <li key={`${file.name}-${index}`} className="uploader-preview-item">
                {/* You can render file info here */}
               <Thumbnail
               type ={type}
               extension={extension}
               url={convertFileToUrl(file)}
               imageClassName="thumbnail-image" 
               className={className || "default-thumbnail-class"} 
             />
             <div className="preview-item-name">
        {file.name}
        <Image 
        src='/assets/icons/file-loader.gif'
        alt='loader'
        width={80}
        height={26}
        />
      </div>

<Image src='/assets/icons/remove.svg'
alt='remove' width={24} height={24} onClick={(e) =>handleRemoveFile(e,file.name)}
/>
              </li>
            );
          })}
        </ul>
      )}
      {isDragActive ? (
        <p>Drop the files here ...</p>
      ) : (
        <p>Drag 'n' drop some files here, or click to select files</p>
      )}
    </div>
  );
};

export default FileUploader;
