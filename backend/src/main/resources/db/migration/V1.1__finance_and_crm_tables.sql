-- ABHA Enterprise - Finance and CRM Tables
-- Version: 1.1
-- Description: Finance workflow and CRM tables

-- ============================================================================
-- FINANCE WORKFLOW
-- ============================================================================

-- Finance partners table
CREATE TABLE finance_partners (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(255) NOT NULL,
    code VARCHAR(50) NOT NULL UNIQUE,
    partner_type VARCHAR(50) NOT NULL,
    logo_url VARCHAR(500),
    website VARCHAR(255),
    contact_person VARCHAR(255),
    contact_email VARCHAR(255),
    contact_phone VARCHAR(20),
    agreement_start DATE,
    agreement_end DATE,
    is_active BOOLEAN NOT NULL DEFAULT true,
    display_order INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
    CHECK (partner_type IN ('bank', 'nbfc', 'other'))
);

CREATE INDEX idx_finance_partners_code ON finance_partners(code);
CREATE INDEX idx_finance_partners_is_active ON finance_partners(is_active);

-- Finance products table
CREATE TABLE finance_products (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    partner_id UUID NOT NULL REFERENCES finance_partners(id) ON DELETE CASCADE,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    min_loan_amount NUMERIC(12, 2),
    max_loan_amount NUMERIC(12, 2),
    min_interest_rate NUMERIC(5, 2),
    max_interest_rate NUMERIC(5, 2),
    min_tenure_months INTEGER,
    max_tenure_months INTEGER,
    processing_fee_pct NUMERIC(5, 2),
    disclaimer TEXT,
    eligibility_criteria TEXT,
    is_active BOOLEAN NOT NULL DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_finance_products_partner_id ON finance_products(partner_id);
CREATE INDEX idx_finance_products_is_active ON finance_products(is_active);

-- Loan applications table
CREATE TABLE loan_applications (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    application_number VARCHAR(50) NOT NULL UNIQUE,
    customer_id UUID NOT NULL REFERENCES customers(id) ON DELETE RESTRICT,
    product_variant_id UUID REFERENCES product_variants(id) ON DELETE SET NULL,
    partner_id UUID REFERENCES finance_partners(id) ON DELETE SET NULL,
    vehicle_price NUMERIC(12, 2) NOT NULL,
    down_payment NUMERIC(12, 2) NOT NULL,
    requested_amount NUMERIC(12, 2) NOT NULL,
    tenure_months INTEGER NOT NULL,
    estimated_emi NUMERIC(12, 2),
    estimated_rate NUMERIC(5, 2),
    status VARCHAR(50) NOT NULL DEFAULT 'submitted',
    assigned_to UUID REFERENCES users(id) ON DELETE SET NULL,
    applicant_name VARCHAR(255) NOT NULL,
    applicant_email VARCHAR(255),
    applicant_phone VARCHAR(20) NOT NULL,
    applicant_city VARCHAR(100),
    applicant_pincode VARCHAR(10),
    employment_type VARCHAR(50),
    monthly_income NUMERIC(12, 2),
    consent_at TIMESTAMP WITH TIME ZONE NOT NULL,
    consent_text TEXT,
    submitted_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
    approved_at TIMESTAMP WITH TIME ZONE,
    approved_by UUID REFERENCES users(id) ON DELETE SET NULL,
    approved_amount NUMERIC(12, 2),
    approved_tenure INTEGER,
    approved_rate NUMERIC(5, 2),
    disbursed_at TIMESTAMP WITH TIME ZONE,
    rejected_at TIMESTAMP WITH TIME ZONE,
    rejection_reason TEXT,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
    CHECK (status IN ('submitted', 'under_review', 'documents_pending', 'documents_verified', 
                      'referred_to_partner', 'partner_decision_pending', 'approved', 
                      'rejected', 'withdrawn', 'disbursed')),
    CHECK (requested_amount > 0),
    CHECK (down_payment >= 0),
    CHECK (requested_amount <= vehicle_price - down_payment),
    CHECK (tenure_months > 0)
);

CREATE INDEX idx_loan_apps_application_number ON loan_applications(application_number);
CREATE INDEX idx_loan_apps_customer_id ON loan_applications(customer_id);
CREATE INDEX idx_loan_apps_status ON loan_applications(status);
CREATE INDEX idx_loan_apps_assigned_to ON loan_applications(assigned_to);
CREATE INDEX idx_loan_apps_partner_id ON loan_applications(partner_id);
CREATE INDEX idx_loan_apps_submitted_at ON loan_applications(submitted_at DESC);

-- Loan documents table
CREATE TABLE loan_documents (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    application_id UUID NOT NULL REFERENCES loan_applications(id) ON DELETE CASCADE,
    document_type VARCHAR(100) NOT NULL,
    document_name VARCHAR(255) NOT NULL,
    private_file_key VARCHAR(500) NOT NULL,
    file_size_bytes BIGINT,
    mime_type VARCHAR(100),
    uploaded_by UUID REFERENCES users(id) ON DELETE SET NULL,
    uploaded_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
    review_status VARCHAR(50) DEFAULT 'pending',
    reviewed_by UUID REFERENCES users(id) ON DELETE SET NULL,
    reviewed_at TIMESTAMP WITH TIME ZONE,
    review_notes TEXT,
    is_verified BOOLEAN DEFAULT false,
    expires_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
    CHECK (review_status IN ('pending', 'approved', 'rejected', 'expired'))
);

CREATE INDEX idx_loan_docs_application_id ON loan_documents(application_id);
CREATE INDEX idx_loan_docs_review_status ON loan_documents(review_status);
CREATE INDEX idx_loan_docs_uploaded_at ON loan_documents(uploaded_at DESC);

-- Loan status history table
CREATE TABLE loan_status_history (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    application_id UUID NOT NULL REFERENCES loan_applications(id) ON DELETE CASCADE,
    old_status VARCHAR(50),
    new_status VARCHAR(50) NOT NULL,
    changed_by UUID REFERENCES users(id) ON DELETE SET NULL,
    reason TEXT,
    notes TEXT,
    metadata JSONB,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_loan_history_application_id ON loan_status_history(application_id);
CREATE INDEX idx_loan_history_created_at ON loan_status_history(created_at DESC);

-- Loan followups table
CREATE TABLE loan_followups (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    application_id UUID NOT NULL REFERENCES loan_applications(id) ON DELETE CASCADE,
    assigned_to UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    followup_type VARCHAR(50) NOT NULL,
    due_at TIMESTAMP WITH TIME ZONE NOT NULL,
    completed_at TIMESTAMP WITH TIME ZONE,
    outcome VARCHAR(50),
    notes TEXT,
    next_followup_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
    CHECK (followup_type IN ('call', 'email', 'whatsapp', 'sms', 'meeting', 'other'))
);

CREATE INDEX idx_loan_followups_application_id ON loan_followups(application_id);
CREATE INDEX idx_loan_followups_assigned_to ON loan_followups(assigned_to);
CREATE INDEX idx_loan_followups_due_at ON loan_followups(due_at);
CREATE INDEX idx_loan_followups_completed ON loan_followups(completed_at) WHERE completed_at IS NOT NULL;

-- ============================================================================
-- CRM AND OPERATIONS
-- ============================================================================

-- Enquiries table
CREATE TABLE enquiries (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    enquiry_number VARCHAR(50) NOT NULL UNIQUE,
    customer_id UUID REFERENCES customers(id) ON DELETE SET NULL,
    source VARCHAR(50) NOT NULL,
    enquiry_type VARCHAR(50) NOT NULL,
    product_id UUID REFERENCES products(id) ON DELETE SET NULL,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255),
    phone VARCHAR(20) NOT NULL,
    city VARCHAR(100),
    message TEXT,
    status VARCHAR(50) NOT NULL DEFAULT 'new',
    priority VARCHAR(20) DEFAULT 'medium',
    assigned_to UUID REFERENCES users(id) ON DELETE SET NULL,
    assigned_at TIMESTAMP WITH TIME ZONE,
    resolved_at TIMESTAMP WITH TIME ZONE,
    resolution_notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
    CHECK (status IN ('new', 'contacted', 'in_progress', 'resolved', 'closed', 'spam')),
    CHECK (priority IN ('low', 'medium', 'high', 'urgent')),
    CHECK (enquiry_type IN ('product', 'booking', 'service', 'finance', 'general', 'complaint'))
);

CREATE INDEX idx_enquiries_enquiry_number ON enquiries(enquiry_number);
CREATE INDEX idx_enquiries_customer_id ON enquiries(customer_id);
CREATE INDEX idx_enquiries_status ON enquiries(status);
CREATE INDEX idx_enquiries_assigned_to ON enquiries(assigned_to);
CREATE INDEX idx_enquiries_source ON enquiries(source);
CREATE INDEX idx_enquiries_created_at ON enquiries(created_at DESC);

-- Call logs table
CREATE TABLE call_logs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    customer_id UUID REFERENCES customers(id) ON DELETE SET NULL,
    enquiry_id UUID REFERENCES enquiries(id) ON DELETE SET NULL,
    employee_id UUID NOT NULL REFERENCES employees(id) ON DELETE CASCADE,
    call_type VARCHAR(50) NOT NULL,
    call_duration_sec INTEGER,
    call_at TIMESTAMP WITH TIME ZONE NOT NULL,
    outcome VARCHAR(50),
    notes TEXT,
    next_followup_at TIMESTAMP WITH TIME ZONE,
    recording_url VARCHAR(500),
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
    CHECK (call_type IN ('inbound', 'outbound'))
);

