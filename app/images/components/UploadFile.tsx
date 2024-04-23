"use client";

import { uploadFile } from "@/app/actions";
import { Models } from "node-appwrite";
import { ChangeEvent, useState } from "react";

export const UploadFile = () => {
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
    <div className="mt-4 mb-8 border border-slate-500 p-4 rounded">
      <h2 className=" font-bold mb-2">File Upload</h2>
      <form action={doFormAction}>
        <input
          className="mb"
          type="file"
          onChange={handleFileChange}
          name="uploadFile"
          id="uploadFile"
        />
        <div className="mt-4">
          <button className="border border-slate-500 rounded-md px-3 py-1.5" type="submit">Upload File</button>
        </div>
      </form>
    </div>
  );
};
