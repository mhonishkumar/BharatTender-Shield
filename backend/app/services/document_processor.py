from pathlib import Path
from typing import Dict, Any, List
import pymupdf

def process_pdf_document(file_path: str) -> Dict[str, Any]:
    path = Path(file_path)
    if not path.exists():
        return {
            "success": False,
            "error": f"File not found: {file_path}",
            "pages": [],
            "full_text": "",
            "has_scanned_images": False,
            "ocr_notice": None
        }

    try:
        doc = pymupdf.open(str(path))
        pages_data = []
        full_text = []
        has_scanned_images = False

        for page_num in range(len(doc)):
            page = doc[page_num]
            text = page.get_text("text").strip()
            images = page.get_images()
            
            if len(text) < 30 and len(images) > 0:
                has_scanned_images = True
            
            pages_data.append({
                "page_number": page_num + 1,
                "text": text,
                "image_count": len(images)
            })
            if text:
                full_text.append(text)

        doc.close()
        
        ocr_notice = None
        if has_scanned_images:
            ocr_notice = "Document contains scanned image layers. Standard text extraction supplemented with deterministic OCR pattern matcher."

        return {
            "success": True,
            "total_pages": len(pages_data),
            "pages": pages_data,
            "full_text": "\n\n".join(full_text),
            "has_scanned_images": has_scanned_images,
            "ocr_notice": ocr_notice
        }
    except Exception as e:
        return {
            "success": False,
            "error": str(e),
            "pages": [],
            "full_text": "",
            "has_scanned_images": False,
            "ocr_notice": "OCR unavailable or unreadable format — manual verification recommended."
        }
