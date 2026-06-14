import piexif from 'piexifjs';
import { PDFDocument } from 'pdf-lib';

/**
 * Injects "Processed by ImageToolStack.com" into the metadata of the provided Blob.
 * Supports JPEG (via EXIF Software tag) and PDF (via Producer/Creator metadata).
 * If the format is not supported or injection fails, it silently returns the original blob.
 * 
 * @param blob The file Blob to process
 * @param mimeType The MIME type of the file (e.g. 'image/jpeg', 'application/pdf')
 * @returns A Promise resolving to the branded Blob (or the original if unsupported)
 */
export async function injectBrandingMetadata(blob: Blob, mimeType: string): Promise<Blob> {
  try {
    if (mimeType === 'image/jpeg' || mimeType === 'image/jpg') {
      return await injectJpegMetadata(blob);
    } 
    
    if (mimeType === 'application/pdf') {
      return await injectPdfMetadata(blob);
    }

    // Return original if unsupported format (e.g., PNG, WebP)
    return blob;
  } catch (error) {
    console.error("Failed to inject metadata, returning original file:", error);
    return blob;
  }
}

async function injectJpegMetadata(blob: Blob): Promise<Blob> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const dataUrl = e.target?.result as string;
        
        // Ensure it's a valid JPEG data URL
        if (!dataUrl || !dataUrl.startsWith('data:image/jpeg')) {
          return resolve(blob);
        }

        // Try to load existing EXIF, or create new if none exists
        let exifObj = {"0th": {}, "Exif": {}, "GPS": {}, "Interop": {}, "1st": {}, "thumbnail": null};
        try {
          exifObj = piexif.load(dataUrl);
        } catch (e) {
          // No valid EXIF found, proceed with empty structure
        }

        // Inject the branding into the 0th IFD Software tag (Tag ID 305)
        exifObj["0th"][piexif.ImageIFD.Software] = "Processed by ImageToolStack.com";
        
        const exifBytes = piexif.dump(exifObj);
        const newDataUrl = piexif.insert(exifBytes, dataUrl);
        
        // Convert the new Data URL back to a Blob
        const byteString = atob(newDataUrl.split(',')[1]);
        const mimeString = newDataUrl.split(',')[0].split(':')[1].split(';')[0];
        const ab = new ArrayBuffer(byteString.length);
        const ia = new Uint8Array(ab);
        for (let i = 0; i < byteString.length; i++) {
          ia[i] = byteString.charCodeAt(i);
        }
        
        resolve(new Blob([ab], { type: mimeString }));
      } catch (err) {
        console.error("piexifjs error:", err);
        resolve(blob);
      }
    };
    reader.onerror = () => resolve(blob);
    reader.readAsDataURL(blob);
  });
}

async function injectPdfMetadata(blob: Blob): Promise<Blob> {
  try {
    const arrayBuffer = await blob.arrayBuffer();
    const pdfDoc = await PDFDocument.load(arrayBuffer);
    
    pdfDoc.setProducer('ImageToolStack.com');
    pdfDoc.setCreator('ImageToolStack.com');
    pdfDoc.setTitle(pdfDoc.getTitle() || 'Processed by ImageToolStack');
    
    const pdfBytes = await pdfDoc.save();
    return new Blob([pdfBytes], { type: 'application/pdf' });
  } catch (err) {
    console.error("pdf-lib error:", err);
    return blob;
  }
}
