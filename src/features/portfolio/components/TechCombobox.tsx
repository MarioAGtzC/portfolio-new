import { useCombobox, useMultipleSelection } from 'downshift';
import { useState, type ChangeEvent } from 'react';
import type { Facets } from '../lib/filters';
import { suggestTechs, type TechSuggestion } from '../lib/suggest';
import type { TechId, TechIndex } from '../lib/tech';

export interface TechComboboxProps {
  /** Selected techs, from the URL. */
  techs: TechId[];
  index: TechIndex;
  facets: Facets;
  addTech: (tech: TechId) => void;
  removeTech: (tech: TechId) => void;
}

/** Tech search with chips (D3): Downshift handles ARIA and keys, `suggestTechs` the ordering. */
function TechCombobox({ techs, index, facets, addTech, removeTech }: TechComboboxProps) {
  const [inputValue, setInputValue] = useState('');
  const items = suggestTechs(inputValue, {
    index,
    count: (id) => facets.techs.get(id) ?? 0,
    exclude: techs,
  });
  const label = (id: TechId) => index.entries.get(id)?.label ?? id;

  const { getSelectedItemProps, getDropdownProps } = useMultipleSelection<TechId>({
    selectedItems: techs,
    onStateChange({ type, selectedItems }) {
      // Backspace on the empty input or on a focused chip; the × buttons call removeTech directly.
      if (
        type === useMultipleSelection.stateChangeTypes.DropdownKeyDownBackspace ||
        type === useMultipleSelection.stateChangeTypes.SelectedItemKeyDownBackspace ||
        type === useMultipleSelection.stateChangeTypes.SelectedItemKeyDownDelete
      ) {
        const removed = techs.find((tech) => !selectedItems?.includes(tech));
        if (removed) removeTech(removed);
      }
    },
  });

  const { isOpen, getLabelProps, getMenuProps, getInputProps, getItemProps, highlightedIndex } =
    useCombobox<TechSuggestion>({
      items,
      inputValue,
      selectedItem: null,
      // Enter adds the first suggestion without touching the list: `react` + Enter → React.
      defaultHighlightedIndex: 0,
      itemToString: (item) => item?.label ?? '',
      onStateChange({ type, selectedItem }) {
        if (
          selectedItem &&
          (type === useCombobox.stateChangeTypes.InputKeyDownEnter || type === useCombobox.stateChangeTypes.ItemClick)
        ) {
          addTech(selectedItem.id);
          setInputValue('');
        }
      },
    });

  const showEmpty = isOpen && inputValue.trim() !== '' && items.length === 0;

  return (
    <div className='relative flex min-w-0 flex-col gap-2 sm:flex-row sm:items-center'>
      <label {...getLabelProps()} className='text-sm text-ink-2'>
        Tech:
      </label>
      <div className='flex min-w-0 flex-1 flex-wrap items-center gap-1.5 rounded-lg border border-line bg-surface px-2 py-1.5 focus-within:border-accent focus-within:ring-2 focus-within:ring-glow'>
        {techs.map((tech, position) => (
          <span
            key={tech}
            {...getSelectedItemProps({ selectedItem: tech, index: position })}
            className='inline-flex items-center gap-1 rounded-md border border-line bg-surface-2 py-0.5 pr-1 pl-2 font-geist-mono text-xs text-ink outline-none focus-visible:ring-2 focus-visible:ring-accent'
          >
            {label(tech)}
            <button
              type='button'
              aria-label={`Remove ${label(tech)}`}
              onClick={(event) => {
                event.stopPropagation();
                removeTech(tech);
              }}
              className='rounded px-1 text-muted hover:text-ink focus-visible:outline-2 focus-visible:outline-accent'
            >
              <span aria-hidden='true'>×</span>
            </button>
          </span>
        ))}
        <input
          // Set the text in onChange, not onStateChange: Downshift calls the latter after render, which drops keystrokes.
          {...getInputProps(
            getDropdownProps({
              onChange: (event: ChangeEvent<HTMLInputElement>) => setInputValue(event.currentTarget.value),
            }),
          )}
          placeholder='Search a technology…'
          className='min-w-[10rem] flex-1 bg-transparent px-1 py-0.5 text-sm text-ink outline-none placeholder:text-muted'
        />
      </div>
      <ul
        {...getMenuProps()}
        className={[
          'absolute top-full right-0 left-0 z-20 mt-1 max-h-72 overflow-auto rounded-lg border border-line bg-surface p-1 shadow-lg',
          isOpen && (items.length > 0 || showEmpty) ? '' : 'hidden',
        ].join(' ')}
      >
        {isOpen &&
          items.map((item, position) => (
            <li
              key={item.id}
              {...getItemProps({ item, index: position })}
              className={[
                'cursor-pointer rounded-md px-3 py-2 text-sm',
                highlightedIndex === position ? 'bg-surface-2 text-ink' : 'text-ink-2',
              ].join(' ')}
            >
              {item.label} · {item.count}
            </li>
          ))}
        {showEmpty && <li className='px-3 py-2 text-sm text-muted'>No technologies match</li>}
      </ul>
    </div>
  );
}

export default TechCombobox;
