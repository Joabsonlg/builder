/**
 * Convert an array to JSON
 *
 * @param array
 * @returns {null|string}
 */
const arrayToJSON = (array) => {
  try {
    return JSON.stringify(array, null, 2);
  } catch (error) {
    console.error("Erro ao converter para JSON:", error);
    return null;
  }
};

/**
 * Convert an array to JSON and download it
 *
 * @param array
 * @param filename
 */
const downloadJSON = (array, filename) => {
  const data = arrayToJSON(array);
  const blob = new Blob([data], {type: "application/json"});
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  URL.revokeObjectURL(url);
  document.body.removeChild(a);
};

export {arrayToJSON, downloadJSON};
