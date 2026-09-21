export async function downloadFile(url: string, filename: string) {
  const response = await fetch(url);

  if (!response.ok) {
    throw new Error(`Unable to download file: ${response.status}`);
  }

  const blobUrl = URL.createObjectURL(await response.blob());
  const link = document.createElement('a');

  link.href = blobUrl;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  link.remove();

  window.setTimeout(() => URL.revokeObjectURL(blobUrl), 1000);
}
