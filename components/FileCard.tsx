import React, { useState } from 'react';
import { FileItem, FileType } from '../types';
import { FileText, Image as ImageIcon, Film, Archive, MoreVertical, Download, Sparkles, Cpu, Trash2 } from 'lucide-react';

interface FileCardProps {
  file: FileItem;
  onAnalyze: (file: FileItem) => void;
  onDelete: (id: string) => void;
  onDownload: (file: FileItem) => void;
  isAnalyzing: boolean;
}

const FileCard: React.FC<FileCardProps> = ({ file, onAnalyze, onDelete, onDownload, isAnalyzing }) => {
  const [showMenu, setShowMenu] = useState(false);

  const getIcon = () => {
    switch (file.type) {
      case FileType.IMAGE: return <ImageIcon className="w-8 h-8 text-rose-500" />;
      case FileType.VIDEO: return <Film className="w-8 h-8 text-violet-500" />;
      case FileType.ARCHIVE: return <Archive className="w-8 h-8 text-emerald-500" />;
      default: return <FileText className="w-8 h-8 text-blue-500" />;
    }
  };

  const formatBytes = (bytes: number, decimals = 2) => {
    if (!+bytes) return '0 Bytes';
    const k = 1024;
    const dm = decimals < 0 ? 0 : decimals;
    const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return `${parseFloat((bytes / Math.pow(k, i)).toFixed(dm))} ${sizes[i]}`;
  };

  return (
    <div className="group bg-dark-surface border border-dark-border hover:border-brand-500/50 rounded-xl p-4 transition-all duration-200 hover:shadow-lg hover:shadow-brand-900/20 relative flex flex-col h-full">
      {/* Header */}
      <div className="flex items-start justify-between mb-3">
        <div className="p-3 bg-dark-bg rounded-lg border border-dark-border group-hover:bg-brand-900/20 transition-colors">
          {getIcon()}
        </div>
        <div className="relative">
          <button 
            onClick={() => setShowMenu(!showMenu)} 
            className="p-1 hover:bg-dark-border rounded-full text-gray-400 hover:text-white transition-colors"
          >
            <MoreVertical size={16} />
          </button>
          
          {showMenu && (
            <>
              <div className="fixed inset-0 z-10" onClick={() => setShowMenu(false)}></div>
              <div className="absolute right-0 mt-2 w-32 bg-dark-bg border border-dark-border rounded-lg shadow-xl z-20 overflow-hidden">
                <button 
                    onClick={() => {
                        onDownload(file);
                        setShowMenu(false);
                    }}
                    className="w-full text-left px-4 py-2 text-xs text-gray-300 hover:bg-dark-surface flex items-center gap-2"
                >
                  <Download size={12} /> Download
                </button>
                <button 
                    onClick={() => {
                        onDelete(file.id);
                        setShowMenu(false);
                    }}
                    className="w-full text-left px-4 py-2 text-xs text-red-400 hover:bg-dark-surface flex items-center gap-2"
                >
                   <Trash2 size={12} /> Delete
                </button>
              </div>
            </>
          )}
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 min-h-0">
        <h4 className="text-sm font-medium text-gray-200 truncate mb-1" title={file.name}>{file.name}</h4>
        <div className="flex items-center gap-2 text-[10px] text-gray-500">
           <span>{formatBytes(file.size)}</span>
           <span>•</span>
           <span>{new Date(file.uploadedAt).toLocaleDateString()}</span>
        </div>

        {/* AI Section */}
        <div className="mt-3">
          {file.aiAnalyzed ? (
            <div className="space-y-2">
               {file.description && (
                 <p className="text-[10px] text-gray-400 italic leading-relaxed line-clamp-2 bg-dark-bg p-2 rounded border border-dark-border/50">
                   "{file.description}"
                 </p>
               )}
               <div className="flex flex-wrap gap-1">
                 {file.tags?.slice(0, 3).map(tag => (
                   <span key={tag} className="px-1.5 py-0.5 rounded-sm bg-brand-900/30 text-brand-400 text-[9px] border border-brand-500/20 uppercase tracking-wider">
                     {tag}
                   </span>
                 ))}
               </div>
            </div>
          ) : (
            <button 
              onClick={() => onAnalyze(file)}
              disabled={isAnalyzing}
              className="w-full mt-2 py-1.5 px-3 rounded bg-dark-bg border border-dashed border-gray-600 hover:border-brand-500 text-gray-500 hover:text-brand-400 text-[10px] flex items-center justify-center gap-2 transition-all group-hover:opacity-100 md:opacity-0 md:group-hover:opacity-100"
            >
              {isAnalyzing ? (
                <Cpu className="animate-spin w-3 h-3" />
              ) : (
                <Sparkles className="w-3 h-3" />
              )}
              {isAnalyzing ? 'Analyzing...' : 'Analyze with Gemini'}
            </button>
          )}
        </div>
      </div>
      
      {/* Preview Image if available */}
      {file.type === FileType.IMAGE && file.url !== '#' && (
        <div className="absolute top-16 right-4 w-12 h-12 rounded-lg overflow-hidden opacity-20 group-hover:opacity-40 transition-opacity pointer-events-none">
          <img src={file.url} alt="" className="w-full h-full object-cover" />
        </div>
      )}
    </div>
  );
};

export default FileCard;