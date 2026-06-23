import { translations, type Locale, defaultLocale } from '../data/translations';

export function getTranslations(locale: string) {
  const cleanLocale = (locale || defaultLocale) as Locale;
  return translations[cleanLocale] || translations[defaultLocale];
}

/**
 * Returns the localized path prefixing the locale, stripping any existing locale first.
 */
export function getLocalizedPath(path: string, locale: string): string {
  const cleanLocale = locale || defaultLocale;
  const locales = ['es', 'fr', 'de', 'pt', 'id'];
  
  // 1. Strip any existing locale prefix
  let basePath = path;
  const localeRegex = new RegExp(`^\\/(${locales.join('|')})($|\\/)`);
  const matchedLocale = basePath.match(localeRegex);
  if (matchedLocale) {
    basePath = basePath.replace(localeRegex, '/');
  }
  
  // 2. Add the new locale prefix if it's not the default one
  if (cleanLocale === defaultLocale) {
    return basePath;
  }
  
  const cleanBasePath = basePath.replace(/^\//, '').replace(/\/$/, '');
  return `/${cleanLocale}${cleanBasePath ? '/' + cleanBasePath : ''}`;
}

/**
 * Translates a tool category name and description.
 */
export function translateCategory(category: any, locale: string) {
  const t = getTranslations(locale);
  const catKey = category.id as keyof typeof t.categories;
  if (t.categories && t.categories[catKey]) {
    return {
      ...category,
      name: t.categories[catKey].name,
      description: t.categories[catKey].description,
    };
  }
  return category;
}

/**
 * Dynamically localizes any tool object from tools.json at build time.
 */
export function translateTool(tool: any, locale: string) {
  const t = getTranslations(locale);
  const cleanLocale = locale || defaultLocale;
  
  // Create copy
  const localized = { ...tool };

  // 1. Resolve localized name and description
  let name = tool.name;
  let description = tool.description;

  // Try custom dictionary lookup
  // @ts-ignore
  if (t.toolNames && t.toolNames[tool.slug]) {
    // @ts-ignore
    name = t.toolNames[tool.slug];
  } else {
    // If format converter, construct dynamically
    const converterMatch = tool.slug.match(/^([a-z0-9]+)-to-([a-z0-9]+)$/);
    if (converterMatch) {
      const f1 = converterMatch[1].toUpperCase();
      const f2 = converterMatch[2].toUpperCase();
      if (cleanLocale === 'es') name = `Convertidor de ${f1} a ${f2}`;
      else if (cleanLocale === 'fr') name = `Convertisseur ${f1} en ${f2}`;
      else if (cleanLocale === 'de') name = `${f1}-zu-${f2}-Konverter`;
      else if (cleanLocale === 'pt') name = `Conversor de ${f1} para ${f2}`;
      else if (cleanLocale === 'id') name = `Konverter ${f1} ke ${f2}`;
    }
  }

  // @ts-ignore
  if (t.toolDescriptions && t.toolDescriptions[tool.slug]) {
    // @ts-ignore
    description = t.toolDescriptions[tool.slug];
  } else {
    const converterMatch = tool.slug.match(/^([a-z0-9]+)-to-([a-z0-9]+)$/);
    if (converterMatch) {
      const f1 = converterMatch[1].toUpperCase();
      const f2 = converterMatch[2].toUpperCase();
      if (cleanLocale === 'es') description = `Convierta archivos ${f1} a ${f2} en línea de forma gratuita. Calidad sin pérdidas, rápido y 100% privado.`;
      else if (cleanLocale === 'fr') description = `Convertissez des fichiers ${f1} en ${f2} en ligne gratuitement. Qualité sans perte, rapide et 100% privé.`;
      else if (cleanLocale === 'de') description = `Konvertieren Sie ${f1}-Dateien zu ${f2} online kostenlos. Verlustfreie Qualität, schnell und absolut privat.`;
      else if (cleanLocale === 'pt') description = `Converta arquivos ${f1} para ${f2} online gratuitamente. Qualidade sem perdas, rápido e 100% privado.`;
      else if (cleanLocale === 'id') description = `Konversikan file ${f1} ke ${f2} secara online gratis. Kualitas tanpa kerugian, cepat, dan 100% privat.`;
    }
  }

  localized.name = name;
  localized.description = description;

  // 2. Set SEO Title and Meta Description
  if (tool.categoryId === 'conversion') {
    const inFmt = tool.inputFormats?.join(', ') || 'Image';
    const outFmt = tool.outputFormats?.join(', ') || 'Image';
    if (cleanLocale === 'es') {
      localized.seoTitle = `El mejor convertidor de ${inFmt} a ${outFmt} en línea | Gratis y sin límites`;
      localized.seoDescription = `Convierta ${inFmt} a ${outFmt} en línea de forma gratuita. 100% basado en el navegador, sin límites, rápido y privado.`;
    } else if (cleanLocale === 'fr') {
      localized.seoTitle = `Meilleur convertisseur ${inFmt} en ${outFmt} en ligne | Gratuit & Sans limites`;
      localized.seoDescription = `Convertissez ${inFmt} en ${outFmt} en ligne gratuitement. Traitement 100% local, sans limite, rapide et privé.`;
    } else if (cleanLocale === 'de') {
      localized.seoTitle = `Bester ${inFmt}-zu-${outFmt}-Konverter online | Kostenlos & Keine Limits`;
      localized.seoDescription = `Konvertieren Sie ${inFmt} zu ${outFmt} online kostenlos. 100% browserbasiert, keine Limits, schnell und sicher.`;
    } else if (cleanLocale === 'pt') {
      localized.seoTitle = `Melhor conversor de ${inFmt} para ${outFmt} online | Grátis e sem limites`;
      localized.seoDescription = `Converta ${inFmt} para ${outFmt} online gratuitamente. Processamento 100% no navegador, sem limite, rápido e privado.`;
    } else if (cleanLocale === 'id') {
      localized.seoTitle = `Konverter ${inFmt} ke ${outFmt} Online Terbaik | Gratis & Tanpa Batas`;
      localized.seoDescription = `Konversikan ${inFmt} ke ${outFmt} online secara gratis. 100% berbasis browser, tanpa batas, cepat, dan privat.`;
    } else {
      localized.seoTitle = `Best ${inFmt} to ${outFmt} Converter Online | Free & No Limits`;
      localized.seoDescription = `Best online ${inFmt} to ${outFmt} converter. Process files instantly in your browser without uploads. 100% Free, secure, and fast.`;
    }
  } else {
    if (cleanLocale === 'es') {
      localized.seoTitle = `Herramienta ${name} en línea gratis | 100% Libre y Seguro`;
      localized.seoDescription = `${description} Procesamiento seguro local en el navegador, sin necesidad de registro ni descargas extras.`;
    } else if (cleanLocale === 'fr') {
      localized.seoTitle = `Outil ${name} en ligne gratuit | 100% Libre & Sécurisé`;
      localized.seoDescription = `${description} Traitement local sécurisé dans le navigateur. Pas besoin de s'inscrire ni d'installer de logiciel.`;
    } else if (cleanLocale === 'de') {
      localized.seoTitle = `${name} online kostenlos | 100% Frei & Sicher`;
      localized.seoDescription = `${description} Sichere lokale Verarbeitung im Webbrowser. Keine Registrierung oder Softwareinstallation erforderlich.`;
    } else if (cleanLocale === 'pt') {
      localized.seoTitle = `Ferramenta ${name} online grátis | 100% Livre e Seguro`;
      localized.seoDescription = `${description} Processamento local seguro no navegador. Não requer registro ou instalações adicionais.`;
    } else if (cleanLocale === 'id') {
      localized.seoTitle = `Alat ${name} Online Gratis | 100% Bebas & Aman`;
      localized.seoDescription = `${description} Pemrosesan lokal yang aman langsung di browser. Tanpa registrasi atau instalasi perangkat lunak.`;
    } else {
      localized.seoTitle = `${name} Online — 100% Free & Private [Secure]`;
      localized.seoDescription = `${description} Secure client-side processing in your browser. No registration or software downloads required. 100% free.`;
    }
  }

  // 3. Inject dynamic lists from templates
  const inFmt = tool.inputFormats?.[0] || 'file';
  const outFmt = tool.outputFormats?.[0] || 'file';
  const inFmtsStr = tool.inputFormats?.join(', ') || 'supported formats';
  const action = tool.categoryId === 'conversion' ? `Convert to ${outFmt}` : (tool.categoryId === 'pdf' ? 'Process PDF' : 'Apply Changes');

  // Steps
  if (t.toolTemplates?.howToSteps?.steps) {
    localized.howToSteps = t.toolTemplates.howToSteps.steps.map(step => 
      step.replace(/{inFmt}/g, inFmt)
          .replace(/{outFmt}/g, outFmt)
          .replace(/{inFmtsStr}/g, inFmtsStr)
          .replace(/{action}/g, action)
    );
  }

  // Benefits
  if (t.toolTemplates?.benefits?.items) {
    localized.benefits = t.toolTemplates.benefits.items.map(b => 
      b.replace(/{inFmt}/g, inFmt)
       .replace(/{outFmt}/g, outFmt)
       .replace(/{toolName}/g, name)
    );
  }

  // Use cases
  if (t.toolTemplates?.useCases?.items) {
    localized.useCases = t.toolTemplates.useCases.items.map(uc => 
      uc.replace(/{inFmt}/g, inFmt)
        .replace(/{outFmt}/g, outFmt)
        .replace(/{toolName}/g, name)
    );
  }

  // FAQs
  if (t.toolTemplates?.faqs?.items) {
    localized.faqs = t.toolTemplates.faqs.items.map(faq => ({
      q: faq.q.replace(/{toolName}/g, name)
             .replace(/{inFmt}/g, inFmt),
      a: faq.a.replace(/{toolName}/g, name)
             .replace(/{inFmt}/g, inFmt)
             .replace(/{outFmt}/g, outFmt)
    }));
  }

  return localized;
}

export function translateCapabilityValue(val: string, locale: string): string {
  if (!val) return val;
  const cleanLocale = locale || 'en';
  if (cleanLocale === 'en') return val;

  const dictionary: Record<string, Record<string, string>> = {
    es: {
      "Lossy": "Con pérdidas",
      "Lossless": "Sin pérdidas",
      "No": "No",
      "Yes": "Sí",
      "None": "Ninguno",
      "Native (Universal)": "Nativo (Universal)",
      "Unsupported": "No soportado",
      "Various": "Varios",
      "Hybrid": "Híbrido",
      "Digital Photographs": "Fotografías digitales",
      "Web Graphics, Transparent Logos, Screenshots": "Gráficos web, logotipos transparentes, capturas de pantalla",
      "Icons, Vector Logos, Responsive Illustrations": "Iconos, logotipos vectoriales, ilustraciones adaptables",
      "Modern Web Design, Page Speed Optimization": "Diseño web moderno, optimización de velocidad de página",
      "Next-generation High Efficiency Web Images": "Imágenes web de alta eficiencia de próxima generación",
      "Print layouts, Document Sharing, Forms": "Diseños de impresión, intercambio de documentos, formularios",
      "High-Quality Master Files, Printing, Archiving": "Archivos maestros de alta calidad, impresión, archivo",
      "High-efficiency Apple Device Photo Storage": "Almacenamiento de fotos de alta eficiencia para dispositivos Apple",
      "Vector Graphics, Commercial Printing": "Gráficos vectoriales, impresión comercial",
      "Complex Digital Photos, Web Content": "Fotos digitales complejas, contenido web",
      "Medical Imaging, Digital Archives": "Imágenes médicas, archivos digitales",
      "Lossy (DCT)": "Con pérdidas (DCT)",
      "Lossy & Lossless": "Con y sin pérdidas",
      "Yes (Alpha Channel)": "Sí (Canal alfa)",
      "Yes (Vector Paths)": "Sí (Rutas vectoriales)",
      "Yes (Vector)": "Sí (Vectorial)",
      "Yes (Hybrid)": "Sí (Híbrido)",
      "Yes (WebP Animation)": "Sí (Animación WebP)",
      "Yes (AVIFS)": "Sí (AVIFS)",
      "Yes (XML-based)": "Sí (Basado en XML)",
      "Lossless (DEFLATE)": "Sin pérdidas (DEFLATE)",
      "None (Vector Coordinates)": "Ninguno (Coordenadas vectoriales)",
      "Lossless (LZW/ZIP/Uncompressed)": "Sin pérdidas (LZW/ZIP/Sin compresión)",
      "Lossy (HEVC/H.265)": "Con pérdidas (HEVC/H.265)",
      "Unsupported (Requires Conversion)": "No soportado (Requiere conversión)",
      "Unsupported (iOS Native Only)": "No soportado (Nativo de iOS solamente)",
      "Unsupported (Vector Editor Needed)": "No soportado (Se necesita editor vectorial)",
      "Unsupported (Safari Only)": "No soportado (Safari solamente)",
      "Lossy & Lossless (VP8/VP8L)": "Con y sin pérdidas (VP8/VP8L)",
      "Lossy & Lossless (AV1-based)": "Con y sin pérdidas (Basado en AV1)",
      "Lossy & Lossless (Wavelet)": "Con y sin pérdidas (Wavelet)"
    },
    fr: {
      "Lossy": "Avec perte",
      "Lossless": "Sans perte",
      "No": "Non",
      "Yes": "Oui",
      "None": "Aucun",
      "Native (Universal)": "Natif (Universel)",
      "Unsupported": "Non pris en charge",
      "Various": "Divers",
      "Hybrid": "Hybride",
      "Digital Photographs": "Photographies numériques",
      "Web Graphics, Transparent Logos, Screenshots": "Graphismes web, logos transparents, captures d'écran",
      "Icons, Vector Logos, Responsive Illustrations": "Icônes, logos vectoriels, illustrations réactives",
      "Modern Web Design, Page Speed Optimization": "Design web moderne, optimisation de vitesse",
      "Next-generation High Efficiency Web Images": "Images web haute efficacité de nouvelle génération",
      "Print layouts, Document Sharing, Forms": "Mises en page d'impression, partage de documents, formulaires",
      "High-Quality Master Files, Printing, Archiving": "Fichiers maîtres haute qualité, impression, archivage",
      "High-efficiency Apple Device Photo Storage": "Stockage photo haute efficacité pour appareils Apple",
      "Vector Graphics, Commercial Printing": "Graphismes vectoriels, impression commerciale",
      "Complex Digital Photos, Web Content": "Photos numériques complexes, contenu web",
      "Medical Imaging, Digital Archives": "Imagerie médicale, archives numériques",
      "Lossy (DCT)": "Avec perte (DCT)",
      "Lossy & Lossless": "Avec & sans perte",
      "Yes (Alpha Channel)": "Oui (Canal alpha)",
      "Yes (Vector Paths)": "Oui (Chemins vectoriels)",
      "Yes (Vector)": "Oui (Vectoriel)",
      "Yes (Hybrid)": "Oui (Hybride)",
      "Yes (WebP Animation)": "Oui (Animation WebP)",
      "Yes (AVIFS)": "Oui (AVIFS)",
      "Yes (XML-based)": "Oui (Basé sur XML)",
      "Lossless (DEFLATE)": "Sans perte (DEFLATE)",
      "None (Vector Coordinates)": "Aucun (Coordonnées vectorielles)",
      "Lossless (LZW/ZIP/Non compressé)": "Sans perte (LZW/ZIP/Non compressé)",
      "Lossless (LZW/ZIP/Uncompressed)": "Sans perte (LZW/ZIP/Non compressé)",
      "Lossy (HEVC/H.265)": "Avec perte (HEVC/H.265)",
      "Unsupported (Requires Conversion)": "Non pris en charge (Requis conversion)",
      "Unsupported (iOS Native Only)": "Non pris en charge (Natif iOS uniquement)",
      "Unsupported (Vector Editor Needed)": "Non pris en charge (Éditeur vectoriel requis)",
      "Unsupported (Safari Only)": "Non pris en charge (Safari uniquement)",
      "Lossy & Lossless (VP8/VP8L)": "Avec & sans perte (VP8/VP8L)",
      "Lossy & Lossless (AV1-based)": "Avec & sans perte (Basé sur AV1)",
      "Lossy & Lossless (Wavelet)": "Avec & sans perte (Wavelet)"
    },
    de: {
      "Lossy": "Verlustbehaftet",
      "Lossless": "Verlustfrei",
      "No": "Nein",
      "Yes": "Ja",
      "None": "Keine",
      "Native (Universal)": "Nativ (Universell)",
      "Unsupported": "Nicht unterstützt",
      "Various": "Verschiedene",
      "Hybrid": "Hybrid",
      "Digital Photographs": "Digitale Fotografien",
      "Web Graphics, Transparent Logos, Screenshots": "Webgrafiken, transparente Logos, Screenshots",
      "Icons, Vector Logos, Responsive Illustrations": "Icons, Vektorlogos, responsive Illustrationen",
      "Modern Web Design, Page Speed Optimization": "Modernes Webdesign, Ladezeit-Optimierung",
      "Next-generation High Efficiency Web Images": "Hocheffiziente Webbilder der nächsten Generation",
      "Print layouts, Document Sharing, Forms": "Drucklayouts, Dokumentenfreigabe, Formulare",
      "High-Quality Master Files, Printing, Archiving": "Hochwertige Masterdateien, Druck, Archivierung",
      "High-efficiency Apple Device Photo Storage": "Hocheffizienter Fotospeicher für Apple-Geräte",
      "Vector Graphics, Commercial Printing": "Vektorgrafiken, kommerzieller Druck",
      "Complex Digital Photos, Web Content": "Komplexe digitale Fotos, Webinhalte",
      "Medical Imaging, Digital Archives": "Medizinische Bildgebung, digitale Archive",
      "Lossy (DCT)": "Verlustbehaftet (DCT)",
      "Lossy & Lossless": "Verlustbehaftet & Verlustfrei",
      "Yes (Alpha Channel)": "Ja (Alphakanal)",
      "Yes (Vector Paths)": "Ja (Vektorpfade)",
      "Yes (Vector)": "Ja (Vektor)",
      "Yes (Hybrid)": "Ja (Hybrid)",
      "Yes (WebP Animation)": "Ja (WebP-Animation)",
      "Yes (AVIFS)": "Ja (AVIFS)",
      "Yes (XML-based)": "Ja (XML-basiert)",
      "Lossless (DEFLATE)": "Verlustfrei (DEFLATE)",
      "None (Vector Coordinates)": "Keine (Vektorkoordinaten)",
      "Lossless (LZW/ZIP/Uncompressed)": "Verlustfrei (LZW/ZIP/Unkomprimiert)",
      "Lossy (HEVC/H.265)": "Verlustbehaftet (HEVC/H.265)",
      "Unsupported (Requires Conversion)": "Nicht unterstützt (Erfordert Konvertierung)",
      "Unsupported (iOS Native Only)": "Nicht unterstützt (Nur iOS-nativ)",
      "Unsupported (Vector Editor Needed)": "Nicht unterstützt (Vektoreditor benötigt)",
      "Unsupported (Safari Only)": "Nicht unterstützt (Nur Safari)",
      "Lossy & Lossless (VP8/VP8L)": "Verlustbehaftet & Verlustfrei (VP8/VP8L)",
      "Lossy & Lossless (AV1-based)": "Verlustbehaftet & Verlustfrei (AV1-basiert)",
      "Lossy & Lossless (Wavelet)": "Verlustbehaftet & Verlustfrei (Wavelet)"
    },
    pt: {
      "Lossy": "Com perdas",
      "Lossless": "Sem perdas",
      "No": "Não",
      "Yes": "Sim",
      "None": "Nenhum",
      "Native (Universal)": "Nativo (Universal)",
      "Unsupported": "Não suportado",
      "Various": "Vários",
      "Hybrid": "Híbrido",
      "Digital Photographs": "Fotografias digitais",
      "Web Graphics, Transparent Logos, Screenshots": "Gráficos web, logotipos transparentes, capturas de tela",
      "Icons, Vector Logos, Responsive Illustrations": "Ícones, logotipos vetoriais, ilustrações responsivas",
      "Modern Web Design, Page Speed Optimization": "Design web moderno, otimização de velocidade",
      "Next-generation High Efficiency Web Images": "Imagens web de alta eficiência de próxima geração",
      "Print layouts, Document Sharing, Forms": "Layouts de impressão, compartilhamento de documentos, formulários",
      "High-Quality Master Files, Printing, Archiving": "Arquivos mestres de alta qualidade, impressão, arquivamento",
      "High-efficiency Apple Device Photo Storage": "Armazenamento de fotos de alta eficiência para dispositivos Apple",
      "Vector Graphics, Commercial Printing": "Gráficos vetoriais, impressão comercial",
      "Complex Digital Photos, Web Content": "Fotos digitais complexas, conteúdo web",
      "Medical Imaging, Digital Archives": "Imagens médicas, arquivos digitais",
      "Lossy (DCT)": "Com perdas (DCT)",
      "Lossy & Lossless": "Com e sem perdas",
      "Yes (Alpha Channel)": "Sim (Canal alfa)",
      "Yes (Vector Paths)": "Sim (Caminhos vetoriais)",
      "Yes (Vector)": "Sim (Vetorial)",
      "Yes (Hybrid)": "Sim (Híbrido)",
      "Yes (WebP Animation)": "Sim (Animação WebP)",
      "Yes (AVIFS)": "Sim (AVIFS)",
      "Yes (XML-based)": "Sim (Baseado em XML)",
      "Lossless (DEFLATE)": "Sem perdas (DEFLATE)",
      "None (Vector Coordinates)": "Nenhum (Coordenadas vetoriais)",
      "Lossless (LZW/ZIP/Uncompressed)": "Sem perdas (LZW/ZIP/Não compactado)",
      "Lossy (HEVC/H.265)": "Com perdas (HEVC/H.265)",
      "Unsupported (Requires Conversion)": "Não suportado (Requer conversão)",
      "Unsupported (iOS Native Only)": "Não suportado (Apenas nativo do iOS)",
      "Unsupported (Vector Editor Needed)": "Não suportado (Necessita de editor vetorial)",
      "Unsupported (Safari Only)": "Não suportado (Apenas Safari)",
      "Lossy & Lossless (VP8/VP8L)": "Com e sem perdas (VP8/VP8L)",
      "Lossy & Lossless (AV1-based)": "Com e sem perdas (Baseado em AV1)",
      "Lossy & Lossless (Wavelet)": "Com e sem perdas (Wavelet)"
    },
    id: {
      "Lossy": "Lossy (Dengan Kerugian)",
      "Lossless": "Lossless (Tanpa Kerugian)",
      "No": "Tidak",
      "Yes": "Ya",
      "None": "Tidak ada",
      "Native (Universal)": "Native (Universal)",
      "Unsupported": "Tidak didukung",
      "Various": "Berbagai macam",
      "Hybrid": "Hibrida",
      "Digital Photographs": "Foto Digital",
      "Web Graphics, Transparent Logos, Screenshots": "Grafik Web, Logo Transparan, Tangkapan Layar",
      "Icons, Vector Logos, Responsive Illustrations": "Ikon, Logo Vektor, Ilustrasi Responsif",
      "Modern Web Design, Page Speed Optimization": "Desain Web Modern, Pengoptimalan Kecepatan Halaman",
      "Next-generation High Efficiency Web Images": "Gambar Web Efisiensi Tinggi Generasi Berikutnya",
      "Print layouts, Document Sharing, Forms": "Tata letak cetak, Berbagi Dokumen, Formulir",
      "High-Quality Master Files, Printing, Archiving": "File Master Berkualitas Tinggi, Pencetakan, Pengarsipan",
      "High-efficiency Apple Device Photo Storage": "Penyimpanan Foto Perangkat Apple Efisiensi Tinggi",
      "Vector Graphics, Commercial Printing": "Grafik Vektor, Pencetakan Komersial",
      "Complex Digital Photos, Web Content": "Foto Digital Kompleks, Konten Web",
      "Medical Imaging, Digital Archives": "Pencitraan Medis, Arsip Digital",
      "Lossy (DCT)": "Lossy (DCT)",
      "Lossy & Lossless": "Lossy & Lossless",
      "Yes (Alpha Channel)": "Ya (Saluran Alfa)",
      "Yes (Vector Paths)": "Ya (Jalur Vektor)",
      "Yes (Vector)": "Ya (Vektor)",
      "Yes (Hybrid)": "Ya (Hibrida)",
      "Yes (WebP Animation)": "Ya (Animasi WebP)",
      "Yes (AVIFS)": "Ya (AVIFS)",
      "Yes (XML-based)": "Ya (Berbasis XML)",
      "Lossless (DEFLATE)": "Lossless (DEFLATE)",
      "None (Vector Coordinates)": "Tidak ada (Koordinat Vektor)",
      "Lossless (LZW/ZIP/Uncompressed)": "Lossless (LZW/ZIP/Tanpa Kompresi)",
      "Lossy (HEVC/H.265)": "Lossy (HEVC/H.265)",
      "Unsupported (Requires Conversion)": "Tidak didukung (Memerlukan Konversi)",
      "Unsupported (iOS Native Only)": "Tidak didukung (Hanya Perangkat iOS)",
      "Unsupported (Vector Editor Needed)": "Tidak didukung (Perlu Editor Vektor)",
      "Unsupported (Safari Only)": "Tidak didukung (Hanya Safari)",
      "Lossy & Lossless (VP8/VP8L)": "Lossy & Lossless (VP8/VP8L)",
      "Lossy & Lossless (AV1-based)": "Lossy & Lossless (Berbasis AV1)",
      "Lossy & Lossless (Wavelet)": "Lossy & Lossless (Wavelet)"
    }
  };

  return dictionary[cleanLocale]?.[val] || val;
}

export function translateComparisonSentence(text: string, locale: string): string {
  if (!text) return text;
  const cleanLocale = locale || 'en';
  if (cleanLocale === 'en') return text;

  let result = text;
  
  if (cleanLocale === 'es') {
    result = result.replace(/(\d+-\d+%) smaller than ([A-Za-z0-9]+)/gi, '$1 más pequeño que $2');
    result = result.replace(/(\d+%) smaller files than ([A-Za-z0-9]+)/gi, 'Archivos $1 más pequeños que $2');
    result = result.replace(/Supports transparency/gi, 'Soporta transparencia');
    result = result.replace(/Fewer compression artifacts/gi, 'Menos artefactos de compresión');
    result = result.replace(/Cannot be opened by older desktop apps/gi, 'No se puede abrir en aplicaciones de escritorio antiguas');
    result = result.replace(/Can be opened by any device or app/gi, 'Se puede abrir en cualquier dispositivo o aplicación');
    result = result.replace(/No alpha channel \(transparency\)/gi, 'Sin canal alfa (transparencia)');
    result = result.replace(/Poor compatibility outside Apple ecosystem/gi, 'Compatibilidad deficiente fuera del ecosistema de Apple');
    result = result.replace(/Requires conversion for most websites/gi, 'Requiere conversión para la mayoría de los sitios web');
  } else if (cleanLocale === 'fr') {
    result = result.replace(/(\d+-\d+%) smaller than ([A-Za-z0-9]+)/gi, '$1 plus petit que $2');
    result = result.replace(/(\d+%) smaller files than ([A-Za-z0-9]+)/gi, 'Fichiers $1 plus petits que $2');
    result = result.replace(/Supports transparency/gi, 'Prend en charge la transparence');
    result = result.replace(/Fewer compression artifacts/gi, 'Moins d\'artefacts de compression');
    result = result.replace(/Cannot be opened by older desktop apps/gi, 'Ne peut pas être ouvert par d\'ancienne applications de bureau');
    result = result.replace(/Can be opened by any device or app/gi, 'Peut être ouvert par n\'importe quel appareil ou application');
    result = result.replace(/No alpha channel \(transparency\)/gi, 'Pas de canal alpha (transparence)');
    result = result.replace(/Poor compatibility outside Apple ecosystem/gi, 'Compatibilité médiocre en dehors de l\'écosystème Apple');
    result = result.replace(/Requires conversion for most websites/gi, 'Nécessite une conversion pour la plupart des sites Web');
  } else if (cleanLocale === 'de') {
    result = result.replace(/(\d+-\d+%) smaller than ([A-Za-z0-9]+)/gi, '$1 kleiner als $2');
    result = result.replace(/(\d+%) smaller files than ([A-Za-z0-9]+)/gi, '$1 kleinere Dateien als $2');
    result = result.replace(/Supports transparency/gi, 'Unterstützt Transparenz');
    result = result.replace(/Fewer compression artifacts/gi, 'Weniger Kompressionsartefakte');
    result = result.replace(/Cannot be opened by older desktop apps/gi, 'Kann von älteren Desktop-Apps nicht geöffnet werden');
    result = result.replace(/Can be opened by any device or app/gi, 'Kann von jedem Gerät oder jeder App geöffnet werden');
    result = result.replace(/No alpha channel \(transparency\)/gi, 'Kein Alphakanal (Transparenz)');
    result = result.replace(/Poor compatibility outside Apple ecosystem/gi, 'Schlechte Kompatibilität außerhalb des Apple-Ökosystems');
    result = result.replace(/Requires conversion for most websites/gi, 'Erfordert Konvertierung für die meisten Websites');
  } else if (cleanLocale === 'pt') {
    result = result.replace(/(\d+-\d+%) smaller than ([A-Za-z0-9]+)/gi, '$1 menor que $2');
    result = result.replace(/(\d+%) smaller files than ([A-Za-z0-9]+)/gi, 'Arquivos $1 menores que $2');
    result = result.replace(/Supports transparency/gi, 'Suporta transparência');
    result = result.replace(/Fewer compression artifacts/gi, 'Menos artefatos de compressão');
    result = result.replace(/Cannot be opened by older desktop apps/gi, 'Não pode ser aberto por aplicativos de desktop antigos');
    result = result.replace(/Can be opened by any device or app/gi, 'Pode ser aberto por qualquer dispositivo ou aplicativo');
    result = result.replace(/No alpha channel \(transparency\)/gi, 'Sem canal alfa (transparência)');
    result = result.replace(/Poor compatibility outside Apple ecosystem/gi, 'Compatibilidade ruim fora do ecossistema Apple');
    result = result.replace(/Requires conversion for most websites/gi, 'Requer conversão para a maioria dos sites');
  } else if (cleanLocale === 'id') {
    result = result.replace(/(\d+-\d+%) smaller than ([A-Za-z0-9]+)/gi, '$1 lebih kecil dari $2');
    result = result.replace(/(\d+%) smaller files than ([A-Za-z0-9]+)/gi, 'File $1 lebih kecil dari $2');
    result = result.replace(/Supports transparency/gi, 'Mendukung transparansi');
    result = result.replace(/Fewer compression artifacts/gi, 'Lebih sedikit artefak kompresi');
    result = result.replace(/Cannot be opened by older desktop apps/gi, 'Tidak dapat dibuka oleh aplikasi desktop lama');
    result = result.replace(/Can be opened by any device or app/gi, 'Dapat dibuka oleh perangkat atau aplikasi apa pun');
    result = result.replace(/No alpha channel \(transparency\)/gi, 'Tanpa saluran alfa (transparansi)');
    result = result.replace(/Poor compatibility outside Apple ecosystem/gi, 'Kompatibilitas buruk di luar ekosistem Apple');
    result = result.replace(/Requires conversion for most websites/gi, 'Memerlukan konversi untuk sebagian besar situs web');
  }
  
  return result;
}

export function translateComparison(comp: any, locale: string) {
  const cleanLocale = locale || 'en';
  if (cleanLocale === 'en') return comp;

  const localized = { ...comp };
  
  if (cleanLocale === 'es') {
    localized.seoTitle = `${comp.format1} vs ${comp.format2}: ¿Cuál es mejor? (Prós y contras) [2026]`;
    localized.seoDescription = `Comparación de ${comp.format1} vs ${comp.format2}. Descubra por qué ${comp.winner} es el formato preferido y cuál elegir para su sitio web.`;
    localized.description = `Compare las diferencias clave entre los formatos de archivo ${comp.format1} y ${comp.format2}. Analizamos sus tamaños, calidad y soporte.`;
    localized.whenToUse1 = `Use ${comp.format1} cuando necesite ${comp.format1Pros[0] || 'alta calidad'} o ${comp.format1Pros[1] || 'compatibilidad'}.`;
    localized.whenToUse2 = `Use ${comp.format2} cuando necesite ${comp.format2Pros[0] || 'alta calidad'} o ${comp.format2Pros[1] || 'compatibilidad'}.`;
  } else if (cleanLocale === 'fr') {
    localized.seoTitle = `${comp.format1} vs ${comp.format2} : Lequel choisir ? (Pros & Cons) [2026]`;
    localized.seoDescription = `Comparaison entre ${comp.format1} et ${comp.format2}. Découvrez quel format offre les meilleurs ratios de compression et de qualité.`;
    localized.description = `Comparez les différences techniques entre ${comp.format1} et ${comp.format2}. Choisissez le format d'image optimal pour vos designs.`;
    localized.whenToUse1 = `Utilisez ${comp.format1} lorsque vous avez besoin de ${comp.format1Pros[0] || 'haute qualité'}.`;
    localized.whenToUse2 = `Utilisez ${comp.format2} lorsque vous avez besoin de ${comp.format2Pros[0] || 'haute qualité'}.`;
  } else if (cleanLocale === 'de') {
    localized.seoTitle = `${comp.format1} vs. ${comp.format2}: Was ist besser? (Vergleich) [2026]`;
    localized.seoDescription = `Vergleich von ${comp.format1} vs. ${comp.format2}. Erfahren Sie, welches Bildformat sich am besten für Web-Performance eignet.`;
    localized.description = `Vergleichen Sie die Hauptmerkmale der Formate ${comp.format1} und ${comp.format2}. Analysieren Sie Dateigrößen und Bildqualität.`;
    localized.whenToUse1 = `Verwenden Sie ${comp.format1}, wenn Sie Wert auf ${comp.format1Pros[0] || 'Qualität'} legen.`;
    localized.whenToUse2 = `Verwenden Sie ${comp.format2}, wenn Sie Wert auf ${comp.format2Pros[0] || 'Qualität'} legen.`;
  } else if (cleanLocale === 'pt') {
    localized.seoTitle = `${comp.format1} vs ${comp.format2}: Qual é melhor? (Prós e Contras) [2026]`;
    localized.seoDescription = `Comparação detalhada de ${comp.format1} vs ${comp.format2}. Descubra qual formato oferece a melhor otimização para a web.`;
    localized.description = `Compare os formatos de imagem ${comp.format1} e ${comp.format2}. Veja as especificações técnicas de compactação e qualidade.`;
    localized.whenToUse1 = `Use ${comp.format1} quando seu foco for ${comp.format1Pros[0] || 'alta qualidade'}.`;
    localized.whenToUse2 = `Use ${comp.format2} quando seu foco for ${comp.format2Pros[0] || 'alta qualidade'}.`;
  } else if (cleanLocale === 'id') {
    localized.seoTitle = `${comp.format1} vs ${comp.format2}: Mana yang Lebih Baik? [2026]`;
    localized.seoDescription = `Perbandingan antara ${comp.format1} dan ${comp.format2}. Temukan format mana yang paling optimal untuk web.`;
    localized.description = `Bandingkan karakteristik format file ${comp.format1} dan ${comp.format2}. Analisis ukuran file dan kualitas visualnya.`;
    localized.whenToUse1 = `Gunakan ${comp.format1} saat Anda memerlukan ${comp.format1Pros[0] || 'kualitas tinggi'}.`;
    localized.whenToUse2 = `Gunakan ${comp.format2} saat Anda memerlukan ${comp.format2Pros[0] || 'kualitas tinggi'}.`;
  }

  localized.format1Pros = comp.format1Pros.map((p: string) => translateComparisonSentence(p, locale));
  localized.format1Cons = comp.format1Cons.map((p: string) => translateComparisonSentence(p, locale));
  localized.format2Pros = comp.format2Pros.map((p: string) => translateComparisonSentence(p, locale));
  localized.format2Cons = comp.format2Cons.map((p: string) => translateComparisonSentence(p, locale));

  return localized;
}
