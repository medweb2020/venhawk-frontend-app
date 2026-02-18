/**
 * FileBadge Component
 * @description Displays an uploaded file as a badge with remove button
 */
const FileBadge = ({ file, onRemove, isDeleting }) => {
  return (
    <div className="inline-flex items-center gap-1.5 bg-green-50 border border-green-200 text-green-800 rounded-full px-3 py-1 text-xs group hover:bg-green-100 transition-colors">
      {/* Checkmark Icon */}
      <svg className="w-3 h-3 text-green-600 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>

      {/* File Name */}
      <span className="font-medium truncate max-w-[200px]" title={file.fileName}>
        {file.fileName}
      </span>

      {/* File Size */}
      <span className="text-green-600">
        ({(file.fileSize / 1024).toFixed(0)}KB)
      </span>

      {/* Remove Button */}
      <button
        type="button"
        onClick={onRemove}
        className="ml-1 text-red-500 hover:text-red-700 transition-colors opacity-70 group-hover:opacity-100 cursor-pointer"
        title="Remove file"
        disabled={isDeleting}
      >
        {isDeleting ? (
          /* Spinner */
          <svg className="w-3.5 h-3.5 animate-spin" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
          </svg>
        ) : (
          /* Cross Icon */
          <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        )}
      </button>
    </div>
  );
};

export default FileBadge;
