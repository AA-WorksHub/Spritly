import React, { useState } from 'react';
import { X } from 'lucide-react';
import { HexColorPicker } from "react-colorful";
import './ColorPickerModal.css'
import type { ToolContext } from "../../tools/types"

const DEFAULT_COLORS = [
  '#FF6B35', '#FFD23F', '#EE4266', '#9B5DE5', '#F72585',
  '#FFC2D1', '#3A86FF', '#06A77D', '#FFFFFF', '#000000',
];

interface ColorPickerModalProps {
  isOpen: boolean;
  currentColor: string;
  onClose: () => void;
  onColorChange: (color: string) => void;
  toolContext: ToolContext;
}

export const ColorPickerModal: React.FC<ColorPickerModalProps> = ({
  isOpen,
  currentColor,
  onClose,
  onColorChange,
  toolContext,
}) => {
  const [selectedColor, setSelectedColor] = useState(currentColor);

  if (!isOpen) return null;

  const handleColorChange = (color: string) => {
    setSelectedColor(color);
  };

  const handleApply = () => {
    onColorChange(selectedColor);
    if (toolContext) {
        toolContext.setCurrentColor(selectedColor);
    }
    onClose();
  };

  return (
    <>
      <div
        className="fixed inset-0 bg-black/50 z-40"
        onClick={onClose}
      />

      <div className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-50 bg-white rounded-lg shadow-2xl p-6 w-96">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-semibold text-slate-800">Chose a color</h3>
          <button
            onClick={onClose}
            className="p-1 hover:bg-slate-100 rounded transition-colors"
          >
            <X size={20} className="text-slate-600" />
          </button>
        </div>

        <div className="mb-6">
          <div className="grid grid-cols-5 gap-2">
            {DEFAULT_COLORS.map((color) => (
              <button
                key={color}
                onClick={() => setSelectedColor(color)}
                className={`w-12 h-12 rounded-full transition-all hover:scale-110 ${
                  selectedColor === color
                    ? 'ring-4 ring-blue-500 ring-offset-2'
                    : 'hover:ring-2 hover:ring-slate-300'
                }`}
                style={{
                  backgroundColor: color,
                  border: color === '#FFFFFF' ? '2px solid #e2e8f0' : 'none',
                }}
                title={color}
              />
            ))}
          </div>
        </div>

        <div className="mb-6 flex justify-center color-picker-modal">
          <HexColorPicker
            color={selectedColor}
            onChange={handleColorChange}
          />
        </div>
        <div className="mb-6">
          <label className="block text-sm text-slate-600 mb-2 font-medium">
            Hexadecimal code
          </label>
          <div className="flex items-center gap-2">
            <div
              className="w-10 h-10 rounded border-2 border-slate-200"
              style={{ backgroundColor: selectedColor }}
            />
            <input
              type="text"
              value={selectedColor}
              onChange={(e) => setSelectedColor(e.target.value)}
              className="flex-1 px-3 py-2 border border-slate-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 font-mono text-sm"
              placeholder="#000000"
            />
          </div>
        </div>

        <div className="flex gap-3">
          <button
            onClick={onClose}
            className="flex-1 px-4 py-2 bg-slate-200 hover:bg-slate-300 text-slate-700 rounded-lg transition-colors font-medium"
          >
            Cancel
          </button>
          <button
            onClick={handleApply}
            className="flex-1 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors font-medium"
          >
            Ok
          </button>
        </div>
      </div>
    </>
  );
};