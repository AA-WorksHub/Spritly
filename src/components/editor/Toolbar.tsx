import { TOOLS } from '../../config/tools.config';
import type { ToolType } from '../../types/index';
import { ToolButton } from '../ToolBar/ToolButton';

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
}: ToolbarProps) {
  return (
    <div className="bg-slate-800 border-r border-slate-700 w-20 flex flex-col items-center py-4 space-y-4">
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
    </div>
  );
}

export default Toolbar;