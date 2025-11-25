import React, { useState, useEffect, useCallback, useRef } from 'react';
import { Upload, Search, Wifi, Server, Grid, List as ListIcon, ShieldCheck, RefreshCw } from 'lucide-react';
import { FileItem, StorageStats, UploadProgress } from './types';
import { localServer, getFileType } from './services/fileService';
import { analyzeFileMetadata } from './services/geminiService';
import FileCard from './components/FileCard';
import StorageChart from './components/StorageChart';

// Helper for Bytes (Global scope)
export const formatBytes = (bytes: number, decimals = 2) => {
  if (!+bytes) return '0 Bytes';
  const k = 1024;
  const dm = decimals < 0 ? 0 : decimals;
  const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return `${parseFloat((bytes / Math.pow(k, i)).toFixed(dm))} ${sizes[i]}`;
};

const App: React.FC = () => {
  const [files, setFiles] = useState<FileItem[]>([]);
  const [stats, setStats] = useState<StorageStats | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [uploadingFiles, setUploadingFiles] = useState<UploadProgress[]>([]);
  const [analyzingIds, setAnalyzingIds] = useState<Set<string>>(new Set());
  
  // Fake server IP for display
  const serverIP = "192.168.1.42:3000";

  const loadData = useCallback(async () => {
    setIsLoading(true);
    const data = await localServer.getFiles();
    setFiles(data);
    setStats(localServer.getStorageStats());
    setIsLoading(false);
  }, []);

  useEffect(() => {
    loadData();
  }, [loadData]);

  // Upload Logic
  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement> | DragEvent) => {
    let fileList: FileList | null = null;
    if ('dataTransfer' in e) {
       fileList = (e as DragEvent).dataTransfer?.files || null;
    } else {
       fileList = (e as React.ChangeEvent<HTMLInputElement>).target.files;
    }

    if (!fileList || fileList.length === 0) return;

    const newUploads = Array.from(fileList).map(f => ({ fileName: f.name, progress: 0 }));
    setUploadingFiles(prev => [...prev, ...newUploads]);

    // Simulate upload sequentially
    for (let i = 0; i < fileList.length; i++) {
        const file = fileList[i];
        
        // Mock progress
        setUploadingFiles(prev => prev.map(u => u.fileName === file.name ? { ...u, progress: 50 } : u));
        
        const newFile = await localServer.uploadFile(file);
        
        // Auto-analyze if it's a doc or image
        handleAIAnalysis(newFile);

        setUploadingFiles(prev => prev.filter(u => u.fileName !== file.name));
        setFiles(prev => [newFile, ...prev]);
        setStats(localServer.getStorageStats());
    }
  };

  // Delete Logic
  const handleDeleteFile = async (id: string) => {
    if (!window.confirm("Are you sure you want to delete this file? This action cannot be undone.")) {
        return;
    }

    try {
        await localServer.deleteFile(id);
        // Optimistically remove from UI
        setFiles(prev => prev.filter(f => f.id !== id));
        // Update storage stats
        setStats(localServer.getStorageStats());
    } catch (error) {
        console.error("Failed to delete file:", error);
        alert("Failed to delete file. Please try again.");
    }
  };

  // Download Logic
  const handleDownloadFile = (file: FileItem) => {
    // Create a temporary anchor element to trigger download
    const link = document.createElement('a');
    link.href = file.url;
    
    // Check if it is an external URL (mock images) or blob
    // For Blobs, the download attribute works perfectly
    if (file.url.startsWith('blob:')) {
        link.download = file.name;
    } else {
        // For external URLs (like picsum), we try target blank if download isn't forced
        link.target = "_blank"; 
        link.rel = "noopener noreferrer";
    }
    
    document.body.appendChild(link);
    link.click();
    
    // Cleanup
    setTimeout(() => {
        document.body.removeChild(link);
    }, 100);
  };

  // AI Analysis Logic
  const handleAIAnalysis = async (file: FileItem) => {
    if (analyzingIds.has(file.id)) return;

    setAnalyzingIds(prev => new Set(prev).add(file.id));
    
    try {
      const metadata = await analyzeFileMetadata(file);
      const updatedFile = await localServer.updateFileMetadata(file.id, metadata);
      if (updatedFile) {
        setFiles(prev => prev.map(f => f.id === updatedFile.id ? updatedFile : f));
      }
    } catch (e) {
      console.error(e);
    } finally {
      setAnalyzingIds(prev => {
        const next = new Set(prev);
        next.delete(file.id);
        return next;
      });
    }
  };

  // Filtered files
  const filteredFiles = files.filter(f => 
    f.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
    f.tags?.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  // Drag & Drop Handlers
  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    handleFileUpload(e as unknown as DragEvent);
  };

  return (
    <div className="min-h-screen bg-dark-bg text-gray-100 flex font-sans" onDragOver={handleDragOver} onDrop={handleDrop}>
      
      {/* Sidebar */}
      <aside className="w-64 border-r border-dark-border bg-dark-bg hidden md:flex flex-col fixed h-full z-20">
        <div className="p-6">
          <div className="flex items-center gap-3 text-brand-500 mb-8">
            <Server className="w-8 h-8" />
            <h1 className="text-xl font-bold tracking-tight text-white">LokalDrive</h1>
          </div>

          <div className="bg-dark-surface p-4 rounded-xl border border-dark-border mb-6">
            <div className="flex items-center gap-2 mb-2">
              <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></div>
              <span className="text-xs font-semibold text-emerald-400">SERVER ONLINE</span>
            </div>
            <p className="text-[10px] text-gray-400 mb-2">Access within WiFi:</p>
            <div className="bg-dark-bg p-2 rounded border border-dashed border-gray-600 flex justify-between items-center group cursor-pointer hover:border-brand-500 transition-colors">
              <code className="text-xs text-brand-400 font-mono">{serverIP}</code>
              <Wifi size={12} className="text-gray-500 group-hover:text-brand-500" />
            </div>
          </div>

          <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed border-brand-500/30 rounded-xl cursor-pointer bg-brand-500/5 hover:bg-brand-500/10 hover:border-brand-500 transition-all group relative overflow-hidden">
            <div className="flex flex-col items-center justify-center pt-5 pb-6 z-10">
              <Upload className="w-8 h-8 mb-2 text-brand-500 group-hover:scale-110 transition-transform" />
              <p className="text-xs text-gray-400 font-medium">Click or Drag Files</p>
            </div>
            <input type="file" className="hidden" multiple onChange={handleFileUpload} />
            {uploadingFiles.length > 0 && (
                 <div className="absolute inset-0 bg-dark-surface/90 flex flex-col items-center justify-center">
                    <div className="w-4 h-4 border-2 border-brand-500 border-t-transparent rounded-full animate-spin"></div>
                    <span className="text-[10px] mt-2">Uploading...</span>
                 </div>
            )}
          </label>
        </div>

        <div className="mt-auto p-6">
            {stats && <StorageChart stats={stats} />}
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 md:ml-64 flex flex-col min-h-screen relative">
        
        {/* Mobile Header */}
        <div className="md:hidden bg-dark-surface border-b border-dark-border p-4 flex items-center justify-between sticky top-0 z-30">
            <div className="flex items-center gap-2">
                <Server className="text-brand-500 w-6 h-6" />
                <span className="font-bold">LokalDrive</span>
            </div>
            <label className="p-2 bg-brand-600 rounded-lg text-white">
                <Upload size={20} />
                <input type="file" className="hidden" multiple onChange={handleFileUpload} />
            </label>
        </div>

        {/* Top Bar */}
        <header className="sticky top-0 z-20 bg-dark-bg/80 backdrop-blur-md border-b border-dark-border px-6 py-4 flex flex-col md:flex-row gap-4 items-center justify-between">
          
          <div className="relative w-full md:w-96">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 w-4 h-4" />
            <input 
              type="text" 
              placeholder="Search files, tags..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-dark-surface border border-dark-border rounded-lg pl-10 pr-4 py-2 text-sm text-gray-200 focus:outline-none focus:border-brand-500 focus:ring-1 focus:ring-brand-500 transition-all"
            />
          </div>

          <div className="flex items-center gap-2 w-full md:w-auto justify-end">
             <div className="bg-dark-surface rounded-lg p-1 border border-dark-border flex">
                <button 
                  onClick={() => setViewMode('grid')}
                  className={`p-2 rounded-md transition-all ${viewMode === 'grid' ? 'bg-brand-900/30 text-brand-400' : 'text-gray-500 hover:text-gray-300'}`}
                >
                    <Grid size={16} />
                </button>
                <button 
                  onClick={() => setViewMode('list')}
                  className={`p-2 rounded-md transition-all ${viewMode === 'list' ? 'bg-brand-900/30 text-brand-400' : 'text-gray-500 hover:text-gray-300'}`}
                >
                    <ListIcon size={16} />
                </button>
             </div>
             
             <button onClick={loadData} className="p-2.5 bg-dark-surface border border-dark-border rounded-lg text-gray-400 hover:text-white hover:border-gray-500 transition-all">
                <RefreshCw size={16} className={`${isLoading ? 'animate-spin' : ''}`} />
             </button>
          </div>
        </header>

        {/* Files Grid */}
        <div className="flex-1 p-6 overflow-y-auto">
            
            <div className="flex items-center justify-between mb-6">
                <h2 className="text-lg font-semibold text-gray-200">Recent Uploads</h2>
                <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20">
                    <ShieldCheck size={12} className="text-emerald-500" />
                    <span className="text-[10px] text-emerald-400 uppercase tracking-wide font-bold">Secure Local LAN</span>
                </div>
            </div>

            {filteredFiles.length === 0 && !isLoading ? (
                <div className="flex flex-col items-center justify-center h-64 border-2 border-dashed border-dark-border rounded-2xl bg-dark-surface/30">
                    <div className="w-16 h-16 bg-dark-surface rounded-full flex items-center justify-center mb-4">
                        <Upload className="text-gray-600" size={24} />
                    </div>
                    <p className="text-gray-400 font-medium">No files found</p>
                    <p className="text-sm text-gray-600 mt-1">Drag and drop files to start sharing</p>
                </div>
            ) : (
                <div className={viewMode === 'grid' ? "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4" : "space-y-2"}>
                    {filteredFiles.map(file => (
                        <FileCard 
                            key={file.id} 
                            file={file} 
                            onAnalyze={handleAIAnalysis}
                            onDelete={handleDeleteFile}
                            onDownload={handleDownloadFile}
                            isAnalyzing={analyzingIds.has(file.id)}
                        />
                    ))}
                </div>
            )}
        </div>
      </main>

      {/* Upload Toast */}
      {uploadingFiles.length > 0 && (
          <div className="fixed bottom-6 right-6 bg-dark-surface border border-dark-border rounded-lg shadow-2xl p-4 w-80 z-50">
              <h4 className="text-sm font-semibold mb-3 flex items-center justify-between">
                  <span>Uploading {uploadingFiles.length} files...</span>
                  <span className="text-xs text-brand-400 animate-pulse">Processing</span>
              </h4>
              <div className="space-y-2 max-h-40 overflow-y-auto">
                  {uploadingFiles.map((f, i) => (
                      <div key={i} className="text-xs text-gray-400">
                          <div className="flex justify-between mb-1">
                              <span className="truncate max-w-[150px]">{f.fileName}</span>
                              <span>{f.progress}%</span>
                          </div>
                          <div className="w-full bg-dark-bg h-1 rounded-full overflow-hidden">
                              <div className="h-full bg-brand-500 transition-all duration-300" style={{ width: `${f.progress}%` }}></div>
                          </div>
                      </div>
                  ))}
              </div>
          </div>
      )}
    </div>
  );
};

export default App;