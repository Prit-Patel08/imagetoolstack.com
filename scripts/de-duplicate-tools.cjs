const fs = require('fs');
const path = require('path');

const toolsPath = path.join(__dirname, '../src/data/tools.json');
const toolsData = JSON.parse(fs.readFileSync(toolsPath, 'utf8'));

function getUniqueBenefits(tool) {
  const inFmt = (tool.inputFormats && tool.inputFormats[0]) || 'Image';
  const outFmt = (tool.outputFormats && tool.outputFormats[0]) || 'Image';
  const name = tool.name;

  if (tool.categoryId === 'conversion') {
    return [
      `Local Processing: Convert your ${inFmt} files to ${outFmt} entirely in your browser using the ${name} with 0 server uploads.`,
      `Quality Retention: Leverage our optimized conversion algorithms to convert from ${inFmt} to ${outFmt} with minimal quality loss.`,
      `Zero Size Limitations: Process heavy ${inFmt} files instantly without any file size limits or queue delays on ${name}.`
    ];
  } else if (tool.slug.includes('compress')) {
    return [
      `Advanced Reduction: Compress image bytes locally using ${name} to maximize site loading speeds and enhance Core Web Vitals.`,
      `Client-Side Control: Adjust quality values and output dimensions in-browser without sending your files to remote servers.`,
      `Format Preservation: Compact your assets with ${name} while preserving transparent background channels and metadata layouts.`
    ];
  } else if (tool.slug.includes('resiz') || tool.slug.includes('crop') || tool.slug.includes('ratio')) {
    return [
      `Dimension Control: Resize your images to specific width and height dimensions with sub-pixel precision using ${name}.`,
      `Ratio Locking: Maintain or lock aspect ratios on ${name} to prevent warping, stretching, or pixelation during resizing.`,
      `Instant Previews: View cropping boundaries and canvas limits in real-time before saving the output image from ${name}.`
    ];
  } else if (tool.categoryId === 'pdf') {
    return [
      `Document Security: Merge, split, or compress PDF files locally on the secure ${name} without exposing sensitive legal or personal information.`,
      `Page-Level Precision: Rearrange pages, adjust orientation, or extract specific sheets with simple controls in ${name}.`,
      `High Compatibility: Output standards-compliant PDF documents compatible with all modern readers, forms, and printers via ${name}.`
    ];
  } else if (tool.slug.includes('color') || tool.slug.includes('cmyk') || tool.slug.includes('palette')) {
    return [
      `Pixel-Perfect Sampling: Sample exact colors from your uploaded images using canvas pointer coordinates in ${name}.`,
      `Format Swapping: Instantly swap color values between HEX, RGB, HSL, and CMYK color spaces inside ${name}.`,
      `Palette Extraction: Automatically isolate dominant and complementary colors to build clean design schemas with ${name}.`
    ];
  } else {
    return [
      `Offline Processing: Analyze and manipulate your files 100% locally on your machine with no server overhead using ${name}.`,
      `Streamlined Utilities: Get the exact results you need with ${name} without dealing with bloated user interfaces or ads.`,
      `Secure Workflows: Securely edit, read, or clean your assets knowing your original files never leave your device on ${name}.`
    ];
  }
}

