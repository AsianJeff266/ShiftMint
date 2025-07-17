import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Logo } from '@/components/ui/logo';
import { ArrowLeft, Calendar, FileText, Shield, Users } from 'lucide-react';

const Terms = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="border-b border-border/50 bg-background/95 backdrop-blur-md">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <div className="cursor-pointer" onClick={() => navigate('/')}>
            <Logo size="md" />
          </div>
          <Button variant="ghost" onClick={() => navigate('/')}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Home
          </Button>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <Card className="glass-card border-border/30">
            <CardHeader className="text-center">
              <CardTitle className="text-3xl font-bold">Terms of Service</CardTitle>
              <p className="text-muted-foreground flex items-center justify-center space-x-2">
                <Calendar className="h-4 w-4" />
                <span>Last updated: January 15, 2025</span>
              </p>
            </CardHeader>
            <CardContent className="prose prose-gray max-w-none">
              <div className="space-y-8">
                <section>
                  <h2 className="text-xl font-semibold text-foreground mb-4 flex items-center">
                    <FileText className="h-5 w-5 mr-2" />
                    1. Acceptance of Terms
                  </h2>
                  <p className="text-muted-foreground leading-relaxed">
                    By accessing and using ShiftMint ("Service"), you accept and agree to be bound by the terms and provision of this agreement. If you do not agree to abide by the above, please do not use this service.
                  </p>
                </section>

                <section>
                  <h2 className="text-xl font-semibold text-foreground mb-4">2. Service Description</h2>
                  <p className="text-muted-foreground leading-relaxed mb-4">
                    ShiftMint is a payroll operating system designed specifically for tipped workforces. Our service provides:
                  </p>
                  <ul className="list-disc list-inside space-y-2 text-muted-foreground">
                    <li>Real-time payroll validation and error detection</li>
                    <li>Automated tip tracking and pool balancing</li>
                    <li>Compliance monitoring for FLSA, IRS, and state regulations</li>
                    <li>Manager dashboards and reporting tools</li>
                    <li>Employee time tracking and shift management</li>
                  </ul>
                </section>

                <section>
                  <h2 className="text-xl font-semibold text-foreground mb-4 flex items-center">
                    <Users className="h-5 w-5 mr-2" />
                    3. User Accounts
                  </h2>
                  <p className="text-muted-foreground leading-relaxed mb-4">
                    To use ShiftMint, you must create an account. You are responsible for:
                  </p>
                  <ul className="list-disc list-inside space-y-2 text-muted-foreground">
                    <li>Maintaining the confidentiality of your account credentials</li>
                    <li>All activities that occur under your account</li>
                    <li>Providing accurate and complete information</li>
                    <li>Notifying us immediately of any unauthorized access</li>
                  </ul>
                </section>

                <section>
                  <h2 className="text-xl font-semibold text-foreground mb-4">4. Acceptable Use</h2>
                  <p className="text-muted-foreground leading-relaxed mb-4">
                    You agree not to use ShiftMint to:
                  </p>
                  <ul className="list-disc list-inside space-y-2 text-muted-foreground">
                    <li>Violate any applicable laws or regulations</li>
                    <li>Infringe on intellectual property rights</li>
                    <li>Transmit malicious code or attempt to breach security</li>
                    <li>Interfere with or disrupt the service</li>
                    <li>Use the service for any illegal or unauthorized purpose</li>
                  </ul>
                </section>

                <section>
                  <h2 className="text-xl font-semibold text-foreground mb-4">5. Data and Privacy</h2>
                  <p className="text-muted-foreground leading-relaxed">
                    Your privacy is important to us. Our collection and use of personal information is governed by our Privacy Policy. By using ShiftMint, you consent to the collection and use of your information as described in our Privacy Policy.
                  </p>
                </section>

                <section>
                  <h2 className="text-xl font-semibold text-foreground mb-4">6. Payment Terms</h2>
                  <p className="text-muted-foreground leading-relaxed mb-4">
                    ShiftMint offers various subscription plans:
                  </p>
                  <ul className="list-disc list-inside space-y-2 text-muted-foreground">
                    <li>Free trial period: 30 days with full access</li>
                    <li>Monthly and annual billing options available</li>
                    <li>Automatic renewal unless cancelled</li>
                    <li>Refunds subject to our refund policy</li>
                    <li>Price changes with 30-day notice</li>
                  </ul>
                </section>

                <section>
                  <h2 className="text-xl font-semibold text-foreground mb-4 flex items-center">
                    <Shield className="h-5 w-5 mr-2" />
                    7. Disclaimers and Limitations
                  </h2>
                  <p className="text-muted-foreground leading-relaxed mb-4">
                    ShiftMint is provided "as is" without warranty of any kind. We do not warrant that:
                  </p>
                  <ul className="list-disc list-inside space-y-2 text-muted-foreground">
                    <li>The service will be uninterrupted or error-free</li>
                    <li>All data will be accurate or complete</li>
                    <li>The service will meet your specific requirements</li>
                    <li>Security measures will prevent unauthorized access</li>
                  </ul>
                </section>

                <section>
                  <h2 className="text-xl font-semibold text-foreground mb-4">8. Compliance Disclaimer</h2>
                  <p className="text-muted-foreground leading-relaxed">
                    While ShiftMint includes compliance monitoring features, you remain solely responsible for ensuring compliance with all applicable laws and regulations. ShiftMint is a tool to assist with compliance but does not guarantee legal compliance. We recommend consulting with legal and accounting professionals for specific compliance requirements.
                  </p>
                </section>

                <section>
                  <h2 className="text-xl font-semibold text-foreground mb-4">9. Termination</h2>
                  <p className="text-muted-foreground leading-relaxed">
                    Either party may terminate this agreement at any time. Upon termination, your access to the service will be immediately revoked. We may retain certain data as required by law or for legitimate business purposes.
                  </p>
                </section>

                <section>
                  <h2 className="text-xl font-semibold text-foreground mb-4">10. Changes to Terms</h2>
                  <p className="text-muted-foreground leading-relaxed">
                    We reserve the right to modify these terms at any time. We will notify users of significant changes via email or through the service. Continued use of ShiftMint after changes constitutes acceptance of the new terms.
                  </p>
                </section>

                <section>
                  <h2 className="text-xl font-semibold text-foreground mb-4">11. Governing Law</h2>
                  <p className="text-muted-foreground leading-relaxed">
                    These terms shall be governed by and construed in accordance with the laws of the State of California, without regard to its conflict of law provisions.
                  </p>
                </section>

                <section>
                  <h2 className="text-xl font-semibold text-foreground mb-4">12. Contact Information</h2>
                  <p className="text-muted-foreground leading-relaxed">
                    If you have any questions about these Terms of Service, please contact us at:
                  </p>
                  <div className="mt-4 p-4 bg-muted/20 rounded-lg">
                    <p className="text-foreground font-medium">ShiftMint, Inc.</p>
                    <p className="text-muted-foreground">Email: legal@shiftmint.com</p>
                    <p className="text-muted-foreground">Address: 123 Business Ave, San Francisco, CA 94105</p>
                  </div>
                </section>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Terms; 