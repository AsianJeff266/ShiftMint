import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Logo } from '@/components/ui/logo';
import { ArrowLeft, Calendar, Shield, Eye, Lock, Database, Users } from 'lucide-react';

const Privacy = () => {
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
              <CardTitle className="text-3xl font-bold">Privacy Policy</CardTitle>
              <p className="text-muted-foreground flex items-center justify-center space-x-2">
                <Calendar className="h-4 w-4" />
                <span>Last updated: January 15, 2025</span>
              </p>
            </CardHeader>
            <CardContent className="prose prose-gray max-w-none">
              <div className="space-y-8">
                <section>
                  <h2 className="text-xl font-semibold text-foreground mb-4 flex items-center">
                    <Eye className="h-5 w-5 mr-2" />
                    1. Information We Collect
                  </h2>
                  <p className="text-muted-foreground leading-relaxed mb-4">
                    We collect information you provide directly to us, such as when you create an account, use our services, or contact us. This includes:
                  </p>
                  <ul className="list-disc list-inside space-y-2 text-muted-foreground">
                    <li><strong>Account Information:</strong> Name, email address, phone number, business details</li>
                    <li><strong>Payroll Data:</strong> Employee information, wages, tips, tax information</li>
                    <li><strong>Usage Data:</strong> How you interact with our service, features used, time spent</li>
                    <li><strong>Device Information:</strong> IP address, browser type, device identifiers</li>
                    <li><strong>Communications:</strong> Messages you send us, support requests</li>
                  </ul>
                </section>

                <section>
                  <h2 className="text-xl font-semibold text-foreground mb-4 flex items-center">
                    <Database className="h-5 w-5 mr-2" />
                    2. How We Use Your Information
                  </h2>
                  <p className="text-muted-foreground leading-relaxed mb-4">
                    We use the information we collect to:
                  </p>
                  <ul className="list-disc list-inside space-y-2 text-muted-foreground">
                    <li>Provide, maintain, and improve our payroll services</li>
                    <li>Process payroll calculations and generate reports</li>
                    <li>Ensure compliance with labor laws and regulations</li>
                    <li>Communicate with you about your account and our services</li>
                    <li>Provide customer support and technical assistance</li>
                    <li>Detect and prevent fraud and abuse</li>
                    <li>Analyze usage patterns to improve our service</li>
                  </ul>
                </section>

                <section>
                  <h2 className="text-xl font-semibold text-foreground mb-4 flex items-center">
                    <Users className="h-5 w-5 mr-2" />
                    3. Information Sharing
                  </h2>
                  <p className="text-muted-foreground leading-relaxed mb-4">
                    We do not sell, trade, or otherwise transfer your personal information to third parties, except in the following circumstances:
                  </p>
                  <ul className="list-disc list-inside space-y-2 text-muted-foreground">
                    <li><strong>Service Providers:</strong> Third-party vendors who assist us in operating our service</li>
                    <li><strong>Legal Requirements:</strong> When required by law or to protect our rights</li>
                    <li><strong>Business Transfers:</strong> In connection with a merger, acquisition, or sale of assets</li>
                    <li><strong>Consent:</strong> When you explicitly consent to the sharing</li>
                  </ul>
                </section>

                <section>
                  <h2 className="text-xl font-semibold text-foreground mb-4 flex items-center">
                    <Lock className="h-5 w-5 mr-2" />
                    4. Data Security
                  </h2>
                  <p className="text-muted-foreground leading-relaxed mb-4">
                    We implement appropriate security measures to protect your personal information:
                  </p>
                  <ul className="list-disc list-inside space-y-2 text-muted-foreground">
                    <li>End-to-end encryption for all data transmission</li>
                    <li>Regular security audits and penetration testing</li>
                    <li>Multi-factor authentication for account access</li>
                    <li>Secure data centers with 24/7 monitoring</li>
                    <li>Regular backup and disaster recovery procedures</li>
                    <li>Employee training on data privacy and security</li>
                  </ul>
                </section>

                <section>
                  <h2 className="text-xl font-semibold text-foreground mb-4">5. Data Retention</h2>
                  <p className="text-muted-foreground leading-relaxed mb-4">
                    We retain your information for as long as necessary to provide our services and comply with legal obligations:
                  </p>
                  <ul className="list-disc list-inside space-y-2 text-muted-foreground">
                    <li>Account information: Until account deletion or 7 years after last activity</li>
                    <li>Payroll data: 7 years as required by tax and labor laws</li>
                    <li>Usage data: 2 years for service improvement purposes</li>
                    <li>Support communications: 3 years for quality assurance</li>
                  </ul>
                </section>

                <section>
                  <h2 className="text-xl font-semibold text-foreground mb-4">6. Your Rights</h2>
                  <p className="text-muted-foreground leading-relaxed mb-4">
                    You have the following rights regarding your personal information:
                  </p>
                  <ul className="list-disc list-inside space-y-2 text-muted-foreground">
                    <li><strong>Access:</strong> Request copies of your personal information</li>
                    <li><strong>Correction:</strong> Request correction of inaccurate information</li>
                    <li><strong>Deletion:</strong> Request deletion of your personal information</li>
                    <li><strong>Portability:</strong> Request transfer of your data to another service</li>
                    <li><strong>Objection:</strong> Object to processing of your information</li>
                  </ul>
                </section>

                <section>
                  <h2 className="text-xl font-semibold text-foreground mb-4">7. Cookies and Tracking</h2>
                  <p className="text-muted-foreground leading-relaxed mb-4">
                    We use cookies and similar technologies to:
                  </p>
                  <ul className="list-disc list-inside space-y-2 text-muted-foreground">
                    <li>Remember your preferences and settings</li>
                    <li>Analyze website traffic and usage patterns</li>
                    <li>Provide personalized content and advertisements</li>
                    <li>Improve security and prevent fraud</li>
                  </ul>
                  <p className="text-muted-foreground leading-relaxed mt-4">
                    You can control cookies through your browser settings, but disabling cookies may affect functionality.
                  </p>
                </section>

                <section>
                  <h2 className="text-xl font-semibold text-foreground mb-4">8. Third-Party Services</h2>
                  <p className="text-muted-foreground leading-relaxed mb-4">
                    ShiftMint may integrate with third-party services including:
                  </p>
                  <ul className="list-disc list-inside space-y-2 text-muted-foreground">
                    <li>Point-of-sale systems for tip data import</li>
                    <li>Banking services for payroll processing</li>
                    <li>Tax preparation software for compliance</li>
                    <li>Analytics services for usage monitoring</li>
                  </ul>
                  <p className="text-muted-foreground leading-relaxed mt-4">
                    These third parties have their own privacy policies, and we are not responsible for their practices.
                  </p>
                </section>

                <section>
                  <h2 className="text-xl font-semibold text-foreground mb-4">9. International Data Transfers</h2>
                  <p className="text-muted-foreground leading-relaxed">
                    Your information may be transferred to and processed in countries other than your own. We ensure adequate protection through appropriate safeguards such as standard contractual clauses and certification under privacy frameworks.
                  </p>
                </section>

                <section>
                  <h2 className="text-xl font-semibold text-foreground mb-4">10. Children's Privacy</h2>
                  <p className="text-muted-foreground leading-relaxed">
                    ShiftMint is not intended for use by children under 13. We do not knowingly collect personal information from children under 13. If we become aware that we have collected such information, we will take steps to delete it immediately.
                  </p>
                </section>

                <section>
                  <h2 className="text-xl font-semibold text-foreground mb-4">11. Changes to Privacy Policy</h2>
                  <p className="text-muted-foreground leading-relaxed">
                    We may update this Privacy Policy from time to time. We will notify you of significant changes by email or through our service. Your continued use of ShiftMint after such changes constitutes acceptance of the updated policy.
                  </p>
                </section>

                <section>
                  <h2 className="text-xl font-semibold text-foreground mb-4 flex items-center">
                    <Shield className="h-5 w-5 mr-2" />
                    12. Contact Us
                  </h2>
                  <p className="text-muted-foreground leading-relaxed">
                    If you have any questions about this Privacy Policy or our data practices, please contact us:
                  </p>
                  <div className="mt-4 p-4 bg-muted/20 rounded-lg">
                    <p className="text-foreground font-medium">ShiftMint Privacy Team</p>
                    <p className="text-muted-foreground">Email: privacy@shiftmint.com</p>
                    <p className="text-muted-foreground">Address: 123 Business Ave, San Francisco, CA 94105</p>
                    <p className="text-muted-foreground">Phone: (555) 123-4567</p>
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

export default Privacy; 