export function deleteDuplicates(input: any) {
  const outputMap = new Map(); // Using Map to store unique entries based on ObjectCode

  // Loop through the input array
  input?.forEach((item: any) => {
    const objectCode = item.ObjectCode;
    // Check if the ObjectCode is already in the outputMap
    if (!outputMap.has(objectCode)) {
      // If not, add it to the outputMap
      outputMap.set(objectCode, {
        ObjectCode: item.ObjectCode,
        so_ObjectName: item.so_ObjectName || item.ObjectName,
        ObjectType: item.ObjectType,
      });
    }
  });

  // Convert the outputMap values to an array to get the desired output
  const output = Array.from(outputMap.values());
  return output;
}
