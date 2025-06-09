import { allMenuThunks } from './menuEffects';
import { allPlayerThunks } from './playerEffects';
import { allSearchThunks } from './searchEffects';
import { allTransThunks } from './transEffects';

// Combine all into a single export
export const allEffectThunks = {
  ...allMenuThunks,
  ...allPlayerThunks,
  ...allSearchThunks,
  ...allTransThunks,
};