function getUniqueSteps(tool) {
  const inFmt = (tool.inputFormats && tool.inputFormats[0]) || 'Image';
  const outFmt = (tool.outputFormats && tool.outputFormats[0]) || 'Image';
  const name = tool.name;

  if (tool.categoryId === 'conversion') {
    return [
      `Drag and drop or select your active ${inFmt} file from your device into the ${name} workspace.`,
      `Verify that the local file reader of ${name} has parsed your ${inFmt} image successfully.`,
      `Choose any custom settings (like output format or quality) if available in ${name}.`,
      `Click the main button to run the browser-based ${inFmt}-to-${outFmt} conversion on ${name}.`,
      `Click the Download button to save the newly generated ${outFmt} image directly from ${name}.`
    ];
  } else if (tool.slug.includes('compress')) {
    return [
      `Upload the heavy image file that you want to optimize for web delivery to the ${name} workspace.`,
      `Select your target compression strength or quality slider value inside ${name}.`,
      `Click the Compress button to run local pixel optimization via the ${name} engine.`,
      `Review the estimated file size reduction and quality preview on ${name}.`,
      `Download the optimized file directly to your local storage from ${name}.`
    ];
  } else if (tool.slug.includes('resiz') || tool.slug.includes('crop') || tool.slug.includes('ratio')) {
    return [
      `Upload your image file to initialize the ${name} resizing grid.`,
      `Specify your target width/height in pixels or select a preset aspect ratio on ${name}.`,
      `Adjust the cropping box overlay to select the focus area of the photo using ${name}.`,
      `Click the Resize/Crop button to execute the canvas-level transformation on ${name}.`,
      `Save and download your newly scaled image from ${name} to your computer.`
    ];
  } else if (tool.categoryId === 'pdf') {
    return [
      `Select and upload your PDF documents to the browser-based ${name} reader.`,
      `Arrange the pages, select specific split ranges, or adjust orientation values in ${name}.`,
      `Click the action button to process the PDF structure locally using ${name}.`,
      `Wait a moment for the ${name} JavaScript layout engine to compile the document.`,
      `Download the finalized PDF file securely from ${name} without any data leaving your device.`
    ];
  } else if (tool.slug.includes('color') || tool.slug.includes('cmyk') || tool.slug.includes('palette')) {
    return [
      `Upload your reference graphic or image to the ${name} workspace canvas.`,
      `Hover your cursor or click on any section of the image to pick the pixel color using ${name}.`,
      `Inspect the automatically generated color codes (HEX, RGB, HSL, CMYK) on ${name}.`,
      `Copy the values to your clipboard or download the extracted color palette from ${name}.`,
      `Reset the ${name} canvas to pick colors from a different reference file.`
    ];
  } else {
    return [
      `Upload the image or utility file you wish to process or analyze using ${name}.`,
      `Adjust the tool-specific sliders, parameters, or selection options on ${name}.`,
      `Initiate the local processing script by clicking the process button in ${name}.`,
      `Preview the output parameters, metadata fields, or visual changes in-browser on ${name}.`,
      `Click Download to save the processed file securely to your device from ${name}.`
    ];
  }
}

function getUniqueFaqs(tool) {
  const inFmt = (tool.inputFormats && tool.inputFormats[0]) || 'Image';
  const outFmt = (tool.outputFormats && tool.outputFormats[0]) || 'Image';
  const name = tool.name;

  const faqs = [
    {
      q: `Is my file safe when using the ${name}?`,
      a: `Yes, completely. The ${name} runs entirely on your local machine using client-side JavaScript. Your images or documents are read directly into browser memory and are never uploaded to any server, ensuring 100% privacy.`
    }
  ];

  if (tool.categoryId === 'conversion') {
    faqs.push(
      {
        q: `Will converting ${inFmt} to ${outFmt} reduce quality on ${name}?`,
        a: `It depends on the compression type. Converting to a lossy format (like JPG) discards some visual data that is invisible to the human eye to save space. Converting to a lossless format (like PNG) preserves 100% of the pixel data perfectly.`
      },
      {
        q: `Are there file size limits on the ${inFmt} files I can upload to ${name}?`,
        a: `No. Unlike online converters that process files on remote servers, the ${name} runs on your computer. Your conversion speed and size limits depend entirely on your device's memory and processor.`
      }
    );
  } else if (tool.slug.includes('compress')) {
    faqs.push(
      {
        q: `How does local image compression work in ${name}?`,
        a: `The ${name} draws your image onto a canvas element and uses the browser's native API to re-encode it at a lower quality ratio. This discards high-frequency pixel details, reducing file size while keeping the visual look unchanged.`
      },
      {
        q: `Will the ${name} strip my image's EXIF metadata?`,
        a: `Yes. Standard canvas re-encoding in the ${name} automatically strips camera details, GPS coordinates, and other EXIF metadata. If you want to keep metadata, use a specialized tool, but for web delivery, stripping it is recommended to save extra bytes.`
      }
    );
  } else if (tool.slug.includes('resiz') || tool.slug.includes('crop') || tool.slug.includes('ratio')) {
    faqs.push(
      {
        q: `What is the difference between resizing and cropping in ${name}?`,
        a: `Resizing scales the entire image up or down, which can change its aspect ratio if not locked. Cropping cuts away the outer borders of the image using the ${name} crop grid to fit a specific shape or frame without shrinking the remaining details.`
      },
      {
        q: `Will my image look blurry after resizing on ${name}?`,
        a: `If you resize an image to smaller dimensions, it will remain sharp. However, scaling an image up beyond its original dimensions on ${name} will cause pixelation and blurriness because the browser has to estimate missing pixel data.`
      }
    );
  } else if (tool.categoryId === 'pdf') {
    faqs.push(
      {
        q: `Do I need to install Adobe Acrobat to use the ${name}?`,
        a: `No. The ${name} is entirely web-based and runs in any modern browser. It uses open-source JavaScript libraries to modify the PDF structure locally without needing external software.`
      },
      {
        q: `Can I edit scanned PDF documents in the ${name}?`,
        a: `You can merge, split, delete, or rotate scanned PDF pages using the ${name}. However, editing text inside a scanned PDF page requires OCR (Optical Character Recognition) to translate the image back into selectable text.`
      }
    );
  } else {
    faqs.push(
      {
        q: `Does the ${name} work offline?`,
        a: `Yes. Once the ${name} is loaded in your browser, the script runs entirely on your local machine. You can disconnect from the internet and the tool will continue to process your files successfully.`
      },
      {
        q: `Which browsers support the ${name}?`,
        a: `All modern browsers—including Google Chrome, Apple Safari, Mozilla Firefox, and Microsoft Edge—fully support the ${name} client-side processing tools.`
      }
    );
  }

  return faqs;
}

