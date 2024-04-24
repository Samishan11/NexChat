export function checkIfImageExists(url: string): Promise<boolean> {
  return new Promise((resolve) => {
    const img = new Image();
    img.src = url;

    if (img.complete) {
      resolve(true);
    } else {
      img.onload = () => {
        resolve(true);
      };

      img.onerror = () => {
        resolve(false);
      };
    }
  });
}
