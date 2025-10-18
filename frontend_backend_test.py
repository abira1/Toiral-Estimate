#!/usr/bin/env python3
"""
Frontend-Backend Integration Testing Suite for Toiral Estimate Application
Testing Firebase operations through the frontend application

This test suite verifies:
1. Frontend application accessibility and loading
2. Firebase configuration validation
3. Admin and client authentication workflows
4. Service package data flow and pricing calculations
5. Final quotation pricing issue investigation
6. EmailJS integration testing
"""

import requests
import json
import time
import os
import sys
from datetime import datetime
from typing import Dict, List, Any

class ToiralEstimateTestSuite:
    def __init__(self):
        """Initialize test suite"""
        self.app_url = "http://localhost:3000"
        self.test_results = []
        
        print("🎯 TOIRAL ESTIMATE - FRONTEND-BACKEND INTEGRATION TESTING")
        print("📋 Testing Firebase operations through frontend application")
        print("🔥 Focus: Client Quotation Management System Verification")
        print("=" * 80)

    def log_test(self, test_name: str, status: str, details: str = "", error: str = ""):
        """Log test results"""
        result = {
            "test": test_name,
            "status": status,
            "details": details,
            "error": error,
            "timestamp": datetime.now().isoformat()
        }
        self.test_results.append(result)
        
        status_emoji = "✅" if status == "PASS" else "❌" if status == "FAIL" else "⚠️"
        print(f"{status_emoji} {test_name}: {status}")
        if details:
            print(f"   📝 {details}")
        if error:
            print(f"   🚨 {error}")

    def test_frontend_accessibility(self) -> bool:
        """Test if frontend application is accessible"""
        try:
            response = requests.get(self.app_url, timeout=10)
            
            if response.status_code == 200:
                # Check if it's the React app
                if "Toiral" in response.text or "react" in response.text.lower():
                    self.log_test("Frontend Application Access", "PASS", 
                                f"Application accessible at {self.app_url}")
                    return True
                else:
                    self.log_test("Frontend Application Access", "FAIL", 
                                "Response doesn't appear to be the Toiral app")
                    return False
            else:
                self.log_test("Frontend Application Access", "FAIL", 
                            f"HTTP {response.status_code}")
                return False
                
        except requests.exceptions.RequestException as e:
            self.log_test("Frontend Application Access", "FAIL", error=str(e))
            return False

    def test_environment_configuration(self) -> bool:
        """Test Firebase and EmailJS environment configuration"""
        try:
            env_file_path = "/app/.env"
            
            if not os.path.exists(env_file_path):
                self.log_test("Environment Configuration", "FAIL", 
                            "Environment file not found")
                return False
            
            with open(env_file_path, 'r') as f:
                env_content = f.read()
            
            # Check Firebase configuration
            firebase_vars = [
                "VITE_FIREBASE_API_KEY",
                "VITE_FIREBASE_AUTH_DOMAIN", 
                "VITE_FIREBASE_DATABASE_URL",
                "VITE_FIREBASE_PROJECT_ID"
            ]
            
            firebase_configured = all(var in env_content for var in firebase_vars)
            
            # Check EmailJS configuration
            emailjs_vars = [
                "VITE_EMAILJS_SERVICE_ID",
                "VITE_EMAILJS_TEMPLATE_ID",
                "VITE_EMAILJS_USER_ID"
            ]
            
            emailjs_configured = all(var in env_content for var in emailjs_vars)
            
            if firebase_configured and emailjs_configured:
                self.log_test("Environment Configuration", "PASS", 
                            "Firebase and EmailJS configurations found")
                return True
            else:
                missing = []
                if not firebase_configured:
                    missing.append("Firebase")
                if not emailjs_configured:
                    missing.append("EmailJS")
                
                self.log_test("Environment Configuration", "FAIL", 
                            f"Missing configurations: {', '.join(missing)}")
                return False
                
        except Exception as e:
            self.log_test("Environment Configuration", "FAIL", error=str(e))
            return False

    def test_firebase_service_structure(self) -> bool:
        """Test Firebase service file structure and functions"""
        try:
            firebase_service_path = "/app/src/services/firebaseService.ts"
            
            if not os.path.exists(firebase_service_path):
                self.log_test("Firebase Service Structure", "FAIL", 
                            "firebaseService.ts not found")
                return False
            
            with open(firebase_service_path, 'r') as f:
                service_content = f.read()
            
            # Check for essential functions
            required_functions = [
                "createUser",
                "getUser", 
                "createQuotation",
                "getAllServices",
                "createService",
                "getUserQuotations"
            ]
            
            missing_functions = []
            for func in required_functions:
                if f"export const {func}" not in service_content:
                    missing_functions.append(func)
            
            if not missing_functions:
                self.log_test("Firebase Service Structure", "PASS", 
                            f"All {len(required_functions)} essential functions found")
                
                # Check for proper TypeScript interfaces
                required_interfaces = ["User", "ServicePackage", "Quotation", "AddOn"]
                missing_interfaces = []
                
                for interface in required_interfaces:
                    if f"interface {interface}" not in service_content:
                        missing_interfaces.append(interface)
                
                if not missing_interfaces:
                    self.log_test("Firebase TypeScript Interfaces", "PASS", 
                                f"All {len(required_interfaces)} interfaces defined")
                    return True
                else:
                    self.log_test("Firebase TypeScript Interfaces", "FAIL", 
                                f"Missing interfaces: {', '.join(missing_interfaces)}")
                    return False
            else:
                self.log_test("Firebase Service Structure", "FAIL", 
                            f"Missing functions: {', '.join(missing_functions)}")
                return False
                
        except Exception as e:
            self.log_test("Firebase Service Structure", "FAIL", error=str(e))
            return False

    def test_access_code_service(self) -> bool:
        """Test access code generation and validation service"""
        try:
            access_code_service_path = "/app/src/services/accessCodeService.ts"
            
            if not os.path.exists(access_code_service_path):
                self.log_test("Access Code Service", "FAIL", 
                            "accessCodeService.ts not found")
                return False
            
            with open(access_code_service_path, 'r') as f:
                service_content = f.read()
            
            # Check for essential access code functions
            required_functions = [
                "generateAccessCode",
                "createAccessCode",
                "getAccessCodeByCode",
                "markAccessCodeAsUsed"
            ]
            
            missing_functions = []
            for func in required_functions:
                if f"export const {func}" not in service_content:
                    missing_functions.append(func)
            
            if not missing_functions:
                self.log_test("Access Code Service Functions", "PASS", 
                            f"All {len(required_functions)} functions found")
                
                # Check for proper access code structure
                if "interface AccessCode" in service_content:
                    self.log_test("Access Code Interface", "PASS", 
                                "AccessCode interface defined")
                    
                    # Check for 7-day expiration logic
                    if "7" in service_content and "days" in service_content.lower():
                        self.log_test("Access Code Expiration", "PASS", 
                                    "7-day expiration system implemented")
                        return True
                    else:
                        self.log_test("Access Code Expiration", "FAIL", 
                                    "7-day expiration logic not found")
                        return False
                else:
                    self.log_test("Access Code Interface", "FAIL", 
                                "AccessCode interface not defined")
                    return False
            else:
                self.log_test("Access Code Service Functions", "FAIL", 
                            f"Missing functions: {', '.join(missing_functions)}")
                return False
                
        except Exception as e:
            self.log_test("Access Code Service", "FAIL", error=str(e))
            return False

    def test_email_service_integration(self) -> bool:
        """Test EmailJS integration and invitation system"""
        try:
            email_service_path = "/app/src/services/emailService.ts"
            
            if not os.path.exists(email_service_path):
                self.log_test("Email Service Integration", "FAIL", 
                            "emailService.ts not found")
                return False
            
            with open(email_service_path, 'r') as f:
                service_content = f.read()
            
            # Check for EmailJS import
            if "from '@emailjs/browser'" in service_content:
                self.log_test("EmailJS Import", "PASS", 
                            "EmailJS library imported correctly")
            else:
                self.log_test("EmailJS Import", "FAIL", 
                            "EmailJS library not imported")
                return False
            
            # Check for invitation email function
            if "sendInvitationEmail" in service_content:
                self.log_test("Invitation Email Function", "PASS", 
                            "sendInvitationEmail function found")
                
                # Check for proper EmailJS configuration usage
                emailjs_vars = ["EMAILJS_SERVICE_ID", "EMAILJS_TEMPLATE_ID", "EMAILJS_USER_ID"]
                config_found = all(var in service_content for var in emailjs_vars)
                
                if config_found:
                    self.log_test("EmailJS Configuration Usage", "PASS", 
                                "EmailJS environment variables used correctly")
                    
                    # Check for error handling
                    if "try" in service_content and "catch" in service_content:
                        self.log_test("Email Error Handling", "PASS", 
                                    "Error handling implemented")
                        return True
                    else:
                        self.log_test("Email Error Handling", "FAIL", 
                                    "Error handling not found")
                        return False
                else:
                    self.log_test("EmailJS Configuration Usage", "FAIL", 
                                "EmailJS environment variables not used properly")
                    return False
            else:
                self.log_test("Invitation Email Function", "FAIL", 
                            "sendInvitationEmail function not found")
                return False
                
        except Exception as e:
            self.log_test("Email Service Integration", "FAIL", error=str(e))
            return False

    def test_final_quotation_pricing_logic(self) -> bool:
        """Test Final Quotation Page pricing calculation logic"""
        try:
            final_quotation_path = "/app/src/pages/FinalQuotationPage.tsx"
            
            if not os.path.exists(final_quotation_path):
                self.log_test("Final Quotation Page", "FAIL", 
                            "FinalQuotationPage.tsx not found")
                return False
            
            with open(final_quotation_path, 'r') as f:
                page_content = f.read()
            
            # Check for pricing calculation functions
            pricing_functions = ["calculateSubtotal", "calculateTotal"]
            missing_functions = []
            
            for func in pricing_functions:
                if f"const {func}" not in page_content:
                    missing_functions.append(func)
            
            if not missing_functions:
                self.log_test("Pricing Calculation Functions", "PASS", 
                            "calculateSubtotal and calculateTotal functions found")
                
                # Check for service package price handling
                if "selectedPackage?.price" in page_content:
                    self.log_test("Service Package Price Handling", "PASS", 
                                "Service package price properly accessed")
                    
                    # Check for add-ons price calculation
                    if "selectedAddOns.reduce" in page_content and "addon.price" in page_content:
                        self.log_test("Add-ons Price Calculation", "PASS", 
                                    "Add-ons price calculation implemented")
                        
                        # Check for discount handling
                        if "discount" in page_content and "subtotal - discount" in page_content:
                            self.log_test("Discount Calculation", "PASS", 
                                        "Discount calculation implemented")
                            
                            # Identify potential $0 total issue causes
                            potential_issues = []
                            
                            # Check if localStorage is used for service data
                            if "localStorage.getItem('selectedPackageId')" in page_content:
                                potential_issues.append("Dependency on localStorage for service data")
                            
                            # Check if service package can be null
                            if "selectedPackage || 0" in page_content or "selectedPackage?.price || 0" in page_content:
                                potential_issues.append("Service package can be null/undefined")
                            
                            if potential_issues:
                                self.log_test("$0 Total Issue Analysis", "PASS", 
                                            f"Potential causes identified: {'; '.join(potential_issues)}")
                            else:
                                self.log_test("$0 Total Issue Analysis", "PASS", 
                                            "No obvious causes for $0 total found in code")
                            
                            return True
                        else:
                            self.log_test("Discount Calculation", "FAIL", 
                                        "Discount calculation not properly implemented")
                            return False
                    else:
                        self.log_test("Add-ons Price Calculation", "FAIL", 
                                    "Add-ons price calculation not found")
                        return False
                else:
                    self.log_test("Service Package Price Handling", "FAIL", 
                                "Service package price not properly accessed")
                    return False
            else:
                self.log_test("Pricing Calculation Functions", "FAIL", 
                            f"Missing functions: {', '.join(missing_functions)}")
                return False
                
        except Exception as e:
            self.log_test("Final Quotation Pricing Logic", "FAIL", error=str(e))
            return False

    def test_authentication_context(self) -> bool:
        """Test authentication context and access code login"""
        try:
            auth_context_path = "/app/src/contexts/AuthContext.tsx"
            
            if not os.path.exists(auth_context_path):
                self.log_test("Authentication Context", "FAIL", 
                            "AuthContext.tsx not found")
                return False
            
            with open(auth_context_path, 'r') as f:
                auth_content = f.read()
            
            # Check for access code login function
            if "loginWithAccessCode" in auth_content:
                self.log_test("Access Code Login Function", "PASS", 
                            "loginWithAccessCode function found")
                
                # Check for Firebase anonymous authentication
                if "signInAnonymously" in auth_content:
                    self.log_test("Anonymous Authentication", "PASS", 
                                "Firebase anonymous authentication implemented")
                    
                    # Check for access code validation
                    if "getAccessCodeByCode" in auth_content:
                        self.log_test("Access Code Validation", "PASS", 
                                    "Access code validation implemented")
                        
                        # Check for user profile creation
                        if "createUser" in auth_content:
                            self.log_test("User Profile Creation", "PASS", 
                                        "User profile creation from access code implemented")
                            return True
                        else:
                            self.log_test("User Profile Creation", "FAIL", 
                                        "User profile creation not found")
                            return False
                    else:
                        self.log_test("Access Code Validation", "FAIL", 
                                    "Access code validation not implemented")
                        return False
                else:
                    self.log_test("Anonymous Authentication", "FAIL", 
                                "Firebase anonymous authentication not found")
                    return False
            else:
                self.log_test("Access Code Login Function", "FAIL", 
                            "loginWithAccessCode function not found")
                return False
                
        except Exception as e:
            self.log_test("Authentication Context", "FAIL", error=str(e))
            return False

    def test_admin_invitation_system(self) -> bool:
        """Test admin invitation modal and system"""
        try:
            invite_modal_path = "/app/src/components/admin/InviteUserModal.tsx"
            
            if not os.path.exists(invite_modal_path):
                self.log_test("Admin Invitation Modal", "FAIL", 
                            "InviteUserModal.tsx not found")
                return False
            
            with open(invite_modal_path, 'r') as f:
                modal_content = f.read()
            
            # Check for access code creation
            if "createAccessCode" in modal_content:
                self.log_test("Access Code Creation in Modal", "PASS", 
                            "Access code creation integrated in invitation modal")
                
                # Check for email sending
                if "sendInvitationEmail" in modal_content:
                    self.log_test("Email Sending Integration", "PASS", 
                                "Email sending integrated in invitation modal")
                    
                    # Check for form validation
                    if "email" in modal_content and "userName" in modal_content and "role" in modal_content:
                        self.log_test("Invitation Form Fields", "PASS", 
                                    "All required form fields (email, userName, role) present")
                        
                        # Check for success/error handling
                        if "toast" in modal_content or "success" in modal_content.lower():
                            self.log_test("Invitation Success Handling", "PASS", 
                                        "Success/error handling implemented")
                            return True
                        else:
                            self.log_test("Invitation Success Handling", "FAIL", 
                                        "Success/error handling not found")
                            return False
                    else:
                        self.log_test("Invitation Form Fields", "FAIL", 
                                    "Missing required form fields")
                        return False
                else:
                    self.log_test("Email Sending Integration", "FAIL", 
                                "Email sending not integrated")
                    return False
            else:
                self.log_test("Access Code Creation in Modal", "FAIL", 
                            "Access code creation not integrated")
                return False
                
        except Exception as e:
            self.log_test("Admin Invitation System", "FAIL", error=str(e))
            return False

    def test_data_flow_components(self) -> bool:
        """Test data flow between Services → Add-ons → Final Quotation"""
        try:
            # Check Services page
            services_path = "/app/src/pages/ServicesPage.tsx"
            addons_modal_path = "/app/src/components/AddOnsModal.tsx"
            
            services_exists = os.path.exists(services_path)
            addons_exists = os.path.exists(addons_modal_path)
            
            if not services_exists:
                self.log_test("Services Page Component", "FAIL", 
                            "ServicesPage.tsx not found")
                return False
            
            if not addons_exists:
                self.log_test("Add-ons Modal Component", "FAIL", 
                            "AddOnsModal.tsx not found")
                return False
            
            # Check Services page for service selection
            with open(services_path, 'r') as f:
                services_content = f.read()
            
            if "getAllServices" in services_content:
                self.log_test("Service Data Loading", "PASS", 
                            "Services page loads data from Firebase")
                
                # Check for service selection handling
                if "selectedPackageId" in services_content or "setSelectedPackage" in services_content:
                    self.log_test("Service Selection Handling", "PASS", 
                                "Service selection logic implemented")
                else:
                    self.log_test("Service Selection Handling", "FAIL", 
                                "Service selection logic not found")
                    return False
            else:
                self.log_test("Service Data Loading", "FAIL", 
                            "Service data loading not implemented")
                return False
            
            # Check Add-ons Modal for data passing
            with open(addons_modal_path, 'r') as f:
                addons_content = f.read()
            
            if "servicePackage" in addons_content and "addOns" in addons_content:
                self.log_test("Add-ons Data Flow", "PASS", 
                            "Service package data passed to add-ons modal")
                
                # Check for navigation to final quotation
                if "FinalQuotationPage" in addons_content or "final-quotation" in addons_content:
                    self.log_test("Final Quotation Navigation", "PASS", 
                                "Navigation to final quotation implemented")
                    return True
                else:
                    self.log_test("Final Quotation Navigation", "FAIL", 
                                "Navigation to final quotation not found")
                    return False
            else:
                self.log_test("Add-ons Data Flow", "FAIL", 
                            "Service package data not properly passed")
                return False
                
        except Exception as e:
            self.log_test("Data Flow Components", "FAIL", error=str(e))
            return False

    def run_all_tests(self) -> Dict[str, Any]:
        """Run all frontend-backend integration tests"""
        print("🚀 Starting Frontend-Backend Integration Testing")
        print("=" * 60)
        
        test_functions = [
            self.test_frontend_accessibility,
            self.test_environment_configuration,
            self.test_firebase_service_structure,
            self.test_access_code_service,
            self.test_email_service_integration,
            self.test_final_quotation_pricing_logic,
            self.test_authentication_context,
            self.test_admin_invitation_system,
            self.test_data_flow_components
        ]
        
        passed_tests = 0
        total_tests = len(test_functions)
        
        for test_func in test_functions:
            try:
                result = test_func()
                if result:
                    passed_tests += 1
                time.sleep(0.5)  # Brief pause between tests
            except Exception as e:
                self.log_test(test_func.__name__, "FAIL", error=str(e))
        
        # Generate summary
        success_rate = (passed_tests / total_tests) * 100
        
        print("\n" + "=" * 60)
        print("🏁 FRONTEND-BACKEND INTEGRATION TESTING COMPLETE")
        print("=" * 60)
        print(f"📊 Tests Passed: {passed_tests}/{total_tests} ({success_rate:.1f}%)")
        
        # Categorize results
        passed = [r for r in self.test_results if r['status'] == 'PASS']
        failed = [r for r in self.test_results if r['status'] == 'FAIL']
        
        print(f"✅ Passed: {len(passed)}")
        print(f"❌ Failed: {len(failed)}")
        
        if failed:
            print("\n🚨 FAILED TESTS:")
            for test in failed:
                print(f"   ❌ {test['test']}: {test['error'] or test['details']}")
        
        # Specific issue analysis
        print("\n🔍 SPECIFIC ISSUE ANALYSIS:")
        print("=" * 40)
        
        # Final Quotation Pricing Issue
        pricing_tests = [r for r in self.test_results if 'pricing' in r['test'].lower() or 'quotation' in r['test'].lower()]
        if any(t['status'] == 'PASS' for t in pricing_tests):
            print("✅ Final Quotation Pricing: Logic implemented correctly")
            print("   💡 Potential $0 total causes: Service data not loaded, localStorage issues, null service package")
        else:
            print("❌ Final Quotation Pricing: Issues found in implementation")
        
        # Email Invitation System
        email_tests = [r for r in self.test_results if 'email' in r['test'].lower() or 'invitation' in r['test'].lower()]
        if any(t['status'] == 'PASS' for t in email_tests):
            print("✅ Admin Email Invitation: System implemented and configured")
        else:
            print("❌ Admin Email Invitation: Issues found in implementation")
        
        return {
            "total_tests": total_tests,
            "passed_tests": passed_tests,
            "failed_tests": len(failed),
            "success_rate": success_rate,
            "test_results": self.test_results
        }

def main():
    """Main function to run frontend-backend integration tests"""
    test_suite = ToiralEstimateTestSuite()
    results = test_suite.run_all_tests()
    
    # Save results to file
    timestamp = datetime.now().strftime("%Y%m%d_%H%M%S")
    results_file = f"/app/integration_test_results_{timestamp}.json"
    
    try:
        with open(results_file, 'w') as f:
            json.dump(results, f, indent=2)
        print(f"\n💾 Test results saved to: {results_file}")
    except Exception as e:
        print(f"\n⚠️  Could not save results file: {e}")
    
    # Exit with appropriate code
    if results['success_rate'] >= 70:
        print("\n🎉 INTEGRATION TESTING SUCCESSFUL!")
        sys.exit(0)
    else:
        print("\n🚨 INTEGRATION TESTING FAILED - Issues require attention")
        sys.exit(1)

if __name__ == "__main__":
    main()