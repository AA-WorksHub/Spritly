import { useState } from 'react';
import { Palette } from 'lucide-react';
import { TOOLS } from '../../config/tools.config';
import type { ToolType } from '../../types/index';
import { ToolButton } from '../ToolBar/ToolButton';
import { ColorPickerModal } from '../ToolBar/ColorPickerModal';

interface ToolbarProps {
  activeTool: ToolType;
  onToolChange: (tool: ToolType) => void;
  primaryColor: string;
  secondaryColor: string;
  onPrimaryColorChange: (color: string) => void;
  onSecondaryColorChange: (color: string) => void;
}

function Toolbar({
  activeTool,
  onToolChange,
  primaryColor,
  // secondaryColor,
  onPrimaryColorChange,
  // onSecondaryColorChange,
}: ToolbarProps) {
  const [isPickerOpen, setIsPickerOpen] = useState(false);
  return (
    <div className="bg-slate-800 border-r border-slate-700 w-20 flex flex-col items-center py-4 space-y-4">
      {/* Outils */}
      <div className="space-y-1">
        {TOOLS.map((tool) => (
          <ToolButton
            key={tool.id}
            tool={tool}
            isActive={activeTool === tool.id}
            onClick={onToolChange}
          />
        ))}
      </div>
        <button
          onClick={() => setIsPickerOpen(true)}
          className="relative w-12 h-12 rounded-lg border-2 border-slate-600 hover:border-slate-400 transition-all"
          style={{ backgroundColor: primaryColor }}
        >
          <Palette size={16} className="absolute bottom-0 right-0 text-white bg-slate-800 rounded-full p-0.5" />
        </button>

        {/* Modal */}
        <ColorPickerModal
          isOpen={isPickerOpen}
          currentColor={primaryColor}
          onClose={() => setIsPickerOpen(false)}
          onColorChange={onPrimaryColorChange}
        />
    </div>
  );
}

export default Toolbar;