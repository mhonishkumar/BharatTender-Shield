"""
Mock Government Verification APIs
Clearly marked: DEMO / MOCK GOVERNMENT VERIFICATION
Real production deployments would connect to authorized NIC / GSTN / NSDL / MSME gateway endpoints.
"""

from typing import Dict, Any

def verify_gstin_mock(gstin: str) -> Dict[str, Any]:
    clean_gst = gstin.strip().upper() if gstin else ""
    is_valid_format = len(clean_gst) == 15 and clean_gst[:2].isdigit() and clean_gst[2:7].isalpha() and clean_gst[7:11].isdigit() and clean_gst[11].isalpha()
    
    # Specific mock dataset
    mock_database = {
        "33ABCDE1234F1Z5": {
            "status": "ACTIVE",
            "legal_name": "ABC Technologies Pvt Ltd",
            "trade_name": "ABC Tech Solutions",
            "reg_date": "2020-04-15",
            "constitution": "Private Limited Company",
            "taxpayer_type": "Regular",
            "state_jurisdiction": "Tamil Nadu"
        },
        "27AABCS1429B1ZB": {
            "status": "ACTIVE",
            "legal_name": "DEF Safety Infra Ltd",
            "trade_name": "DEF Protective Gear",
            "reg_date": "2019-08-10",
            "constitution": "Public Limited Company",
            "taxpayer_type": "Regular",
            "state_jurisdiction": "Maharashtra"
        },
        "07AAAAA0000A1Z5": {
            "status": "SUSPENDED",
            "legal_name": "Non Compliant Bidders Corp",
            "trade_name": "Blacklisted Suppliers",
            "reg_date": "2018-01-01",
            "constitution": "Partnership",
            "taxpayer_type": "Regular",
            "state_jurisdiction": "Delhi"
        }
    }
    
    match = mock_database.get(clean_gst)
    if match:
        return {
            "verified": True,
            "status": match["status"],
            "legal_name": match["legal_name"],
            "trade_name": match["trade_name"],
            "registration_date": match["reg_date"],
            "gstin": clean_gst,
            "api_source": "DEMO / MOCK GOVERNMENT VERIFICATION (GSTN Simulated Gateway)",
            "message": "GSTIN verified successfully against simulated GST portal."
        }
    
    if is_valid_format:
        return {
            "verified": True,
            "status": "ACTIVE",
            "legal_name": "Registered Enterprise (Simulated)",
            "trade_name": "Enterprise Trading Co",
            "registration_date": "2021-01-10",
            "gstin": clean_gst,
            "api_source": "DEMO / MOCK GOVERNMENT VERIFICATION (GSTN Simulated Gateway)",
            "message": "Valid format recognized; simulated verification successful."
        }
    
    return {
        "verified": False,
        "status": "INVALID_FORMAT",
        "legal_name": None,
        "trade_name": None,
        "registration_date": None,
        "gstin": clean_gst,
        "api_source": "DEMO / MOCK GOVERNMENT VERIFICATION (GSTN Simulated Gateway)",
        "message": "Invalid GSTIN format or taxpayer not found."
    }


