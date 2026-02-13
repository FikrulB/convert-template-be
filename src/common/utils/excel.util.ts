export function getExcelColumnName(index: number): string {
  let name = '';
  while (index >= 0) {
    name = String.fromCharCode((index % 26) + 65) + name;
    index = Math.floor(index / 26) - 1;
  }
  return name;
}

export function getExcelColumnIndex(name: string): number {
  console.log('name ', name);
  return name.charCodeAt(0);
  //   while (index >= 0) {
  //     name = String.fromCharCode((index % 26) + 65) + name;
  //     index = Math.floor(index / 26) - 1;
  //   }
  //   return name;
}