CREATE INDEX idx_call_logs_customer_id ON call_logs(customer_id);
CREATE INDEX idx_call_logs_enquiry_id ON call_logs(enquiry_id);
CREATE INDEX idx_call_logs_employee_id ON call_logs(employee_id);
CREATE INDEX idx_call_logs_call_at ON call_logs(call_at DESC);

-- Tasks table
CREATE TABLE tasks (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title VARCHAR(255) NOT NULL,
    description TEXT,
    task_type VARCHAR(50),
    priority VARCHAR(20) DEFAULT 'medium',
    status VARCHAR(50) NOT NULL DEFAULT 'pending',
    assigned_to UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    created_by UUID REFERENCES users(id) ON DELETE SET NULL,
    due_at TIMESTAMP WITH TIME ZONE,
    completed_at TIMESTAMP WITH TIME ZONE,
    related_type VARCHAR(50),
    related_id UUID,
    notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
    CHECK (priority IN ('low', 'medium', 'high', 'urgent')),
    CHECK (status IN ('pending', 'in_progress', 'completed', 'cancelled'))
);

CREATE INDEX idx_tasks_assigned_to ON tasks(assigned_to);
CREATE INDEX idx_tasks_status ON tasks(status);
CREATE INDEX idx_tasks_due_at ON tasks(due_at);
CREATE INDEX idx_tasks_related ON tasks(related_type, related_id);
CREATE INDEX idx_tasks_created_at ON tasks(created_at DESC);