def verify_pan_mock(pan: str) -> Dict[str, Any]:
    clean_pan = pan.strip().upper() if pan else ""
    is_valid_format = len(clean_pan) == 10 and clean_pan[:5].isalpha() and clean_pan[5:9].isdigit() and clean_pan[9].isalpha()
    
    mock_pan_database = {
        "ABCDE1234F": {
            "status": "VALID",
            "holder_name": "ABC Technologies Pvt Ltd",
            "category": "Company",
            "aadhaar_linked": True,
            "allotment_date": "2018-02-12"
        },
        "AABCS1429B": {
            "status": "VALID",
            "holder_name": "DEF Safety Infra Ltd",
            "category": "Company",
            "aadhaar_linked": True,
            "allotment_date": "2017-06-20"
        }
    }
    
    match = mock_pan_database.get(clean_pan)
    if match:
        return {
            "verified": True,
            "status": match["status"],
            "holder_name": match["holder_name"],
            "pan": clean_pan,
            "category": match["category"],
            "api_source": "DEMO / MOCK GOVERNMENT VERIFICATION (ITD / NSDL Simulated Gateway)",
            "message": "PAN verified as active and valid."
        }
    
    if is_valid_format:
        return {
            "verified": True,
            "status": "VALID",
            "holder_name": "Authorized Entity (Simulated)",
            "pan": clean_pan,
            "category": "Company" if clean_pan[3] == "C" else "Business/Individual",
            "api_source": "DEMO / MOCK GOVERNMENT VERIFICATION (ITD / NSDL Simulated Gateway)",
            "message": "Format valid; PAN active on simulated Income Tax register."
        }
        
    return {
        "verified": False,
        "status": "INVALID_FORMAT",
        "holder_name": None,
        "pan": clean_pan,
        "category": None,
        "api_source": "DEMO / MOCK GOVERNMENT VERIFICATION (ITD / NSDL Simulated Gateway)",
        "message": "PAN format invalid or record not traced."
    }


def verify_udyam_mock(udyam: str) -> Dict[str, Any]:
    clean_udyam = udyam.strip().upper() if udyam else ""
    # Udyam format typically UDYAM-XX-00-0000000
    is_valid_format = clean_udyam.startswith("UDYAM-")
    
    mock_udyam_db = {
        "UDYAM-TN-02-0012345": {
            "enterprise_name": "ABC Technologies Pvt Ltd",
            "enterprise_type": "Micro",
            "status": "ACTIVE",
            "valid_from": "2020-07-01",
            "valid_until": "2030-03-31",
            "associated_gstin": "33ABCDE1234F1Z5",
            "major_activity": "Manufacturing / Equipment Supply"
        },
        "UDYAM-MH-01-0098765": {
            "enterprise_name": "DEF Safety Infra Ltd",
            "enterprise_type": "Small",
            "status": "EXPIRED_OR_MISMATCHED",
            "valid_from": "2019-01-01",
            "valid_until": "2025-12-31", # Expired relative to 2026 bid date!
            "associated_gstin": "33ABCDE1234F1Z1", # Note the mismatch with 27AABCS1429B1ZB / 33ABCDE1234F1Z5
            "major_activity": "Safety Equipment"
        }
    }
    
    match = mock_udyam_db.get(clean_udyam)
    if match:
        return {
            "verified": True,
            "status": match["status"],
            "enterprise_name": match["enterprise_name"],
            "enterprise_type": match["enterprise_type"],
            "valid_from": match["valid_from"],
            "valid_until": match["valid_until"],
            "associated_gstin": match["associated_gstin"],
            "udyam_number": clean_udyam,
            "api_source": "DEMO / MOCK GOVERNMENT VERIFICATION (MSME Udyam Simulated Registry)",
            "message": "Udyam registration details retrieved from mock database."
        }
        
    if is_valid_format:
        return {
            "verified": True,
            "status": "ACTIVE",
            "enterprise_name": "Registered MSME (Simulated)",
            "enterprise_type": "Small",
            "valid_from": "2021-01-01",
            "valid_until": "2030-12-31",
            "associated_gstin": "MATCH_AUTO",
            "udyam_number": clean_udyam,
            "api_source": "DEMO / MOCK GOVERNMENT VERIFICATION (MSME Udyam Simulated Registry)",
            "message": "Valid Udyam structure; registered in simulated MSME portal."
        }
        
    return {
        "verified": False,
        "status": "INVALID_FORMAT",
        "enterprise_name": None,
        "enterprise_type": None,
        "valid_from": None,
        "valid_until": None,
        "associated_gstin": None,
        "udyam_number": clean_udyam,
        "api_source": "DEMO / MOCK GOVERNMENT VERIFICATION (MSME Udyam Simulated Registry)",
        "message": "Invalid Udyam registration number format."
    }
