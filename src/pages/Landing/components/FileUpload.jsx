import { useState } from 'react';
import { useAuth0 } from '@auth0/auth0-react';
import { fileAPI } from '../../../services/api';
import FileBadge from './FileBadge';

/**
 * FileUpload Component
 * @description Handles file upload with drag & drop, validation, and deletion
 */
const FileUpload = ({ fileUploads, updateProjectData }) => {
  const { getAccessTokenSilently } = useAuth0();

  // File upload state
  const [uploadingFiles, setUploadingFiles] = useState([]);
  const [uploadError, setUploadError] = useState('');
  const [isDragging, setIsDragging] = useState(false);
  const [deletingFileIndex, setDeletingFileIndex] = useState(null);

  // File validation constants
  const MAX_FILE_SIZE = 50 * 1024 * 1024; // 50MB
  const MAX_FILES = 10;

  // Process and upload files
  const processFiles = async (files) => {
    setUploadError('');

    // Check total files limit before processing
    const remainingSlots = MAX_FILES - fileUploads.length;
    if (files.length > remainingSlots) {
      setUploadError(`You can only upload ${remainingSlots} more file${remainingSlots !== 1 ? 's' : ''}. Maximum ${MAX_FILES} files allowed.`);
      files = files.slice(0, remainingSlots); // Only process files that fit
    }

    for (const file of files) {
      // Validate file size
      if (file.size > MAX_FILE_SIZE) {
        setUploadError(`File ${file.name} exceeds 50MB limit`);
        continue;
      }

      // Add to uploading state
      const uploadId = Date.now() + Math.random();
      setUploadingFiles(prev => [...prev, { id: uploadId, name: file.name, progress: 0 }]);

      try {
        // Get access token
        const accessToken = await getAccessTokenSilently();

        // Upload file
        const response = await fileAPI.uploadFile(file, accessToken);

        // Add uploaded file to project data using callback to avoid race condition
        updateProjectData((prevData) => ({
          ...prevData,
          fileUploads: [
            ...prevData.fileUploads,
            {
              fileUrl: response.fileUrl,
              fileName: response.fileName,
              fileSize: response.fileSize,
              mimeType: response.mimeType,
            },
          ],
        }));

        // Remove from uploading state
        setUploadingFiles(prev => prev.filter(f => f.id !== uploadId));
      } catch (error) {
        console.error('File upload error:', error);
        setUploadError(`Failed to upload ${file.name}: ${error.message}`);
        setUploadingFiles(prev => prev.filter(f => f.id !== uploadId));
      }
    }
  };

  // Handle file selection from input
  const handleFileSelect = async (e) => {
    const selectedFiles = Array.from(e.target.files);
    await processFiles(selectedFiles);
    // Reset input
    e.target.value = '';
  };

  // Drag and drop handlers
  const handleDragEnter = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  };

  const handleDrop = async (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);

    if (fileUploads.length >= MAX_FILES) {
      setUploadError(`Maximum ${MAX_FILES} files allowed`);
      return;
    }

    const droppedFiles = Array.from(e.dataTransfer.files);
    await processFiles(droppedFiles);
  };

  // Remove uploaded file
  const handleRemoveFile = async (index) => {
    const fileToRemove = fileUploads[index];

    // Set deleting state to show spinner
    setDeletingFileIndex(index);
    setUploadError('');

    try {
      // Get access token
      const accessToken = await getAccessTokenSilently();

      // Call DELETE API to remove file from Supabase
      await fileAPI.deleteFile(fileToRemove.fileUrl, accessToken);

      // Remove from context after successful API call
      updateProjectData((prevData) => ({
        ...prevData,
        fileUploads: prevData.fileUploads.filter((_, i) => i !== index),
      }));
    } catch (error) {
      console.error('File deletion error:', error);
      setUploadError(`Failed to delete ${fileToRemove.fileName}: ${error.message}`);
    } finally {
      // Clear deleting state
      setDeletingFileIndex(null);
    }
  };

  return (
    <div>
      <label className="block text-sm font-normal text-gray-700 mb-2">
        File Uploads (Optional)
        <span className="text-xs text-gray-500 ml-2">
          Max 50MB per file, {MAX_FILES} files max
        </span>
      </label>

      {/* Upload Error */}
      {uploadError && (
        <div className="mb-3 p-3 bg-red-50 border border-red-200 rounded-lg text-sm text-red-700">
          {uploadError}
        </div>
      )}

      {/* Upload Area */}
      <div
        className={`border-2 border-dashed rounded-lg p-6 transition-all duration-200 ${
          uploadingFiles.length > 0
            ? 'border-blue-400 bg-blue-50'
            : isDragging
            ? 'border-blue-500 bg-blue-50'
            : 'border-gray-300 bg-gray-50 hover:bg-gray-100'
        } ${fileUploads.length >= MAX_FILES ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}
        onDragEnter={handleDragEnter}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
      >
        <input
          type="file"
          id="fileUploads"
          name="fileUploads"
          multiple
          className="hidden"
          onChange={handleFileSelect}
          disabled={fileUploads.length >= MAX_FILES || uploadingFiles.length > 0}
        />

        {/* Show uploading progress */}
        {uploadingFiles.length > 0 ? (
          <div className="flex flex-col items-center gap-3">
            <svg className="w-10 h-10 animate-spin text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
            </svg>
            <div className="text-center">
              <span className="text-sm font-medium text-blue-700">
                Uploading {uploadingFiles.length} file{uploadingFiles.length !== 1 ? 's' : ''}...
              </span>
              <p className="text-xs text-blue-600 mt-2">
                {uploadingFiles.map(f => f.name).join(', ')}
              </p>
            </div>
          </div>
        ) : (
          /* Show normal drag/drop UI */
          <label htmlFor="fileUploads" className="cursor-pointer block">
            <div className="flex flex-col items-center gap-3 text-gray-600">
              <svg
                className={`w-10 h-10 transition-colors ${
                  isDragging ? 'text-blue-500' : 'text-gray-600'
                }`}
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
              </svg>
              <div className="text-center">
                <span className={`text-sm font-medium ${isDragging ? 'text-blue-600' : 'text-gray-700'}`}>
                  {fileUploads.length >= MAX_FILES
                    ? 'Maximum files reached'
                    : isDragging
                    ? 'Drop files here'
                    : 'Drag & drop files or click to upload'}
                </span>
                <p className="text-xs text-gray-500 mt-1">
                  {fileUploads.length >= MAX_FILES
                    ? `You've reached the maximum of ${MAX_FILES} files`
                    : `Upload up to ${MAX_FILES} files (PDFs, diagrams, specifications, etc.)`}
                </p>
              </div>
            </div>
          </label>
        )}
      </div>

      {/* Uploaded Files - Compact chip layout with scrolling */}
      {fileUploads.length > 0 && (
        <div className="mt-3">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-medium text-gray-600">
              {fileUploads.length} file{fileUploads.length !== 1 ? 's' : ''} uploaded
            </span>
          </div>
          <div className="max-h-32 overflow-y-auto">
            <div className="flex flex-wrap gap-2">
              {fileUploads.map((file, index) => (
                <FileBadge
                  key={index}
                  file={file}
                  onRemove={() => handleRemoveFile(index)}
                  isDeleting={deletingFileIndex === index}
                />
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default FileUpload;
