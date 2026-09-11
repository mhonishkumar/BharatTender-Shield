from fastapi import APIRouter
from app.services.mock_gov_api import verify_gstin_mock, verify_pan_mock, verify_udyam_mock

router = APIRouter(prefix="/api/mock-gov", tags=["Mock Government APIs"])

@router.get("/gst/{gstin}")
def get_mock_gst_info(gstin: str):
    return verify_gstin_mock(gstin)

@router.get("/pan/{pan}")
def get_mock_pan_info(pan: str):
    return verify_pan_mock(pan)

@router.get("/udyam/{udyam_number}")
def get_mock_udyam_info(udyam_number: str):
    return verify_udyam_mock(udyam_number)
