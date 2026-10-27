import React from 'react';
import { Skull, Ghost, Flame, Moon } from 'lucide-react';
import { AtmosphereType } from '../types';

interface Props {
  value: AtmosphereType;
  onChange: (val: AtmosphereType) => void;
  disabled?: boolean;
}

const atmospheres: { id: AtmosphereType; label: string; desc: string; icon: React.ReactNode; color: string }[] = [
  {
    id: 'subtle',
    label: 'Subtle',
    desc: 'Quiet digital whispers & stillness',
    icon: <Moon className="w-3.5 h-3.5" />,
    color: 'text-ghost-text border-ghost-muted hover:border-ghost-green'
  },
  {
    id: 'creepy',
    label: 'Creepy',
    desc: 'Watchful shadows & cold dread',
    icon: <Ghost className="w-3.5 h-3.5" />,
    color: 'text-ghost-green border-ghost-greenDim hover:border-ghost-green'
  },
  {
    id: 'gothic',
    label: 'Gothic',
    desc: 'Archaic ruins & cobwebbed crypts',
    icon: <Skull className="w-3.5 h-3.5" />,
    color: 'text-ghost-amber border-ghost-amberDim hover:border-ghost-amber'
  },
  {
    id: 'full_horror',
    label: 'Full Horror',
    desc: 'Visceral techno-terror & screaming buffers',
    icon: <Flame className="w-3.5 h-3.5" />,
    color: 'text-ghost-crimson border-ghost-crimsonDim hover:border-ghost-crimson'
  }
];

export const AtmospherePicker: React.FC<Props> = ({ value, onChange, disabled }) => {
  return (
    <div className="flex flex-wrap items-center gap-1.5">
      <span className="text-xs text-ghost-muted uppercase tracking-wider mr-1">Atmosphere:</span>
      {atmospheres.map((atm) => {
        const isSelected = value === atm.id;
        return (
          <button
            key={atm.id}
            type="button"
            disabled={disabled}
            onClick={() => onChange(atm.id)}
            title={atm.desc}
            className={`flex items-center space-x-1.5 px-2.5 py-1 rounded text-xs font-mono transition-all duration-200 border ${
              isSelected
                ? `bg-ghost-panelBorder shadow-phosphor font-semibold ${atm.color}`
                : `bg-ghost-panel/60 border-ghost-panelBorder/70 text-ghost-muted hover:text-ghost-text hover:bg-ghost-panel`
            } ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}
          >
            <span>{atm.icon}</span>
            <span>{atm.label}</span>
          </button>
        );
      })}
    </div>
  );
};
