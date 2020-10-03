import { getUserMetaData, postUserMetaData } from './entities/Account';

/**
 * Offering Starred
 */
function getStarredOfferingsArray(starredOfferings) {
  return Object.keys(starredOfferings);
}

export async function storeUserMetadata({
  // setOnboarded,
  setStarredOfferings,
  setStarredOfferingsArray,
}) {
  // Get all userMetadata
  try {
    const userMetadata = await getUserMetaData();
    let { starredOfferings = JSON.stringify({}), metadata } = userMetadata.data || {};
    if (metadata && metadata.starredOfferings) {
      postUserMetaData(metadata);
      starredOfferings = metadata.starredOfferings;
    }

    starredOfferings = JSON.parse(starredOfferings);
    // Parse into array
    let starredOfferingsArray = [];
    if (setStarredOfferingsArray)
      starredOfferingsArray = getStarredOfferingsArray(starredOfferings);

    // console.log('starredOfferings', starredOfferings)
    // console.log('starredOfferingsArray', starredOfferingsArray)

    // Set vars if needed
    if (setStarredOfferings) setStarredOfferings(starredOfferings || {});
    if (setStarredOfferingsArray) setStarredOfferingsArray(starredOfferingsArray);
  } catch (error) {
    console.error("Couldn't load user metadata.");
    if (setStarredOfferings) setStarredOfferings({});
    if (setStarredOfferingsArray) setStarredOfferingsArray([]);
  }
}