-- Audit logs table
CREATE TABLE audit_logs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    actor_user_id UUID REFERENCES users(id) ON DELETE SET NULL,
    action VARCHAR(100) NOT NULL,
    entity_type VARCHAR(100) NOT NULL,
    entity_id UUID NOT NULL,
    before_json JSONB,
    after_json JSONB,
    ip_address INET,
    user_agent TEXT,
    request_id VARCHAR(100),
    severity VARCHAR(20) DEFAULT 'info',
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
    CHECK (severity IN ('info', 'warning', 'critical'))
);

CREATE INDEX idx_audit_logs_actor_user_id ON audit_logs(actor_user_id);
CREATE INDEX idx_audit_logs_entity ON audit_logs(entity_type, entity_id);
CREATE INDEX idx_audit_logs_action ON audit_logs(action);
CREATE INDEX idx_audit_logs_created_at ON audit_logs(created_at DESC);
CREATE INDEX idx_audit_logs_severity ON audit_logs(severity) WHERE severity IN ('warning', 'critical');

-- Notifications table
CREATE TABLE notifications (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    channel VARCHAR(50) NOT NULL,
    recipient VARCHAR(255) NOT NULL,
    template_key VARCHAR(100) NOT NULL,
    subject VARCHAR(255),
    payload_json JSONB NOT NULL,
    status VARCHAR(50) NOT NULL DEFAULT 'pending',
    sent_at TIMESTAMP WITH TIME ZONE,
    delivered_at TIMESTAMP WITH TIME ZONE,
    opened_at TIMESTAMP WITH TIME ZONE,
    provider_id VARCHAR(255),
    provider_response JSONB,
    error_message TEXT,
    retry_count INTEGER DEFAULT 0,
    max_retries INTEGER DEFAULT 3,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
    CHECK (channel IN ('email', 'sms', 'whatsapp', 'push', 'in_app')),
    CHECK (status IN ('pending', 'queued', 'sent', 'delivered', 'failed', 'bounced'))
);

