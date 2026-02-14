import { Pencil, Eraser, Paintbrush, Square, Pipette, Slash} from 'lucide-react';
import type { Tool } from '../types/index';

export const TOOLS: Tool[] = [
  { id: 'pencil', icon: Pencil, label: 'Crayon', cursor: 'crosshair' },
  { id: 'eraser', icon: Eraser, label: 'Gomme', cursor: 'cell' },
  { id: 'bucket', icon: Paintbrush, label: 'Seau', cursor: 'crosshair' },
  { id: 'rectangle', icon: Square, label: 'Rectangle', cursor: 'crosshair' },
  { id: 'eyedropper', icon: Pipette, label: 'Pipette', cursor: 'copy' },
  { id: 'line', icon: Slash, label: 'Ligne', cursor: 'crosshair'},
];