let csvData: Array<{ [key: string]: string }> = [];

function setCsvData(data: Array<{ [key: string]: string }>) {
  csvData = data;
}

function getCsvData() {
  return csvData;
}

export { setCsvData, getCsvData };