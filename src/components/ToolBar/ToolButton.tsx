import React from 'react';
import type { Tool, ToolType } from '../../types/index';

interface ToolButtonProps {
  tool: Tool;
  isActive: boolean;
  onClick: (toolId: ToolType) => void;
}

export const ToolButton: React.FC<ToolButtonProps> = ({ tool, isActive, onClick }) => {

  return (
    <button
      onClick={() => onClick(tool.id)}
      className={`w-14 h-14 flex flex-col items-center justify-center rounded-lg transition-all ${
        isActive ? 'bg-blue-600 text-white shadow-lg' : 'text-slate-400 hover:bg-slate-700 hover:text-white'
      }`}
      title={`${tool.label}`}
    >
      <tool.icon size={24} />
    </button>
  );
};