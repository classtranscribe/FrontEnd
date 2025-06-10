import { allMenuThunks } from './menuThunks';
import { allPlayerThunks } from './playerThunks';
import { allSearchThunks } from './searchThunks';
import { allTransThunks } from './transThunks';

// Combine all into a single export
export const allEffectThunks = {
  ...allMenuThunks,
  ...allPlayerThunks,
  ...allSearchThunks,
  ...allTransThunks,
};