CREATE INDEX idx_notifications_user_id ON notifications(user_id);
CREATE INDEX idx_notifications_status ON notifications(status);
CREATE INDEX idx_notifications_channel ON notifications(channel);
CREATE INDEX idx_notifications_created_at ON notifications(created_at DESC);
CREATE INDEX idx_notifications_pending ON notifications(status, retry_count) 
    WHERE status = 'pending' OR (status = 'failed' AND retry_count < max_retries);

-- ============================================================================
-- COMMENTS
-- ============================================================================

COMMENT ON TABLE users IS 'Central user identity mapping for both customers and staff';
COMMENT ON TABLE roles IS 'System roles for RBAC';
COMMENT ON TABLE permissions IS 'Fine-grained permission catalogue';
COMMENT ON TABLE customers IS 'Customer profile information';
COMMENT ON TABLE employees IS 'Staff member information';
COMMENT ON TABLE brands IS 'Vehicle manufacturers and brands';
COMMENT ON TABLE product_categories IS 'Hierarchical product categorization';
COMMENT ON TABLE products IS 'Core product catalogue';
COMMENT ON TABLE product_variants IS 'Product variations (color, battery, etc.)';
COMMENT ON TABLE inventory IS 'Stock tracking per variant per location';
COMMENT ON TABLE inventory_transactions IS 'Immutable stock movement history';
COMMENT ON TABLE orders IS 'Customer orders';
COMMENT ON TABLE order_items IS 'Order line items with product snapshots';
COMMENT ON TABLE bookings IS 'Vehicle reservations before full order';
COMMENT ON TABLE payments IS 'Payment transaction records';
COMMENT ON TABLE invoices IS 'Tax invoices for completed orders';
COMMENT ON TABLE loan_applications IS 'Customer finance enquiries and applications';
COMMENT ON TABLE loan_documents IS 'Secure document storage metadata';
COMMENT ON TABLE loan_status_history IS 'Immutable audit trail of application status changes';
COMMENT ON TABLE enquiries IS 'General customer enquiries (pre-sales)';
COMMENT ON TABLE tasks IS 'Generic task/work queue for staff';
COMMENT ON TABLE audit_logs IS 'Security and compliance audit trail';
COMMENT ON TABLE notifications IS 'Email/SMS/WhatsApp notification queue';
