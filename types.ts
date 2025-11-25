export enum FileType {
  IMAGE = 'image',
  VIDEO = 'video',
  DOCUMENT = 'document',
  ARCHIVE = 'archive',
  OTHER = 'other'
}

export interface FileItem {
  id: string;
  name: string;
  size: number;
  type: FileType;
  uploadedAt: string;
  url: string; // Mock URL or blob URL
  description?: string; // AI generated description
  tags?: string[]; // AI generated tags
  aiAnalyzed?: boolean;
}

export interface StorageStats {
  used: number;
  total: number;
  byType: { name: string; value: number; color: string }[];
}

export interface UploadProgress {
  fileName: string;
  progress: number;
}
