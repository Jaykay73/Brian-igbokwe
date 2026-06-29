import { useRef, useState } from 'react';
import { UploadCloud, FileImage, X } from 'lucide-react';

interface UploadZoneProps {
  onFileSelect: (file: File) => void;
  selectedFile: File | null;
  onClearFile: () => void;
}

export const UploadZone: React.FC<UploadZoneProps> = ({ onFileSelect, selectedFile, onClearFile }) => {
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setIsDragging(true);
    } else if (e.type === 'dragleave') {
      setIsDragging(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      onFileSelect(e.dataTransfer.files[0]);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();
    if (e.target.files && e.target.files[0]) {
      onFileSelect(e.target.files[0]);
    }
  };

  if (selectedFile) {
    return (
      <div className="preview-container glass-panel">
        <div className="preview-info">
          <FileImage size={24} className="preview-icon" />
          <div>
            <div className="preview-name">{selectedFile.name}</div>
            <div className="preview-size">{(selectedFile.size / 1024 / 1024).toFixed(2)} MB</div>
          </div>
        </div>
        <button className="btn-remove" onClick={onClearFile} title="Remove file">
          <X size={20} />
        </button>
      </div>
    );
  }

  return (
    <div 
      className={`upload-zone ${isDragging ? 'drag-active' : ''}`}
      onDragEnter={handleDrag}
      onDragLeave={handleDrag}
      onDragOver={handleDrag}
      onDrop={handleDrop}
      onClick={() => fileInputRef.current?.click()}
    >
      <input
        ref={fileInputRef}
        type="file"
        className="file-input"
        accept="image/*"
        onChange={handleChange}
      />
      <UploadCloud size={48} className="upload-icon" />
      <div className="upload-text">Click to upload or drag and drop</div>
      <div className="upload-subtext">SVG, PNG, JPG or WEBP (max. 10MB)</div>
    </div>
  );
};
