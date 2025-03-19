import { cthttp } from '../request';

// ------------------------------------------------------------
// Glossary: Glossary Entries
// ------------------------------------------------------------


// GET 

export function getGlossary(offeringId) {
  return cthttp.get(`Glossary/ByOffering?offeringId=${offeringId}`);
}