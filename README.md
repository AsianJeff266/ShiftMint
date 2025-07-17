# ShiftMint - Complete Payroll & Labor Management System

![ShiftMint Logo](https://img.shields.io/badge/ShiftMint-Payroll%20%26%20Labor-blue?style=for-the-badge)

## 🎯 **Unique Selling Point**

ShiftMint's core strength is **comprehensive data synthesis** - taking all employee data, shift records, tip information, and payroll calculations and making them exportable into clean CSV/Excel files for easy tax filing and compliance.

## ✨ **Key Features Implemented**

### 🔐 **Complete Account Settings System**
- **Profile & Authentication** - Password management, 2FA toggle, session management
- **Business Settings** - Complete business info, address, tax details (EIN, state)
- **Payroll Configuration** - Pay frequency, overtime rules, tip handling
- **POS & Integration Settings** - System selection, API management
- **Team & Permissions** - Role-based access control
- **Notifications & Alerts** - Email/SMS preferences, anomaly thresholds
- **Audit & Compliance** - Log viewer, export settings, compliance rules
- **Billing & Subscription** - Plan management framework
- **Advanced Settings** - API access, data export, backup options

### 👥 **Employee Management System**
- **Comprehensive Employee Registration** - All data from onboarding process
- **Full CRUD Operations** - Create, read, update, delete employees
- **Status Management** - Active, inactive, terminated, invited
- **Invitation System** - Email invitations to employees
- **Wage Management** - Hourly rates, overtime calculations
- **Tax Information** - Filing status, exemptions, banking details
- **CSV Export** - Complete employee data export

### ⏰ **Time & Labor Management**
- **Active Shift Tracking** - Real-time shift monitoring
- **Hours Editing** - Modify existing payroll slip hours (no start/stop to prevent conflicts)
- **Job Code Assignments** - Different shift types and categories
- **Earnings Calculations** - Real-time regular/overtime pay calculations
- **Duration Tracking** - Automatic time calculations
- **Comprehensive Filtering** - Date ranges, status, employee search
- **Anomaly Detection** - Flag excessive hours or unusual patterns

### 💰 **Payroll Period System**
- **Automated Payroll Generation** - Creates periods with automatic calculations
- **Employee Payroll Entries** - Individual calculations per employee
- **Overtime Calculations** - FLSA-compliant 1.5x overtime rates
- **Tip Integration** - Pulls tips from tip_entries table
- **Tax Deductions** - Automatic tax calculations
- **Manual Adjustments** - Override calculations when needed
- **Period Management** - Lock, unlock, submit payroll periods
- **Audit Trails** - Complete change logging for compliance

### 📊 **Data Export & Integration (Core Feature)**
- **CSV Export** - All data types in clean, tax-ready formats
- **Excel Support** - Comprehensive data files
- **PDF Reporting** - Business summaries and reports
- **Date Range Filtering** - Export specific time periods
- **Multi-format Support** - Choose export format per need
- **Real-time Data** - No mock data, all exports use actual database records

### 🔄 **Complete Data Integration**
- **Employee Data** → **Shift Tracking** → **Payroll Calculations** → **Export**
- All information flows seamlessly between modules
- Comprehensive data synthesis for tax filing
- Real Supabase backend with audit logging

## 🗄️ **Database Schema**

Complete implementation with:
- **businesses** - Business information and configuration
- **users** - User accounts linked to auth.users  
- **employees** - Employee records with payroll data
- **shifts** - Time tracking and labor records
- **tip_entries** - Tip tracking and distribution
- **payroll_periods** - Payroll period management
- **payroll_entries** - Individual employee payroll data
- **audit_logs** - Complete audit trail

## 🚀 **Tech Stack**

- **Frontend**: React + TypeScript + Vite
- **UI Components**: Radix UI + Tailwind CSS
- **Database**: Supabase (PostgreSQL)
- **Authentication**: Supabase Auth
- **State Management**: React Hooks + Context
- **Export**: CSV/Excel/PDF generation
- **Icons**: Lucide React

## 🛠️ **Setup Instructions**

### Prerequisites
- Node.js 18+ 
- Git
- Supabase account

### Installation

1. **Clone the repository**
   ```bash
   git clone <your-repo-url>
   cd shift-savvy-pay-main
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Environment Setup**
   - Copy `.env.example` to `.env`
   - Add your Supabase credentials:
     ```
     VITE_SUPABASE_URL=your_supabase_url
     VITE_SUPABASE_ANON_KEY=your_anon_key
     ```

4. **Database Setup**
   - Run the SQL scripts in `DATABASE_SETUP_ENHANCED.md`
   - Set up Row Level Security policies
   - Create the required tables and indexes

5. **Start Development Server**
   ```bash
   npm run dev
   ```

6. **Build for Production**
   ```bash
   npm run build
   ```

## 📱 **Usage**

### **Getting Started**
1. **Create Account** - Use the 3-step onboarding process
2. **Add Employees** - Complete employee management system
3. **Track Time** - Monitor shifts and edit hours as needed
4. **Run Payroll** - Create periods and generate payroll
5. **Export Data** - Download CSV/Excel files for tax filing

### **Core Workflows**
- **Employee Onboarding** → **Shift Tracking** → **Payroll Generation** → **Data Export**
- All data is integrated and flows seamlessly between modules

## 🔐 **Security & Compliance**

- **Row Level Security** - Database-level access control
- **Audit Logging** - Complete change tracking
- **Role-based Permissions** - Admin, Manager, Employee access levels
- **Data Encryption** - Supabase handles encryption at rest
- **Secure Authentication** - Supabase Auth with session management

## 📈 **Key Differentiators**

1. **Complete Data Synthesis** - Export everything in tax-ready formats
2. **No Mock Data** - All functionality uses real database integration
3. **Comprehensive Features** - From employee management to payroll export
4. **Audit Compliance** - Complete logging for business compliance
5. **Real-time Calculations** - Instant payroll and earnings calculations

## 🎉 **Project Status**

✅ **COMPLETE** - All requested functionality implemented:
- Account settings (9 comprehensive sections)
- Employee management with backend storage
- Time & labor management with hours editing
- Payroll period creation and management
- CSV/Excel export system (core selling point)
- Real data pipelines throughout
- Audit compliance and logging

## 📞 **Support**

For questions about implementation or usage, refer to:
- `DATABASE_SETUP_ENHANCED.md` - Complete database schema
- `BACKEND_IMPLEMENTATION_SUMMARY.md` - Technical implementation details

---

**ShiftMint** - Making payroll and labor management simple, compliant, and exportable. 