import React, { useState, useRef, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { 
  FileText, 
  Image as ImageIcon, 
  CreditCard, 
  Upload, 
  Download, 
  Trash2, 
  RotateCw, 
  ArrowUp, 
  ArrowDown, 
  Sparkles, 
  CheckCircle2, 
  Printer, 
  Sliders, 
  RefreshCw, 
  Maximize2,
  Layers,
  ZoomIn,
  Move,
  Info,
  ShieldCheck,
  Award
} from 'lucide-react';
import jsPDF from 'jspdf';
import confetti from 'canvas-confetti';

interface JpgPage {
  id: string;
  dataUrl: string;
  name: string;
  rotation: number; // 0, 90, 180, 270
  width: number;
  height: number;
}

export const FreeTools: React.FC = () => {
  const { setCurrentView, siteSettings } = useApp();
  const [activeTool, setActiveTool] = useState<'jpg_to_pdf' | 'passport_photo' | 'pvc_crop'>('jpg_to_pdf');

  // ==========================================
  // TOOL 1: JPG TO PDF STATE & LOGIC
  // ==========================================
  const [pdfPages, setPdfPages] = useState<JpgPage[]>([]);
  const [pdfOrientation, setPdfOrientation] = useState<'p' | 'l'>('p'); // portrait or landscape
  const [pdfMargin, setPdfMargin] = useState<number>(5); // in mm: 0, 5, 10
  const [pdfFilename, setPdfFilename] = useState('EzySeva_Document');
  const [isGeneratingPdf, setIsGeneratingPdf] = useState(false);
  const [pdfSuccessMessage, setPdfSuccessMessage] = useState('');
  const pdfInputRef = useRef<HTMLInputElement>(null);

  const handleJpgUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    const newPages: JpgPage[] = [];
    const promises = Array.from(files).map((file: File) => {
      return new Promise<void>((resolve) => {
        const reader = new FileReader();
        reader.onload = (event) => {
          const img = new Image();
          img.onload = () => {
            newPages.push({
              id: `page-${Date.now()}-${Math.random().toString(36).substr(2, 6)}`,
              dataUrl: event.target?.result as string,
              name: file.name,
              rotation: 0,
              width: img.naturalWidth,
              height: img.naturalHeight
            });
            resolve();
          };
          img.src = event.target?.result as string;
        };
        reader.readAsDataURL(file);
      });
    });

    Promise.all(promises).then(() => {
      setPdfPages((prev) => [...prev, ...newPages]);
      if (pdfInputRef.current) pdfInputRef.current.value = '';
    });
  };

  const rotatePage = (id: string) => {
    setPdfPages((prev) =>
      prev.map((p) => (p.id === id ? { ...p, rotation: (p.rotation + 90) % 360 } : p))
    );
  };

  const movePage = (index: number, direction: 'up' | 'down') => {
    const targetIndex = direction === 'up' ? index - 1 : index + 1;
    if (targetIndex < 0 || targetIndex >= pdfPages.length) return;
    setPdfPages((prev) => {
      const copy = [...prev];
      const temp = copy[index];
      copy[index] = copy[targetIndex];
      copy[targetIndex] = temp;
      return copy;
    });
  };

  const deletePage = (id: string) => {
    setPdfPages((prev) => prev.filter((p) => p.id !== id));
  };

  const generatePdf = async () => {
    if (pdfPages.length === 0) return;
    setIsGeneratingPdf(true);
    setPdfSuccessMessage('');

    try {
      const doc = new jsPDF({
        orientation: pdfOrientation,
        unit: 'mm',
        format: 'a4'
      });

      const pageWidth = doc.internal.pageSize.getWidth();
      const pageHeight = doc.internal.pageSize.getHeight();

      for (let i = 0; i < pdfPages.length; i++) {
        if (i > 0) {
          doc.addPage('a4', pdfOrientation);
        }

        const page = pdfPages[i];
        // Create canvas to rotate if needed
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        const img = new Image();
        await new Promise<void>((resolve) => {
          img.onload = () => resolve();
          img.src = page.dataUrl;
        });

        const isSideways = page.rotation === 90 || page.rotation === 270;
        canvas.width = isSideways ? img.naturalHeight : img.naturalWidth;
        canvas.height = isSideways ? img.naturalWidth : img.naturalHeight;

        if (ctx) {
          ctx.translate(canvas.width / 2, canvas.height / 2);
          ctx.rotate((page.rotation * Math.PI) / 180);
          ctx.drawImage(img, -img.naturalWidth / 2, -img.naturalHeight / 2);
        }

        const rotatedDataUrl = canvas.toDataURL('image/jpeg', 0.95);

        // Fit into A4 with chosen margin
        const availWidth = pageWidth - pdfMargin * 2;
        const availHeight = pageHeight - pdfMargin * 2;
        const imgRatio = canvas.width / canvas.height;
        const availRatio = availWidth / availHeight;

        let renderWidth = availWidth;
        let renderHeight = availHeight;

        if (imgRatio > availRatio) {
          renderHeight = availWidth / imgRatio;
        } else {
          renderWidth = availHeight * imgRatio;
        }

        const posX = pdfMargin + (availWidth - renderWidth) / 2;
        const posY = pdfMargin + (availHeight - renderHeight) / 2;

        doc.addImage(rotatedDataUrl, 'JPEG', posX, posY, renderWidth, renderHeight);
      }

      const finalName = `${pdfFilename.trim() || 'Document'}.pdf`;
      doc.save(finalName);
      setPdfSuccessMessage(`Downloaded "${finalName}" successfully!`);
      try {
        confetti({ particleCount: 80, spread: 70, origin: { y: 0.6 } });
      } catch {
        // ignore
      }
    } catch (err) {
      console.error(err);
      alert('Failed to generate PDF. Please try again with valid JPG images.');
    } finally {
      setIsGeneratingPdf(false);
    }
  };

  // ==========================================
  // TOOL 2: PASSPORT SIZE PHOTO MAKER (3.5x4.5cm)
  // ==========================================
  const [photoSrc, setPhotoSrc] = useState<string | null>(null);
  const [photoZoom, setPhotoZoom] = useState<number>(100); // 50 to 250
  const [photoPanX, setPhotoPanX] = useState<number>(0);
  const [photoPanY, setPhotoPanY] = useState<number>(0);
  const [photoRotation, setPhotoRotation] = useState<number>(0); // -45 to 45
  const [photoBgColor, setPhotoBgColor] = useState<string>('#FFFFFF'); // White, Blue, Grey, Transparent
  const [photoBorder, setPhotoBorder] = useState<boolean>(true);
  const [photoBrightness, setPhotoBrightness] = useState<number>(100);
  const [photoContrast, setPhotoContrast] = useState<number>(100);
  const singlePhotoCanvasRef = useRef<HTMLCanvasElement>(null);

  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (event) => {
      setPhotoSrc(event.target?.result as string);
      setPhotoZoom(100);
      setPhotoPanX(0);
      setPhotoPanY(0);
      setPhotoRotation(0);
    };
    reader.readAsDataURL(file);
  };

  // Redraw single passport photo on canvas
  useEffect(() => {
    if (!photoSrc || !singlePhotoCanvasRef.current) return;
    const canvas = singlePhotoCanvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // 3.5cm x 4.5cm at 300 DPI = 413 x 531 pixels
    const width = 413;
    const height = 531;
    canvas.width = width;
    canvas.height = height;

    const img = new Image();
    img.onload = () => {
      // 1. Fill background color
      ctx.fillStyle = photoBgColor;
      ctx.fillRect(0, 0, width, height);

      // 2. Set filters
      ctx.filter = `brightness(${photoBrightness}%) contrast(${photoContrast}%)`;

      // 3. Transform and draw image
      ctx.save();
      ctx.translate(width / 2 + photoPanX, height / 2 + photoPanY);
      ctx.rotate((photoRotation * Math.PI) / 180);
      const scale = (photoZoom / 100) * Math.max(width / img.naturalWidth, height / img.naturalHeight);
      ctx.scale(scale, scale);
      ctx.drawImage(img, -img.naturalWidth / 2, -img.naturalHeight / 2);
      ctx.restore();

      // Reset filter for border
      ctx.filter = 'none';

      // 4. Optional 1px border
      if (photoBorder) {
        ctx.strokeStyle = '#94a3b8';
        ctx.lineWidth = 2;
        ctx.strokeRect(1, 1, width - 2, height - 2);
      }
    };
    img.src = photoSrc;
  }, [photoSrc, photoZoom, photoPanX, photoPanY, photoRotation, photoBgColor, photoBorder, photoBrightness, photoContrast]);

  const downloadSinglePassportPhoto = () => {
    if (!singlePhotoCanvasRef.current) return;
    const link = document.createElement('a');
    link.download = `Passport_Photo_3.5x4.5cm.jpg`;
    link.href = singlePhotoCanvasRef.current.toDataURL('image/jpeg', 0.98);
    link.click();
    try {
      confetti({ particleCount: 60, spread: 60, origin: { y: 0.6 } });
    } catch {}
  };

  const downloadPassport8Sheet = () => {
    if (!singlePhotoCanvasRef.current) return;
    const singleDataUrl = singlePhotoCanvasRef.current.toDataURL('image/jpeg', 0.98);

    // 4x6 inch studio sheet at 300 DPI = 1200 x 1800 pixels
    const sheetCanvas = document.createElement('canvas');
    sheetCanvas.width = 1800; // Landscape 6x4
    sheetCanvas.height = 1200;
    const ctx = sheetCanvas.getContext('2d');
    if (!ctx) return;

    // Studio white background
    ctx.fillStyle = '#FFFFFF';
    ctx.fillRect(0, 0, 1800, 1200);

    // Title / studio header text watermark at margin
    ctx.fillStyle = '#64748b';
    ctx.font = 'bold 24px sans-serif';
    ctx.fillText(`${siteSettings.siteName} - 8 Passport Photo Studio Sheet (4x6 inch)`, 60, 50);

    const singleImg = new Image();
    singleImg.onload = () => {
      const pWidth = 360;
      const pHeight = 460;
      const marginX = (1800 - 4 * pWidth) / 5; // approx 60px
      const marginY = 90;
      const gapY = 50;

      // 2 rows of 4 photos = 8 photos
      for (let row = 0; row < 2; row++) {
        for (let col = 0; col < 4; col++) {
          const x = marginX + col * (pWidth + marginX);
          const y = marginY + row * (pHeight + gapY);

          // Draw passport photo
          ctx.drawImage(singleImg, x, y, pWidth, pHeight);

          // Cutting guide lines
          ctx.strokeStyle = '#cbd5e1';
          ctx.lineWidth = 1;
          ctx.setLineDash([4, 4]);
          ctx.strokeRect(x - 2, y - 2, pWidth + 4, pHeight + 4);
          ctx.setLineDash([]);
        }
      }

      const link = document.createElement('a');
      link.download = `Passport_8_Photo_Studio_Sheet_4x6.jpg`;
      link.href = sheetCanvas.toDataURL('image/jpeg', 0.98);
      link.click();
      try {
        confetti({ particleCount: 80, spread: 80, origin: { y: 0.6 } });
      } catch {}
    };
    singleImg.src = singleDataUrl;
  };

  // ==========================================
  // TOOL 3: PVC SMART CARD CROPPER (85.6x54mm)
  // ==========================================
  const [pvcFrontSrc, setPvcFrontSrc] = useState<string | null>(null);
  const [pvcBackSrc, setPvcBackSrc] = useState<string | null>(null);
  const [pvcActiveSide, setPvcActiveSide] = useState<'front' | 'back'>('front');
  
  // Front transforms
  const [pvcFrontZoom, setPvcFrontZoom] = useState<number>(100);
  const [pvcFrontPanX, setPvcFrontPanX] = useState<number>(0);
  const [pvcFrontPanY, setPvcFrontPanY] = useState<number>(0);
  const [pvcFrontRotation, setPvcFrontRotation] = useState<number>(0);

  // Back transforms
  const [pvcBackZoom, setPvcBackZoom] = useState<number>(100);
  const [pvcBackPanX, setPvcBackPanX] = useState<number>(0);
  const [pvcBackPanY, setPvcBackPanY] = useState<number>(0);
  const [pvcBackRotation, setPvcBackRotation] = useState<number>(0);

  const pvcFrontCanvasRef = useRef<HTMLCanvasElement>(null);
  const pvcBackCanvasRef = useRef<HTMLCanvasElement>(null);

  const handlePvcUpload = (side: 'front' | 'back', e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (event) => {
      if (side === 'front') {
        setPvcFrontSrc(event.target?.result as string);
        setPvcFrontZoom(100);
        setPvcFrontPanX(0);
        setPvcFrontPanY(0);
        setPvcFrontRotation(0);
      } else {
        setPvcBackSrc(event.target?.result as string);
        setPvcBackZoom(100);
        setPvcBackPanX(0);
        setPvcBackPanY(0);
        setPvcBackRotation(0);
      }
    };
    reader.readAsDataURL(file);
  };

  // Render PVC Front
  useEffect(() => {
    if (!pvcFrontSrc || !pvcFrontCanvasRef.current) return;
    const canvas = pvcFrontCanvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // CR80 85.6mm x 54mm at 300 DPI = 1012 x 638 pixels
    const width = 1012;
    const height = 638;
    canvas.width = width;
    canvas.height = height;

    const img = new Image();
    img.onload = () => {
      ctx.fillStyle = '#FFFFFF';
      ctx.fillRect(0, 0, width, height);

      ctx.save();
      ctx.translate(width / 2 + pvcFrontPanX, height / 2 + pvcFrontPanY);
      ctx.rotate((pvcFrontRotation * Math.PI) / 180);
      const scale = (pvcFrontZoom / 100) * Math.max(width / img.naturalWidth, height / img.naturalHeight);
      ctx.scale(scale, scale);
      ctx.drawImage(img, -img.naturalWidth / 2, -img.naturalHeight / 2);
      ctx.restore();

      // Border outline
      ctx.strokeStyle = '#cbd5e1';
      ctx.lineWidth = 3;
      ctx.strokeRect(1, 1, width - 2, height - 2);
    };
    img.src = pvcFrontSrc;
  }, [pvcFrontSrc, pvcFrontZoom, pvcFrontPanX, pvcFrontPanY, pvcFrontRotation]);

  // Render PVC Back
  useEffect(() => {
    if (!pvcBackSrc || !pvcBackCanvasRef.current) return;
    const canvas = pvcBackCanvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const width = 1012;
    const height = 638;
    canvas.width = width;
    canvas.height = height;

    const img = new Image();
    img.onload = () => {
      ctx.fillStyle = '#FFFFFF';
      ctx.fillRect(0, 0, width, height);

      ctx.save();
      ctx.translate(width / 2 + pvcBackPanX, height / 2 + pvcBackPanY);
      ctx.rotate((pvcBackRotation * Math.PI) / 180);
      const scale = (pvcBackZoom / 100) * Math.max(width / img.naturalWidth, height / img.naturalHeight);
      ctx.scale(scale, scale);
      ctx.drawImage(img, -img.naturalWidth / 2, -img.naturalHeight / 2);
      ctx.restore();

      // Border outline
      ctx.strokeStyle = '#cbd5e1';
      ctx.lineWidth = 3;
      ctx.strokeRect(1, 1, width - 2, height - 2);
    };
    img.src = pvcBackSrc;
  }, [pvcBackSrc, pvcBackZoom, pvcBackPanX, pvcBackPanY, pvcBackRotation]);

  const downloadPvcSide = (side: 'front' | 'back') => {
    const canvas = side === 'front' ? pvcFrontCanvasRef.current : pvcBackCanvasRef.current;
    if (!canvas) return;
    const link = document.createElement('a');
    link.download = `PVC_${side.toUpperCase()}_Card_85.6x54mm.jpg`;
    link.href = canvas.toDataURL('image/jpeg', 0.98);
    link.click();
    try {
      confetti({ particleCount: 50, spread: 50, origin: { y: 0.6 } });
    } catch {}
  };

  const downloadCombinedPvcSheet = () => {
    if (!pvcFrontCanvasRef.current && !pvcBackCanvasRef.current) return;

    // A4 sheet at 300 DPI = 2480 x 3508 pixels
    const sheetCanvas = document.createElement('canvas');
    sheetCanvas.width = 2480;
    sheetCanvas.height = 3508;
    const ctx = sheetCanvas.getContext('2d');
    if (!ctx) return;

    // Crisp white sheet
    ctx.fillStyle = '#FFFFFF';
    ctx.fillRect(0, 0, 2480, 3508);

    // Header banner
    ctx.fillStyle = '#1e293b';
    ctx.font = 'bold 36px sans-serif';
    ctx.fillText(`${siteSettings.siteName} - PVC Smart Card Print Sheet (CR80 Standard 85.6mm x 54mm)`, 100, 120);
    ctx.fillStyle = '#64748b';
    ctx.font = '24px sans-serif';
    ctx.fillText('Ready for PVC Thermal Tray Printing or Dual 250-Micron Pouch Lamination', 100, 170);

    const cardW = 1012;
    const cardH = 638;

    // Front card
    if (pvcFrontCanvasRef.current) {
      ctx.drawImage(pvcFrontCanvasRef.current, 200, 260, cardW, cardH);
      ctx.fillStyle = '#0f172a';
      ctx.font = 'bold 22px sans-serif';
      ctx.fillText('FRONT SIDE (সামনের অংশ)', 200, 240);
    }

    // Back card
    if (pvcBackCanvasRef.current) {
      ctx.drawImage(pvcBackCanvasRef.current, 1280, 260, cardW, cardH);
      ctx.fillStyle = '#0f172a';
      ctx.font = 'bold 22px sans-serif';
      ctx.fillText('BACK SIDE (পেছনের অংশ)', 1280, 240);
    }

    const link = document.createElement('a');
    link.download = `PVC_Dual_Print_Sheet_A4.jpg`;
    link.href = sheetCanvas.toDataURL('image/jpeg', 0.98);
    link.click();
    try {
      confetti({ particleCount: 70, spread: 70, origin: { y: 0.6 } });
    } catch {}
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 animate-in fade-in duration-300">
      
      {/* Top Banner & Header */}
      <div className="geometric-card p-6 md:p-8 bg-gradient-to-br from-slate-900 via-blue-950 to-slate-900 text-white relative overflow-hidden border-slate-800">
        <div className="absolute right-0 top-0 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl pointer-events-none" />
        
        <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 text-xs font-bold">
              <Sparkles className="w-3.5 h-3.5 text-amber-300" />
              <span>100% Free Cyber Cafe & Citizen Tools</span>
            </div>
            <h1 className="text-2xl sm:text-3xl md:text-4xl font-extrabold tracking-tight">
              Free Document & Photo Tools
            </h1>
            <p className="text-slate-300 text-xs sm:text-sm max-w-2xl">
              Convert multiple JPGs to PDF, crop Indian standard passport photos with printable 8-photo sheets, and prepare Aadhaar/Voter/PAN PVC smart cards for instant printing. Completely free and runs in your browser.
            </p>
          </div>

          <button
            onClick={() => setCurrentView('services')}
            className="bg-blue-600 hover:bg-blue-700 text-white text-xs font-extrabold px-5 py-2.5 rounded-xl shadow transition-colors flex items-center gap-2 shrink-0"
          >
            <CreditCard className="w-4 h-4" />
            <span>Order PVC Printed Card</span>
          </button>
        </div>

        {/* 3 Main Tool Selector Tabs */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mt-8">
          <button
            onClick={() => setActiveTool('jpg_to_pdf')}
            className={`p-4 rounded-xl text-left border transition-all flex items-start gap-3 ${
              activeTool === 'jpg_to_pdf'
                ? 'bg-blue-600 text-white border-blue-400 shadow-lg scale-[1.02]'
                : 'bg-white/5 hover:bg-white/10 text-slate-200 border-white/10'
            }`}
          >
            <div className="w-9 h-9 rounded-lg bg-white/10 flex items-center justify-center shrink-0">
              <FileText className="w-5 h-5 text-amber-300" />
            </div>
            <div>
              <div className="font-extrabold text-sm">JPG to PDF Converter</div>
              <div className="text-[11px] opacity-80 mt-0.5">Merge multiple JPGs into single PDF</div>
            </div>
          </button>

          <button
            onClick={() => setActiveTool('passport_photo')}
            className={`p-4 rounded-xl text-left border transition-all flex items-start gap-3 ${
              activeTool === 'passport_photo'
                ? 'bg-blue-600 text-white border-blue-400 shadow-lg scale-[1.02]'
                : 'bg-white/5 hover:bg-white/10 text-slate-200 border-white/10'
            }`}
          >
            <div className="w-9 h-9 rounded-lg bg-white/10 flex items-center justify-center shrink-0">
              <ImageIcon className="w-5 h-5 text-emerald-300" />
            </div>
            <div>
              <div className="font-extrabold text-sm">Passport Size Photo Maker</div>
              <div className="text-[11px] opacity-80 mt-0.5">3.5x4.5 cm & 8-Photo 4x6 sheet</div>
            </div>
          </button>

          <button
            onClick={() => setActiveTool('pvc_crop')}
            className={`p-4 rounded-xl text-left border transition-all flex items-start gap-3 ${
              activeTool === 'pvc_crop'
                ? 'bg-blue-600 text-white border-blue-400 shadow-lg scale-[1.02]'
                : 'bg-white/5 hover:bg-white/10 text-slate-200 border-white/10'
            }`}
          >
            <div className="w-9 h-9 rounded-lg bg-white/10 flex items-center justify-center shrink-0">
              <CreditCard className="w-5 h-5 text-sky-300" />
            </div>
            <div>
              <div className="font-extrabold text-sm">PVC Smart Card Cropper</div>
              <div className="text-[11px] opacity-80 mt-0.5">Aadhaar/Voter CR80 Front & Back</div>
            </div>
          </button>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* TOOL 1 VIEW: JPG TO PDF CONVERTER */}
      {/* ========================================================================= */}
      {activeTool === 'jpg_to_pdf' && (
        <div className="geometric-card p-6 md:p-8 space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200">
            <div>
              <div className="flex items-center gap-2">
                <FileText className="w-5 h-5 text-blue-600" />
                <h2 className="text-xl font-black text-slate-900">JPG to PDF Converter (বিনামূল্যে জেপিজি থেকে পিডিএফ)</h2>
              </div>
              <p className="text-xs text-slate-500 mt-1">
                Upload 1 or more JPG images, reorder pages, rotate if needed, and download a single merged PDF file.
              </p>
            </div>

            <div className="flex items-center gap-2">
              <input
                ref={pdfInputRef}
                type="file"
                multiple
                accept="image/jpeg,image/jpg,image/png"
                onChange={handleJpgUpload}
                className="hidden"
                id="jpg-upload-input"
              />
              <label
                htmlFor="jpg-upload-input"
                className="bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold px-4 py-2.5 rounded-xl shadow cursor-pointer flex items-center gap-2 transition-colors"
              >
                <Upload className="w-4 h-4" />
                <span>Add JPG Images</span>
              </label>

              {pdfPages.length > 0 && (
                <button
                  type="button"
                  onClick={() => setPdfPages([])}
                  className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-xl transition-colors"
                  title="Clear all pages"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              )}
            </div>
          </div>

          {pdfSuccessMessage && (
            <div className="p-3 bg-emerald-50 text-emerald-900 border border-emerald-200 rounded-xl text-xs flex items-center gap-2 font-bold">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>{pdfSuccessMessage}</span>
            </div>
          )}

          {/* Configuration controls */}
          <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
            <div>
              <label className="block font-bold text-slate-700 mb-1">Page Orientation</label>
              <div className="flex bg-white rounded-lg border border-slate-300 p-1">
                <button
                  type="button"
                  onClick={() => setPdfOrientation('p')}
                  className={`flex-1 py-1.5 rounded font-bold transition-all ${
                    pdfOrientation === 'p' ? 'bg-blue-600 text-white' : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  Portrait (লম্বালম্বি)
                </button>
                <button
                  type="button"
                  onClick={() => setPdfOrientation('l')}
                  className={`flex-1 py-1.5 rounded font-bold transition-all ${
                    pdfOrientation === 'l' ? 'bg-blue-600 text-white' : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  Landscape (চওড়া)
                </button>
              </div>
            </div>

            <div>
              <label className="block font-bold text-slate-700 mb-1">Page Margin</label>
              <select
                value={pdfMargin}
                onChange={(e) => setPdfMargin(Number(e.target.value))}
                className="w-full bg-white border border-slate-300 rounded-lg py-2 px-3 text-xs focus:ring-2 focus:ring-blue-500"
              >
                <option value={0}>No Margin (Full Fit)</option>
                <option value={5}>Small Margin (5 mm)</option>
                <option value={10}>Standard Margin (10 mm)</option>
              </select>
            </div>

            <div>
              <label className="block font-bold text-slate-700 mb-1">Output PDF Name</label>
              <input
                type="text"
                value={pdfFilename}
                onChange={(e) => setPdfFilename(e.target.value)}
                placeholder="e.g. My_Documents"
                className="w-full bg-white border border-slate-300 rounded-lg py-2 px-3 text-xs font-mono focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>

          {/* Uploaded Pages Grid */}
          {pdfPages.length === 0 ? (
            <div className="text-center py-16 border-2 border-dashed border-slate-300 rounded-2xl p-6 bg-slate-50/50">
              <div className="w-14 h-14 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center mx-auto mb-3">
                <Upload className="w-7 h-7" />
              </div>
              <h3 className="font-bold text-slate-800 text-base">Select or Drag & Drop JPG Images</h3>
              <p className="text-xs text-slate-500 mt-1 max-w-sm mx-auto">
                Select your marksheet, certificate, Aadhaar, or photos. You can rotate and reorder them before converting.
              </p>
              <label
                htmlFor="jpg-upload-input"
                className="inline-flex items-center gap-2 mt-4 bg-blue-600 hover:bg-blue-700 text-white text-xs font-extrabold px-5 py-2.5 rounded-xl shadow cursor-pointer"
              >
                <Upload className="w-4 h-4" />
                <span>Choose JPG Files</span>
              </label>
            </div>
          ) : (
            <div className="space-y-4">
              <div className="flex items-center justify-between text-xs text-slate-500 font-bold">
                <span>{pdfPages.length} Page{pdfPages.length === 1 ? '' : 's'} Ready</span>
                <span>Use arrows to reorder pages</span>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                {pdfPages.map((page, index) => (
                  <div key={page.id} className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-sm flex flex-col">
                    <div className="bg-slate-100 px-3 py-1.5 text-[11px] font-bold text-slate-700 flex items-center justify-between border-b border-slate-200">
                      <span>Page {index + 1}</span>
                      <span className="text-[10px] text-slate-500 font-normal truncate max-w-[100px]">{page.name}</span>
                    </div>

                    <div className="h-44 bg-slate-900/5 flex items-center justify-center p-2 overflow-hidden">
                      <img
                        src={page.dataUrl}
                        alt={`Page ${index + 1}`}
                        style={{ transform: `rotate(${page.rotation}deg)` }}
                        className="max-h-full max-w-full object-contain rounded shadow-sm transition-transform duration-200"
                      />
                    </div>

                    <div className="p-2 bg-slate-50 border-t border-slate-200 flex items-center justify-between gap-1">
                      <div className="flex items-center gap-1">
                        <button
                          type="button"
                          disabled={index === 0}
                          onClick={() => movePage(index, 'up')}
                          className="p-1.5 text-slate-600 hover:text-blue-600 disabled:opacity-30 rounded hover:bg-slate-200"
                          title="Move Up"
                        >
                          <ArrowUp className="w-3.5 h-3.5" />
                        </button>
                        <button
                          type="button"
                          disabled={index === pdfPages.length - 1}
                          onClick={() => movePage(index, 'down')}
                          className="p-1.5 text-slate-600 hover:text-blue-600 disabled:opacity-30 rounded hover:bg-slate-200"
                          title="Move Down"
                        >
                          <ArrowDown className="w-3.5 h-3.5" />
                        </button>
                        <button
                          type="button"
                          onClick={() => rotatePage(page.id)}
                          className="p-1.5 text-slate-600 hover:text-amber-600 rounded hover:bg-slate-200"
                          title="Rotate 90°"
                        >
                          <RotateCw className="w-3.5 h-3.5" />
                        </button>
                      </div>

                      <button
                        type="button"
                        onClick={() => deletePage(page.id)}
                        className="p-1.5 text-slate-400 hover:text-red-600 rounded hover:bg-red-50"
                        title="Remove page"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>

              {/* Action Button */}
              <div className="pt-4 border-t border-slate-200 flex justify-end">
                <button
                  type="button"
                  disabled={isGeneratingPdf}
                  onClick={generatePdf}
                  className="bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 text-white text-xs font-black px-8 py-3 rounded-xl shadow flex items-center gap-2 transition-all transform active:scale-95"
                >
                  {isGeneratingPdf ? (
                    <span>Generating Merged PDF...</span>
                  ) : (
                    <>
                      <Download className="w-4 h-4" />
                      <span>Convert & Download PDF Now (বিনামূল্যে ডাউনলোড)</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          )}
        </div>
      )}

      {/* ========================================================================= */}
      {/* TOOL 2 VIEW: PASSPORT SIZE PHOTO MAKER (3.5x4.5cm) */}
      {/* ========================================================================= */}
      {activeTool === 'passport_photo' && (
        <div className="geometric-card p-6 md:p-8 space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200">
            <div>
              <div className="flex items-center gap-2">
                <ImageIcon className="w-5 h-5 text-blue-600" />
                <h2 className="text-xl font-black text-slate-900">Passport Size Photo Maker & Crop Tool (পাসপোর্ট সাইজ ফটো)</h2>
              </div>
              <p className="text-xs text-slate-500 mt-1">
                Standard Indian Passport Dimensions (3.5 cm x 4.5 cm / 35mm x 45mm). Zoom, rotate, adjust studio background, and download single or 8-photo studio print sheet.
              </p>
            </div>

            <div>
              <input
                type="file"
                accept="image/*"
                onChange={handlePhotoUpload}
                className="hidden"
                id="passport-upload-input"
              />
              <label
                htmlFor="passport-upload-input"
                className="bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold px-4 py-2.5 rounded-xl shadow cursor-pointer flex items-center gap-2 transition-colors"
              >
                <Upload className="w-4 h-4" />
                <span>Upload New Photo</span>
              </label>
            </div>
          </div>

          {!photoSrc ? (
            <div className="text-center py-16 border-2 border-dashed border-slate-300 rounded-2xl p-6 bg-slate-50/50">
              <div className="w-14 h-14 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center mx-auto mb-3">
                <ImageIcon className="w-7 h-7" />
              </div>
              <h3 className="font-bold text-slate-800 text-base">Upload Your Photo or Selfie</h3>
              <p className="text-xs text-slate-500 mt-1 max-w-sm mx-auto">
                Any portrait or phone camera photo can be cropped and adjusted to official Indian government job & passport specifications.
              </p>
              <label
                htmlFor="passport-upload-input"
                className="inline-flex items-center gap-2 mt-4 bg-blue-600 hover:bg-blue-700 text-white text-xs font-extrabold px-5 py-2.5 rounded-xl shadow cursor-pointer"
              >
                <Upload className="w-4 h-4" />
                <span>Select Photo</span>
              </label>
            </div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
              
              {/* Left Column: Canvas Preview */}
              <div className="lg:col-span-5 flex flex-col items-center">
                <div className="p-4 bg-slate-100 rounded-2xl border border-slate-300 shadow-inner flex flex-col items-center">
                  <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-2">
                    Official 3.5 cm x 4.5 cm Live Preview (300 DPI)
                  </span>
                  
                  {/* Canvas */}
                  <div className="relative border-2 border-slate-800 rounded shadow-md overflow-hidden bg-white">
                    <canvas
                      ref={singlePhotoCanvasRef}
                      className="w-[220px] h-[282px] block"
                    />
                  </div>

                  <span className="text-[11px] text-slate-500 font-mono mt-2">413 x 531 px @ 300 DPI</span>
                </div>

                {/* Download buttons */}
                <div className="w-full space-y-2.5 mt-4">
                  <button
                    type="button"
                    onClick={downloadSinglePassportPhoto}
                    className="w-full bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold py-2.5 rounded-xl shadow flex items-center justify-center gap-2 transition-all transform active:scale-95"
                  >
                    <Download className="w-4 h-4" />
                    <span>Download Single Passport Photo (JPG)</span>
                  </button>

                  <button
                    type="button"
                    onClick={downloadPassport8Sheet}
                    className="w-full bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold py-2.5 rounded-xl shadow flex items-center justify-center gap-2 transition-all transform active:scale-95"
                  >
                    <Printer className="w-4 h-4" />
                    <span>Download 8-Photo Studio Sheet 4x6 (JPG)</span>
                  </button>
                </div>
              </div>

              {/* Right Column: Controls & Sliders */}
              <div className="lg:col-span-7 space-y-5 bg-slate-50 p-6 rounded-2xl border border-slate-200">
                <div className="flex items-center justify-between pb-2 border-b border-slate-200">
                  <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider flex items-center gap-1.5">
                    <Sliders className="w-4 h-4 text-blue-600" />
                    <span>Photo Adjustments & Framing</span>
                  </h4>
                  <button
                    type="button"
                    onClick={() => {
                      setPhotoZoom(100);
                      setPhotoPanX(0);
                      setPhotoPanY(0);
                      setPhotoRotation(0);
                      setPhotoBrightness(100);
                      setPhotoContrast(100);
                    }}
                    className="text-[11px] text-blue-600 hover:underline flex items-center gap-1"
                  >
                    <RefreshCw className="w-3 h-3" />
                    <span>Reset Controls</span>
                  </button>
                </div>

                {/* Zoom & Rotation */}
                <div className="space-y-4 text-xs">
                  <div>
                    <div className="flex justify-between font-bold text-slate-700 mb-1">
                      <span>Zoom: {photoZoom}%</span>
                      <span className="text-slate-400">50% - 250%</span>
                    </div>
                    <input
                      type="range"
                      min="50"
                      max="250"
                      value={photoZoom}
                      onChange={(e) => setPhotoZoom(Number(e.target.value))}
                      className="w-full accent-blue-600"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <div className="flex justify-between font-bold text-slate-700 mb-1">
                        <span>Pan Horizontal (X): {photoPanX}px</span>
                      </div>
                      <input
                        type="range"
                        min="-200"
                        max="200"
                        value={photoPanX}
                        onChange={(e) => setPhotoPanX(Number(e.target.value))}
                        className="w-full accent-blue-600"
                      />
                    </div>

                    <div>
                      <div className="flex justify-between font-bold text-slate-700 mb-1">
                        <span>Pan Vertical (Y): {photoPanY}px</span>
                      </div>
                      <input
                        type="range"
                        min="-200"
                        max="200"
                        value={photoPanY}
                        onChange={(e) => setPhotoPanY(Number(e.target.value))}
                        className="w-full accent-blue-600"
                      />
                    </div>
                  </div>

                  <div>
                    <div className="flex justify-between font-bold text-slate-700 mb-1">
                      <span>Rotate: {photoRotation}°</span>
                    </div>
                    <input
                      type="range"
                      min="-30"
                      max="30"
                      value={photoRotation}
                      onChange={(e) => setPhotoRotation(Number(e.target.value))}
                      className="w-full accent-blue-600"
                    />
                  </div>

                  {/* Studio Background selector */}
                  <div className="pt-2 border-t border-slate-200">
                    <label className="block font-bold text-slate-700 mb-1.5">
                      Studio Background Color
                    </label>
                    <div className="flex flex-wrap items-center gap-2">
                      {[
                        { name: 'Pure White (Govt Standard)', color: '#FFFFFF' },
                        { name: 'Studio Sky Blue', color: '#bfdbfe' },
                        { name: 'Neutral Grey', color: '#e2e8f0' },
                        { name: 'Warm Off-White', color: '#fef3c7' }
                      ].map((bg) => (
                        <button
                          key={bg.color}
                          type="button"
                          onClick={() => setPhotoBgColor(bg.color)}
                          className={`px-3 py-1.5 rounded-lg text-xs font-bold border transition-all flex items-center gap-1.5 ${
                            photoBgColor === bg.color
                              ? 'border-blue-600 ring-2 ring-blue-500/20 bg-white text-blue-900'
                              : 'border-slate-300 bg-white text-slate-700 hover:bg-slate-50'
                          }`}
                        >
                          <span className="w-3.5 h-3.5 rounded-full border border-slate-300" style={{ backgroundColor: bg.color }} />
                          <span>{bg.name}</span>
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Brightness & Contrast */}
                  <div className="grid grid-cols-2 gap-4 pt-2 border-t border-slate-200">
                    <div>
                      <div className="flex justify-between font-bold text-slate-700 mb-1">
                        <span>Brightness: {photoBrightness}%</span>
                      </div>
                      <input
                        type="range"
                        min="70"
                        max="140"
                        value={photoBrightness}
                        onChange={(e) => setPhotoBrightness(Number(e.target.value))}
                        className="w-full accent-blue-600"
                      />
                    </div>

                    <div>
                      <div className="flex justify-between font-bold text-slate-700 mb-1">
                        <span>Contrast: {photoContrast}%</span>
                      </div>
                      <input
                        type="range"
                        min="70"
                        max="140"
                        value={photoContrast}
                        onChange={(e) => setPhotoContrast(Number(e.target.value))}
                        className="w-full accent-blue-600"
                      />
                    </div>
                  </div>

                  {/* Cutting Border Toggle */}
                  <div className="pt-2 flex items-center gap-2">
                    <label className="flex items-center gap-2 cursor-pointer font-bold text-slate-700">
                      <input
                        type="checkbox"
                        checked={photoBorder}
                        onChange={(e) => setPhotoBorder(e.target.checked)}
                        className="rounded text-blue-600 focus:ring-blue-500"
                      />
                      <span>Include Studio Cutting Border (1px guide line)</span>
                    </label>
                  </div>
                </div>
              </div>

            </div>
          )}
        </div>
      )}

      {/* ========================================================================= */}
      {/* TOOL 3 VIEW: PVC SMART CARD CROPPER (85.6x54mm CR80) */}
      {/* ========================================================================= */}
      {activeTool === 'pvc_crop' && (
        <div className="geometric-card p-6 md:p-8 space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200">
            <div>
              <div className="flex items-center gap-2">
                <CreditCard className="w-5 h-5 text-blue-600" />
                <h2 className="text-xl font-black text-slate-900">PVC Smart Card Crop & Resize Tool (পিভিসি স্মার্ট কার্ড ক্রপার)</h2>
              </div>
              <p className="text-xs text-slate-500 mt-1">
                Standard CR80 ISO 7810 Card Dimensions (85.6 mm x 54 mm). Crop Front and Back of Aadhaar, Voter, PAN, or Ayushman card with 300 DPI high-resolution export.
              </p>
            </div>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={downloadCombinedPvcSheet}
                disabled={!pvcFrontSrc && !pvcBackSrc}
                className="bg-emerald-600 hover:bg-emerald-700 disabled:opacity-40 text-white text-xs font-bold px-4 py-2.5 rounded-xl shadow flex items-center gap-2 transition-colors"
              >
                <Printer className="w-4 h-4" />
                <span>Download A4 Print Sheet (JPG)</span>
              </button>
            </div>
          </div>

          {/* Side Selector Tabs */}
          <div className="flex bg-slate-100 p-1.5 rounded-xl border border-slate-200 max-w-md">
            <button
              type="button"
              onClick={() => setPvcActiveSide('front')}
              className={`flex-1 py-2 text-xs font-bold rounded-lg transition-all flex items-center justify-center gap-2 ${
                pvcActiveSide === 'front' ? 'bg-white text-blue-700 shadow-sm' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <span>1. Front Side (সামনের অংশ)</span>
              {pvcFrontSrc && <span className="w-2 h-2 rounded-full bg-emerald-500" />}
            </button>
            <button
              type="button"
              onClick={() => setPvcActiveSide('back')}
              className={`flex-1 py-2 text-xs font-bold rounded-lg transition-all flex items-center justify-center gap-2 ${
                pvcActiveSide === 'back' ? 'bg-white text-blue-700 shadow-sm' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <span>2. Back Side (পেছনের অংশ)</span>
              {pvcBackSrc && <span className="w-2 h-2 rounded-full bg-emerald-500" />}
            </button>
          </div>

          {/* FRONT SIDE PANEL */}
          {pvcActiveSide === 'front' && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                  Front Side Image (Aadhaar / Voter / PAN Front)
                </span>
                <div>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => handlePvcUpload('front', e)}
                    className="hidden"
                    id="pvc-front-upload"
                  />
                  <label
                    htmlFor="pvc-front-upload"
                    className="bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold px-4 py-2 rounded-xl shadow cursor-pointer flex items-center gap-2"
                  >
                    <Upload className="w-4 h-4" />
                    <span>Upload Front Side Image</span>
                  </label>
                </div>
              </div>

              {!pvcFrontSrc ? (
                <div className="text-center py-16 border-2 border-dashed border-slate-300 rounded-2xl p-6 bg-slate-50/50">
                  <CreditCard className="w-12 h-12 text-slate-400 mx-auto mb-2" />
                  <h4 className="font-bold text-slate-800 text-sm">Upload Front Side of your Card</h4>
                  <p className="text-xs text-slate-500 mt-1 max-w-sm mx-auto">
                    Take a photo or upload screenshot of your card's front side. We will scale it to exact 85.6 x 54 mm card size.
                  </p>
                </div>
              ) : (
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
                  <div className="lg:col-span-6 flex flex-col items-center">
                    <div className="p-4 bg-slate-900 rounded-2xl shadow-xl flex flex-col items-center">
                      <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-2">
                        Realistic PVC Card Preview (Rounded 3mm Corners)
                      </span>

                      {/* Card Frame with rounded corners */}
                      <div className="rounded-xl overflow-hidden border-2 border-slate-700 shadow-2xl bg-white">
                        <canvas
                          ref={pvcFrontCanvasRef}
                          className="w-[340px] h-[214px] block"
                        />
                      </div>

                      <span className="text-[10px] text-slate-400 font-mono mt-2">85.60 mm x 53.98 mm @ 300 DPI</span>
                    </div>

                    <button
                      type="button"
                      onClick={() => downloadPvcSide('front')}
                      className="mt-4 w-full max-w-sm bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold py-2.5 rounded-xl shadow flex items-center justify-center gap-2"
                    >
                      <Download className="w-4 h-4" />
                      <span>Download Front Card (JPG)</span>
                    </button>
                  </div>

                  <div className="lg:col-span-6 space-y-4 bg-slate-50 p-6 rounded-2xl border border-slate-200 text-xs">
                    <h4 className="font-bold text-slate-900 uppercase tracking-wider">Front Sizing Adjustments</h4>

                    <div>
                      <div className="flex justify-between font-bold text-slate-700 mb-1">
                        <span>Zoom: {pvcFrontZoom}%</span>
                      </div>
                      <input
                        type="range"
                        min="50"
                        max="250"
                        value={pvcFrontZoom}
                        onChange={(e) => setPvcFrontZoom(Number(e.target.value))}
                        className="w-full accent-blue-600"
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <div className="flex justify-between font-bold text-slate-700 mb-1">
                          <span>Horizontal (X): {pvcFrontPanX}px</span>
                        </div>
                        <input
                          type="range"
                          min="-300"
                          max="300"
                          value={pvcFrontPanX}
                          onChange={(e) => setPvcFrontPanX(Number(e.target.value))}
                          className="w-full accent-blue-600"
                        />
                      </div>

                      <div>
                        <div className="flex justify-between font-bold text-slate-700 mb-1">
                          <span>Vertical (Y): {pvcFrontPanY}px</span>
                        </div>
                        <input
                          type="range"
                          min="-200"
                          max="200"
                          value={pvcFrontPanY}
                          onChange={(e) => setPvcFrontPanY(Number(e.target.value))}
                          className="w-full accent-blue-600"
                        />
                      </div>
                    </div>

                    <div>
                      <div className="flex justify-between font-bold text-slate-700 mb-1">
                        <span>Rotate: {pvcFrontRotation}°</span>
                      </div>
                      <input
                        type="range"
                        min="-20"
                        max="20"
                        value={pvcFrontRotation}
                        onChange={(e) => setPvcFrontRotation(Number(e.target.value))}
                        className="w-full accent-blue-600"
                      />
                    </div>

                    <div className="pt-2 border-t border-slate-200">
                      <button
                        type="button"
                        onClick={() => {
                          setPvcFrontZoom(100);
                          setPvcFrontPanX(0);
                          setPvcFrontPanY(0);
                          setPvcFrontRotation(0);
                        }}
                        className="text-blue-600 font-bold hover:underline"
                      >
                        Reset Front Side Sizing
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* BACK SIDE PANEL */}
          {pvcActiveSide === 'back' && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                  Back Side Image (Aadhaar / Voter / Ayushman Back)
                </span>
                <div>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => handlePvcUpload('back', e)}
                    className="hidden"
                    id="pvc-back-upload"
                  />
                  <label
                    htmlFor="pvc-back-upload"
                    className="bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold px-4 py-2 rounded-xl shadow cursor-pointer flex items-center gap-2"
                  >
                    <Upload className="w-4 h-4" />
                    <span>Upload Back Side Image</span>
                  </label>
                </div>
              </div>

              {!pvcBackSrc ? (
                <div className="text-center py-16 border-2 border-dashed border-slate-300 rounded-2xl p-6 bg-slate-50/50">
                  <CreditCard className="w-12 h-12 text-slate-400 mx-auto mb-2" />
                  <h4 className="font-bold text-slate-800 text-sm">Upload Back Side of your Card</h4>
                  <p className="text-xs text-slate-500 mt-1 max-w-sm mx-auto">
                    Take a photo or upload screenshot of your card's back side containing address & QR code.
                  </p>
                </div>
              ) : (
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
                  <div className="lg:col-span-6 flex flex-col items-center">
                    <div className="p-4 bg-slate-900 rounded-2xl shadow-xl flex flex-col items-center">
                      <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-2">
                        Realistic PVC Card Preview (Back Side)
                      </span>

                      <div className="rounded-xl overflow-hidden border-2 border-slate-700 shadow-2xl bg-white">
                        <canvas
                          ref={pvcBackCanvasRef}
                          className="w-[340px] h-[214px] block"
                        />
                      </div>

                      <span className="text-[10px] text-slate-400 font-mono mt-2">85.60 mm x 53.98 mm @ 300 DPI</span>
                    </div>

                    <button
                      type="button"
                      onClick={() => downloadPvcSide('back')}
                      className="mt-4 w-full max-w-sm bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold py-2.5 rounded-xl shadow flex items-center justify-center gap-2"
                    >
                      <Download className="w-4 h-4" />
                      <span>Download Back Card (JPG)</span>
                    </button>
                  </div>

                  <div className="lg:col-span-6 space-y-4 bg-slate-50 p-6 rounded-2xl border border-slate-200 text-xs">
                    <h4 className="font-bold text-slate-900 uppercase tracking-wider">Back Sizing Adjustments</h4>

                    <div>
                      <div className="flex justify-between font-bold text-slate-700 mb-1">
                        <span>Zoom: {pvcBackZoom}%</span>
                      </div>
                      <input
                        type="range"
                        min="50"
                        max="250"
                        value={pvcBackZoom}
                        onChange={(e) => setPvcBackZoom(Number(e.target.value))}
                        className="w-full accent-blue-600"
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <div className="flex justify-between font-bold text-slate-700 mb-1">
                          <span>Horizontal (X): {pvcBackPanX}px</span>
                        </div>
                        <input
                          type="range"
                          min="-300"
                          max="300"
                          value={pvcBackPanX}
                          onChange={(e) => setPvcBackPanX(Number(e.target.value))}
                          className="w-full accent-blue-600"
                        />
                      </div>

                      <div>
                        <div className="flex justify-between font-bold text-slate-700 mb-1">
                          <span>Vertical (Y): {pvcBackPanY}px</span>
                        </div>
                        <input
                          type="range"
                          min="-200"
                          max="200"
                          value={pvcBackPanY}
                          onChange={(e) => setPvcBackPanY(Number(e.target.value))}
                          className="w-full accent-blue-600"
                        />
                      </div>
                    </div>

                    <div>
                      <div className="flex justify-between font-bold text-slate-700 mb-1">
                        <span>Rotate: {pvcBackRotation}°</span>
                      </div>
                      <input
                        type="range"
                        min="-20"
                        max="20"
                        value={pvcBackRotation}
                        onChange={(e) => setPvcBackRotation(Number(e.target.value))}
                        className="w-full accent-blue-600"
                      />
                    </div>

                    <div className="pt-2 border-t border-slate-200">
                      <button
                        type="button"
                        onClick={() => {
                          setPvcBackZoom(100);
                          setPvcBackPanX(0);
                          setPvcBackPanY(0);
                          setPvcBackRotation(0);
                        }}
                        className="text-blue-600 font-bold hover:underline"
                      >
                        Reset Back Side Sizing
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}

        </div>
      )}

      {/* Citizen Trust & Privacy Banner */}
      <div className="bg-emerald-50 border border-emerald-200 rounded-2xl p-4 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-emerald-950">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-emerald-600 text-white flex items-center justify-center shrink-0">
            <ShieldCheck className="w-5 h-5" />
          </div>
          <div>
            <strong className="font-extrabold text-emerald-900 block">100% Client-Side Private Processing:</strong>
            <span>Your uploaded photos, Aadhaar, and certificates are processed purely in your browser and are never uploaded to any external server.</span>
          </div>
        </div>

        <button
          onClick={() => setCurrentView('services')}
          className="bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold px-4 py-2 rounded-xl shadow shrink-0"
        >
          Print Physical PVC Card Now
        </button>
      </div>

    </div>
  );
};
