import { useCallback, useState } from 'react';
import { useDropzone } from 'react-dropzone';
import { toast } from 'react-toastify';
import api from '../utils/api';

const CSVUpload = ({ onUploadSuccess }) => {
    const [uploading, setUploading] = useState(false);

    const onDrop = useCallback(async (acceptedFiles) => {
        const file = acceptedFiles[0];
        if (!file) return;

        if (file.type !== 'text/csv' && file.type !== 'application/vnd.ms-excel') {
            toast.error('Please upload a CSV file');
            return;
        }

        const formData = new FormData();
        formData.append('file', file);

        setUploading(true);
        try {
            const { data } = await api.post('/contacts/upload', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });
            toast.success(data.message);
            if (onUploadSuccess) onUploadSuccess();
        } catch (error) {
            toast.error(error.response?.data?.message || 'Upload failed');
        } finally {
            setUploading(false);
        }
    }, [onUploadSuccess]);

    const { getRootProps, getInputProps, isDragActive } = useDropzone({ onDrop, accept: { 'text/csv': ['.csv'] } });

    return (
        <div
            {...getRootProps()}
            className={`border-2 border-dashed p-6 rounded-lg text-center cursor-pointer transition ${isDragActive ? 'border-indigo-500 bg-indigo-50' : 'border-gray-300 hover:border-indigo-400'
                }`}
        >
            <input {...getInputProps()} />
            {uploading ? (
                <p className="text-gray-600">Uploading...</p>
            ) : isDragActive ? (
                <p className="text-indigo-600">Drop the CSV file here...</p>
            ) : (
                <p className="text-gray-600">Drag & drop a CSV file here, or click to select variables (name, phone, email)</p>
            )}
        </div>
    );
};

export default CSVUpload;
