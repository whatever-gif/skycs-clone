export const removeDuplicateCampaigns = (inputArray: any) => {
  const uniqueData = [];
  const seenCampaignCodes = new Set();

  for (const item of inputArray) {
    if (!seenCampaignCodes?.has(item?.CampaignCode)) {
      seenCampaignCodes?.add(item?.CampaignCode);
      uniqueData?.push(item);
    }
  }

  return uniqueData;
};
