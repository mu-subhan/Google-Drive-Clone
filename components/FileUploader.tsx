import React from 'react'

interface Props {
    ownerId:string;
    accountId:string;

}
const FileUploader = ({ownerId,accountId} :Props)  => {
  return (
    <div>
      file FileUploader
    </div>
  )
}

export default FileUploader