// Generate smart relatedTools internal link graphs
function populateRelatedTools() {
  const tools = toolsData.tools;

  tools.forEach(currentTool => {
    // Score all other tools to find the best 4 related tools
    const currentInputs = currentTool.inputFormats || [];
    const currentOutputs = currentTool.outputFormats || [];

    const scored = tools
      .filter(other => other.slug !== currentTool.slug)
      .map(other => {
        let score = 0;

        // Weight 1: Category Match
        if (other.categoryId === currentTool.categoryId) {
          score += 12;
        }

        // Weight 2: Input Format Match
        const otherInputs = other.inputFormats || [];
        const sharedInputs = otherInputs.filter(fmt => currentInputs.includes(fmt));
        score += sharedInputs.length * 3;

        // Weight 3: Output Format Match
        const otherOutputs = other.outputFormats || [];
        const sharedOutputs = otherOutputs.filter(fmt => currentOutputs.includes(fmt));
        score += sharedOutputs.length * 3;

        // Weight 4: Reverse action matching (e.g. png-to-jpg vs jpg-to-png)
        if (currentTool.categoryId === 'conversion' && other.categoryId === 'conversion') {
          const cIn = currentInputs[0];
          const cOut = currentOutputs[0];
          const oIn = otherInputs[0];
          const oOut = otherOutputs[0];
          if (cIn && cOut && oIn && oOut && cIn === oOut && cOut === oIn) {
            score += 15; // Highly relevant reverse tool
          }
        }

        // Weight 5: Specific PDF similarity
        if (currentTool.categoryId === 'pdf' && other.categoryId === 'pdf') {
          if (currentTool.slug.includes('pdf') && other.slug.includes('pdf')) {
            score += 5;
          }
        }

        return { tool: other, score };
      });

    // Sort by score descending and take the top 4
    scored.sort((a, b) => b.score - a.score);
    currentTool.relatedTools = scored.slice(0, 4).map(s => s.tool.slug);
  });
}

// Map over all tools, clean up keys, and rewrite unique copy
toolsData.tools.forEach(tool => {
  // 1. Rewrite benefits
  tool.benefits = getUniqueBenefits(tool);

  // 2. Rewrite steps
  tool.howToSteps = getUniqueSteps(tool);
  if (tool.howItWorks) {
    delete tool.howItWorks; // Clean up old duplicate key
  }

  // 3. Rewrite FAQs and standardize under `faqs`
  tool.faqs = getUniqueFaqs(tool);
  if (tool.faq) {
    delete tool.faq; // Clean up old duplicate key
  }
});

// 4. Auto-populate relatedTools arrays
populateRelatedTools();

// Write back to tools.json
fs.writeFileSync(toolsPath, JSON.stringify(toolsData, null, 2), 'utf8');
console.log('Successfully de-duplicated tools.json benefits, steps, and FAQs!');
console.log('Successfully auto-populated relatedTools link graphs for all 164 tools.');
