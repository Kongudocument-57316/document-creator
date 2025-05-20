// Mapping of relation type values to Tamil display text
export const relationTypes = {
  son: "மகன்",
  daughter: "மகள்",
  wife: "மனைவி",
  husband: "கணவர்",
  father: "தந்தை",
  mother: "தாய்",
}

// Function to get Tamil text for a relation type value
export function getRelationTypeText(type: string): string {
  return relationTypes[type] || type
}
