'use client';

import { useCallback, useState } from 'react';
import { useDropzone } from 'react-dropzone';
import { Button } from './ui/button';
import { cn, convertFileToUrl, getFileType } from '@/lib/utils';
import Image from 'next/image';
import Thumbnail from './Thumbnail';
import { useToast } from '@/hooks/use-toast';
import { MAX_FILE_SIZE } from '@/constants';
import { usePathname } from 'next/navigation';
import { uploadFile } from '@/lib/actions/file.actions';

interface Props {
  ownerId: string;
  accountId: string;
  className?: string;
}

const FileUploader = ({ ownerId, accountId, className }: Props) => {


  const path = usePathname();
  const {toast} = useToast();
  const [files, setFiles] = useState<File[]>([]);

  const onDrop = useCallback(
    async (acceptedFiles: File[]) => {
      console.log('Accepted files:', acceptedFiles);
      setFiles(acceptedFiles);
  
      const uploadPromises = acceptedFiles.map(async (file) => {
        if (file.size > MAX_FILE_SIZE) {
          setFiles((prevFiles) => prevFiles.filter((f) => f.name !== file.name));
  
          return toast({
            description: (
              <p className="body-2 text-white">
                <span className="font-semibold">{file.name}</span> is too large. Max file size is <b>50MB</b>
              </p>
            ),
            className: "error-toast",
          });
        }
  
        try {
          const uploadedFile = await uploadFile({ file, ownerId, accountId, path });
          if (uploadedFile) {
            setFiles((prevFiles) => prevFiles.filter((f) => f.name !== file.name));
          }
        } catch (error) {
          toast({
            description: (
              <p className="body-2 text-white">
                <span className="font-semibold">{file.name}</span> failed to upload. Please try again later.
              </p>
            ),
            className: "error-toast",
          });
        }
      });
  
      await Promise.all(uploadPromises);
    },
    [ownerId, accountId, path, toast] // Add 'toast' to the dependency array
  );
  

  const { getRootProps, getInputProps } = useDropzone({ onDrop });


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
    
    </div>
  );
};

export default FileUploader;
