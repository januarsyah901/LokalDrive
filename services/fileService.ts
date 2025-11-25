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

// Simulate local storage "Server"
class LocalFileServer {
  private files: FileItem[] = [...INITIAL_FILES];
  private totalSpace = 1000000000; // 1 GB

  async getFiles(): Promise<FileItem[]> {
    return new Promise((resolve) => {
      setTimeout(() => resolve([...this.files]), 600); // Simulate network latency
    });
  }

  async uploadFile(file: File): Promise<FileItem> {
    return new Promise((resolve) => {
      setTimeout(() => {
        const newItem: FileItem = {
          id: Math.random().toString(36).substr(2, 9),
          name: file.name,
          size: file.size,
          type: getFileType(file.name),
          uploadedAt: new Date().toISOString(),
          url: URL.createObjectURL(file), // Local blob URL for preview and download
          aiAnalyzed: false
        };
        this.files.unshift(newItem);
        resolve(newItem);
      }, 1500); // Simulate upload time
    });
  }

  async deleteFile(id: string): Promise<void> {
    return new Promise((resolve) => {
      setTimeout(() => {
        // Revoke URL if it was a blob to avoid memory leaks (optional optimization for mock)
        const file = this.files.find(f => f.id === id);
        if (file && file.url.startsWith('blob:')) {
            URL.revokeObjectURL(file.url);
        }
        
        this.files = this.files.filter(f => f.id !== id);
        resolve();
      }, 400);
    });
  }

  async updateFileMetadata(id: string, metadata: { description: string; tags: string[] }): Promise<FileItem | null> {
    return new Promise(resolve => {
        const idx = this.files.findIndex(f => f.id === id);
        if (idx !== -1) {
            this.files[idx] = { ...this.files[idx], ...metadata, aiAnalyzed: true };
            resolve(this.files[idx]);
        } else {
            resolve(null);
        }
    })
  }

  getStorageStats(): StorageStats {
    const used = this.files.reduce((acc, curr) => acc + curr.size, 0);
    
    // Calculate distribution for chart
    const distribution = this.files.reduce((acc, curr) => {
        acc[curr.type] = (acc[curr.type] || 0) + curr.size;
        return acc;
    }, {} as Record<string, number>);

    const byType = [
        { name: 'Images', value: distribution[FileType.IMAGE] || 0, color: '#f43f5e' },
        { name: 'Videos', value: distribution[FileType.VIDEO] || 0, color: '#8b5cf6' },
        { name: 'Docs', value: distribution[FileType.DOCUMENT] || 0, color: '#3b82f6' },
        { name: 'Others', value: (distribution[FileType.ARCHIVE] || 0) + (distribution[FileType.OTHER] || 0), color: '#10b981' },
    ].filter(i => i.value > 0);

    return {
      used,
      total: this.totalSpace,
      byType
    };
  }
}

export const localServer = new LocalFileServer();