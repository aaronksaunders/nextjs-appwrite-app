"use client";

import { uploadFile } from "@/app/actions";
import { Models } from "node-appwrite";
import { ChangeEvent, useState } from "react";

export const PageContent = () => {
  const [selectedFile, setSelectedFile] = useState<File>();

  /**
   * Handles the change event when a file is selected.
   *
   * @param {ChangeEvent<HTMLInputElement>} event - The change event object.
   */
  const handleFileChange = (event: ChangeEvent<HTMLInputElement>) => {
    setSelectedFile((event.target.files && event.target.files[0])!);
  };

  /**
   * Handles the completion of file upload.
   *
   * @param fileDoc - The document representing the uploaded file.
   */
  const handleUploadComplete = (fileDoc: Models.File) => {
    console.log("[handleUploadComplete] ==>", fileDoc);
  };

  /**
   * Performs a form action by uploading a file and handling the upload completion.
   * @param {FormData} data - The form data to be uploaded.
   */
  const doFormAction = async (data: FormData) => {
    try {
      const resp = await uploadFile(data);
      handleUploadComplete(resp);
    } catch (e) {
      alert(`Error uploading file. Please try again. ${(e as Error)?.message}`);
    }
  };

  return (
    <div>
      <h2>File Upload</h2>
      <form action={doFormAction}>
        <input
          type="file"
          onChange={handleFileChange}
          name="uploadFile"
          id="uploadFile"
        />
        <button type="submit">Upload</button>
      </form>
    </div>
  );
};
