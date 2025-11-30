import { FileItem, FileType, StorageStats } from "../types";

// Helper to create valid blob URLs for mock data so "Download" works
const createMockBlobUrl = (content: string, type: string = 'text/plain') => {
  try {
    const blob = new Blob([content], { type });
    return URL.createObjectURL(blob);
  } catch (e) {
    return '#';
  }
};

// Mock Data initialization
const INITIAL_FILES: FileItem[] = [
  {
    id: '1',
    name: 'Project_Proposal_Q4.pdf',
    size: 2450000,
    type: FileType.DOCUMENT,
    uploadedAt: new Date(Date.now() - 10000000).toISOString(),
    url: createMockBlobUrl('This is the content of Project Proposal Q4.', 'application/pdf'),
    description: 'Quarterly planning document for the engineering team.',
    tags: ['work', 'planning', 'q4'],
    aiAnalyzed: true
  },
  {
    id: '2',
    name: 'holiday_gathering_01.jpg',
    size: 4500000,
    type: FileType.IMAGE,
    uploadedAt: new Date(Date.now() - 5000000).toISOString(),
    url: 'https://picsum.photos/800/600', // External images usually open in new tab or download depending on CORS
    tags: ['social', 'photos'],
    aiAnalyzed: false
  },
  {
    id: '3',
    name: 'backend_api_v2.zip',
    size: 15600000,
    type: FileType.ARCHIVE,
    uploadedAt: new Date(Date.now() - 200000).toISOString(),
    url: createMockBlobUrl('Mock ZIP Archive Content'),
    aiAnalyzed: false
  }
];

// Helper to determine file type from extension
export const getFileType = (fileName: string): FileType => {
  const ext = fileName.split('.').pop()?.toLowerCase();
  if (['jpg', 'jpeg', 'png', 'gif', 'svg', 'webp'].includes(ext || '')) return FileType.IMAGE;
  if (['mp4', 'mov', 'avi', 'mkv'].includes(ext || '')) return FileType.VIDEO;
  if (['pdf', 'doc', 'docx', 'txt', 'md'].includes(ext || '')) return FileType.DOCUMENT;
  if (['zip', 'rar', '7z', 'tar', 'gz'].includes(ext || '')) return FileType.ARCHIVE;
  return FileType.OTHER;
};

// API URL - change this if backend runs on different port
const API_URL = 'http://localhost:3001/api';

// Network-based File Server (connects to Express backend)
class LocalFileServer {
  async getFiles(): Promise<FileItem[]> {
    try {
      const response = await fetch(`${API_URL}/files`);
      if (!response.ok) throw new Error('Failed to fetch files');
      const files = await response.json();

      // Prepend API_URL to file URLs if they're relative
      return files.map((file: any) => ({
        ...file,
        url: file.url.startsWith('http') ? file.url : `http://localhost:3001${file.url}`
      }));
    } catch (error) {
      console.error('Error fetching files:', error);
      // Fallback to initial mock data if server is not available
      return [...INITIAL_FILES];
    }
  }

  async uploadFile(file: File): Promise<FileItem> {
    try {
      const formData = new FormData();
      formData.append('file', file);

      const response = await fetch(`${API_URL}/upload`, {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) throw new Error('Upload failed');
      const fileItem = await response.json();

      // Prepend API_URL to file URL if it's relative
      fileItem.url = fileItem.url.startsWith('http') ? fileItem.url : `http://localhost:3001${fileItem.url}`;

      return fileItem;
    } catch (error) {
      console.error('Error uploading file:', error);
      throw error;
    }
  }

  async deleteFile(id: string): Promise<void> {
    try {
      const response = await fetch(`${API_URL}/files/${id}`, {
        method: 'DELETE',
      });

      if (!response.ok) throw new Error('Delete failed');
    } catch (error) {
      console.error('Error deleting file:', error);
      throw error;
    }
  }

  async updateFileMetadata(id: string, metadata: { description: string; tags: string[] }): Promise<FileItem | null> {
    try {
      const response = await fetch(`${API_URL}/files/${id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(metadata),
      });

      if (!response.ok) throw new Error('Update failed');
      const fileItem = await response.json();

      // Prepend API_URL to file URL if it's relative
      fileItem.url = fileItem.url.startsWith('http') ? fileItem.url : `http://localhost:3001${fileItem.url}`;

      return fileItem;
    } catch (error) {
      console.error('Error updating file metadata:', error);
      return null;
    }
  }

  async getStorageStats(): Promise<StorageStats> {
    try {
      const response = await fetch(`${API_URL}/storage-stats`);
      if (!response.ok) throw new Error('Failed to fetch storage stats');
      return await response.json();
    } catch (error) {
      console.error('Error fetching storage stats:', error);
      // Fallback to default stats
      return {
        used: 0,
        total: 1000000000,
        byType: []
      };
    }
  }
}

export const localServer = new LocalFileServer();