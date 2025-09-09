import React, { useState } from 'react';

const R2UploadTester = () => {
  const [selectedFile, setSelectedFile] = useState(null);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadStatus, setUploadStatus] = useState('');
  const [publicUrl, setPublicUrl] = useState('');
  const [fileKey, setFileKey] = useState('');
  const [resourceType, setResourceType] = useState('USERS');
  const [resourceId, setResourceId] = useState('');
  const [fileType, setFileType] = useState('PROFILE');

  // Handle file selection - set contentType based on actual file
  const handleFileChange = (event) => {
    const file = event.target.files[0];
    setSelectedFile(file);
    setUploadStatus('');
    setPublicUrl('');
    
    // Log the actual file type for debugging
    console.log('Selected file type:', file.type);
    console.log('Selected file name:', file.name);
  };

  // Determine the update endpoint and payload based on resource and file type
  const getUpdateConfig = () => {
    const baseConfig = {
      endpoint: '',
      payload: {}
    };

    switch (resourceType) {
      case 'USERS':
        baseConfig.endpoint = '/secure/user/users';
        if (fileType === 'PROFILE') {
          baseConfig.payload = { profileImageKey: fileKey };
        } else if (fileType === 'COVER') {
          baseConfig.payload = { coverImageKey: fileKey };
        }
        break;
      
      case 'ORGANIZATIONS':
        baseConfig.endpoint = '/secure/manager/organizations';
        if (fileType === 'LOGO') {
          baseConfig.payload = { logoImageKey: fileKey };
        } else if (fileType === 'COVER') {
          baseConfig.payload = { coverImageKey: fileKey };
        }
        break;
      
      case 'VENUES':
        baseConfig.endpoint = '/secure/manager/venues';
        if (fileType === 'LOGO') {
          baseConfig.payload = { logoImageKey: fileKey };
        } else if (fileType === 'COVER') {
          baseConfig.payload = { coverImageKey: fileKey };
        }
        break;
      
      case 'FACILITIES':
        baseConfig.endpoint = '/secure/manager/facilities';
        if (fileType === 'LOGO') {
          baseConfig.payload = { logoImageKey: fileKey };
        }
        break;
      
      default:
        break;
    }

    return baseConfig;
  };

  // The main function to test the upload
  const handleUpload = async () => {
    if (!selectedFile) {
      alert('Please select a file first.');
      return;
    }

    if (!resourceId) {
      alert('Please enter a resource ID.');
      return;
    }

    setIsUploading(true);
    setUploadStatus('Requesting pre-signed URL from backend...');

    try {
      // Step 1: Get the pre-signed URL from YOUR Spring Boot backend
      // Use the ACTUAL file.type from the selected file, not user input
      const payload = {
        resourceType: resourceType,
        resourceId: parseInt(resourceId),
        fileType: fileType,
        contentType: selectedFile.type // ← This is the crucial security fix
      };

      console.log('Sending payload with actual content type:', payload);

      const presignResponse = await fetch('http://off.lvh.me:8080/secure/manager/storage/r2/presign', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${import.meta.env.VITE_ACCESS_TOKEN}`
        },
        body: JSON.stringify(payload)
      });

      if (!presignResponse.ok) {
        const errorText = await presignResponse.text();
        throw new Error(`Failed to get pre-signed URL: ${presignResponse.status} ${errorText}`);
      }

      const presignData = await presignResponse.json();
      const { uploadUrl, fileKey, publicUrl } = presignData.data;

      setFileKey(fileKey);
      setUploadStatus('Pre-signed URL received. Uploading to R2...');

      // Step 2: Upload the file directly to Cloudflare R2 using the pre-signed URL
      // Use the SAME content type that was used to generate the pre-signed URL
      const uploadResponse = await fetch(uploadUrl, {
        method: 'PUT',
        body: selectedFile,
        headers: {
          'Content-Type': selectedFile.type, // ← Must match the pre-signed URL
        }
      });

      if (!uploadResponse.ok) {
        const errorText = await uploadResponse.text();
        throw new Error(`R2 Upload failed: ${uploadResponse.status} ${errorText}`);
      }

      setUploadStatus('Upload to R2 successful! Updating database...');

      // Step 3: ONLY IF UPLOAD TO R2 SUCCESSFUL - Update entity with fileKey
      const updateConfig = getUpdateConfig();
      
      if (updateConfig.endpoint && Object.keys(updateConfig.payload).length > 0) {
        const updateResponse = await fetch(`http://off.lvh.me:8080${updateConfig.endpoint}`, {
          method: 'PATCH',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${import.meta.env.VITE_ACCESS_TOKEN}`
          },
          body: JSON.stringify(updateConfig.payload)
        });

        if (!updateResponse.ok) {
          const errorText = await updateResponse.text();
          throw new Error(`Failed to update ${resourceType.toLowerCase()}: ${updateResponse.status} ${errorText}`);
        }
        
        setUploadStatus(`Upload and ${resourceType.toLowerCase()} update complete!`);
      } else {
        setUploadStatus('Upload complete! (No database update needed for this resource/file type combination)');
      }

      setPublicUrl(publicUrl);
      console.log('File uploaded successfully. Key:', fileKey);
      console.log('Public URL:', publicUrl);

    } catch (error) {
      console.error('Upload error:', error);
      setUploadStatus(`Error: ${error.message}`);
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div style={{ padding: '2rem', fontFamily: 'sans-serif' }}>
      <h1>Cloudflare R2 Upload Test</h1>
      
      {/* Resource Type Selection */}
      <div style={{ marginBottom: '1rem' }}>
        <label style={{ display: 'block', marginBottom: '0.5rem' }}>
          <strong>Resource Type:</strong>
          <select 
            value={resourceType} 
            onChange={(e) => setResourceType(e.target.value)}
            style={{ marginLeft: '0.5rem', padding: '0.25rem' }}
          >
            <option value="USERS">USERS</option>
            <option value="ORGANIZATIONS">ORGANIZATIONS</option>
            <option value="VENUES">VENUES</option>
            <option value="FACILITIES">FACILITIES</option>
          </select>
        </label>
      </div>

      {/* Resource ID Input */}
      <div style={{ marginBottom: '1rem' }}>
        <label style={{ display: 'block', marginBottom: '0.5rem' }}>
          <strong>Resource ID:</strong>
          <input 
            type="number" 
            value={resourceId} 
            onChange={(e) => setResourceId(e.target.value)}
            placeholder="e.g., 123"
            style={{ marginLeft: '0.5rem', padding: '0.25rem' }}
          />
        </label>
      </div>

      {/* File Type Selection */}
      <div style={{ marginBottom: '1rem' }}>
        <label style={{ display: 'block', marginBottom: '0.5rem' }}>
          <strong>File Type:</strong>
          <select 
            value={fileType} 
            onChange={(e) => setFileType(e.target.value)}
            style={{ marginLeft: '0.5rem', padding: '0.25rem' }}
          >
            <option value="PROFILE">PROFILE</option>
            <option value="COVER">COVER</option>
            <option value="LOGO">LOGO</option>
          </select>
        </label>
      </div>

      {/* File Input */}
      <div style={{ marginBottom: '1rem' }}>
        <input 
          type="file" 
          onChange={handleFileChange} 
          disabled={isUploading} 
          accept="image/*" // ← Optional: restrict to image files in the file dialog
        />
        {selectedFile && (
          <div style={{ marginTop: '0.5rem', fontSize: '0.9rem', color: '#666' }}>
            Selected: {selectedFile.name} ({selectedFile.type})
          </div>
        )}
      </div>

      {/* Upload Button */}
      <div>
        <button 
          onClick={handleUpload} 
          disabled={!selectedFile || !resourceId || isUploading}
          style={{ marginTop: '1rem', padding: '0.5rem 1rem' }}
        >
          {isUploading ? 'Uploading...' : 'Upload Test File'}
        </button>
      </div>

      {/* Status Display */}
      {uploadStatus && (
        <div style={{ marginTop: '1rem' }}>
          <strong>Status:</strong> {uploadStatus}
        </div>
      )}

      {/* Results Display */}
      {publicUrl && (
        <div style={{ marginTop: '2rem' }}>
          <h3>Uploaded Image:</h3>
          <p><strong>File Key:</strong> {fileKey}</p>
          <p><strong>Public URL:</strong> <a href={publicUrl} target="_blank" rel="noopener noreferrer">{publicUrl}</a></p>
          <img 
            src={publicUrl} 
            alt="Uploaded preview" 
            style={{ maxWidth: '100%', maxHeight: '400px', border: '1px solid #ccc', marginTop: '0.5rem' }}
            onError={(e) => {
              e.target.alt = 'Failed to load image. Is the R2 bucket public?';
            }}
          />
        </div>
      )}
    </div>
  );
};

export default R2UploadTester;