-- Schema for Tamil Document Management System

-- Users/Parties table
CREATE TABLE IF NOT EXISTS users (
  id SERIAL PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  father_name VARCHAR(255),
  address TEXT,
  phone VARCHAR(20),
  email VARCHAR(255),
  age INT,
  gender VARCHAR(10),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- States table
CREATE TABLE IF NOT EXISTS states (
  id SERIAL PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Districts table
CREATE TABLE IF NOT EXISTS districts (
  id SERIAL PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  state_id INT REFERENCES states(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Taluks table
CREATE TABLE IF NOT EXISTS taluks (
  id SERIAL PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  district_id INT REFERENCES districts(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Villages table
CREATE TABLE IF NOT EXISTS villages (
  id SERIAL PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  taluk_id INT REFERENCES taluks(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Tahsildar offices table
CREATE TABLE IF NOT EXISTS tahsildar_offices (
  id SERIAL PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  taluk_id INT REFERENCES taluks(id) ON DELETE CASCADE,
  address TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Registration districts table
CREATE TABLE IF NOT EXISTS registration_districts (
  id SERIAL PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  district_id INT REFERENCES districts(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Sub-registrar offices table
CREATE TABLE IF NOT EXISTS sub_registrar_offices (
  id SERIAL PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  registration_district_id INT REFERENCES registration_districts(id) ON DELETE CASCADE,
  address TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Properties table
CREATE TABLE IF NOT EXISTS properties (
  id SERIAL PRIMARY KEY,
  survey_number VARCHAR(100),
  subdivision_number VARCHAR(100),
  patta_number VARCHAR(100),
  old_survey_number VARCHAR(100),
  village_id INT REFERENCES villages(id),
  taluk_id INT REFERENCES taluks(id),
  district_id INT REFERENCES districts(id),
  state_id INT REFERENCES states(id),
  area_value DECIMAL(10, 2),
  area_unit VARCHAR(50),
  north_boundary TEXT,
  south_boundary TEXT,
  east_boundary TEXT,
  west_boundary TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Document types table
CREATE TABLE IF NOT EXISTS document_types (
  id SERIAL PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Submission types table
CREATE TABLE IF NOT EXISTS submission_types (
  id SERIAL PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Book numbers table
CREATE TABLE IF NOT EXISTS book_numbers (
  id SERIAL PRIMARY KEY,
  number VARCHAR(50) NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Typists table
CREATE TABLE IF NOT EXISTS typists (
  id SERIAL PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  license_number VARCHAR(100),
  address TEXT,
  phone VARCHAR(20),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Offices table
CREATE TABLE IF NOT EXISTS offices (
  id SERIAL PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  address TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Payment methods table
CREATE TABLE IF NOT EXISTS payment_methods (
  id SERIAL PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Certificate types table
CREATE TABLE IF NOT EXISTS certificate_types (
  id SERIAL PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Land types table
CREATE TABLE IF NOT EXISTS land_types (
  id SERIAL PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Value types table
CREATE TABLE IF NOT EXISTS value_types (
  id SERIAL PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Building details table
CREATE TABLE IF NOT EXISTS building_details (
  id SERIAL PRIMARY KEY,
  property_id INT REFERENCES properties(id) ON DELETE CASCADE,
  door_number VARCHAR(100),
  building_name VARCHAR(255),
  street VARCHAR(255),
  area VARCHAR(255),
  city VARCHAR(255),
  pincode VARCHAR(20),
  construction_year INT,
  building_type VARCHAR(100),
  floors INT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Sale documents table
CREATE TABLE IF NOT EXISTS sale_documents (
  id SERIAL PRIMARY KEY,
  document_number VARCHAR(100),
  document_date DATE,
  document_type_id INT REFERENCES document_types(id),
  submission_type_id INT REFERENCES submission_types(id),
  book_number_id INT REFERENCES book_numbers(id),
  seller_id INT REFERENCES users(id),
  buyer_id INT REFERENCES users(id),
  property_id INT REFERENCES properties(id),
  typist_id INT REFERENCES typists(id),
  office_id INT REFERENCES offices(id),
  sub_registrar_office_id INT REFERENCES sub_registrar_offices(id),
  sale_amount DECIMAL(15, 2),
  advance_amount DECIMAL(15, 2),
  registration_fee DECIMAL(10, 2),
  stamp_duty DECIMAL(10, 2),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Sale agreements table
CREATE TABLE IF NOT EXISTS sale_agreements (
  id SERIAL PRIMARY KEY,
  agreement_number VARCHAR(100),
  agreement_date DATE,
  seller_id INT REFERENCES users(id),
  buyer_id INT REFERENCES users(id),
  property_id INT REFERENCES properties(id),
  typist_id INT REFERENCES typists(id),
  office_id INT REFERENCES offices(id),
  sale_amount DECIMAL(15, 2),
  advance_amount DECIMAL(15, 2),
  balance_amount DECIMAL(15, 2),
  agreement_period INT,
  agreement_period_unit VARCHAR(20),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Witnesses table
CREATE TABLE IF NOT EXISTS witnesses (
  id SERIAL PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  father_name VARCHAR(255),
  address TEXT,
  age INT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Document witnesses junction table
CREATE TABLE IF NOT EXISTS document_witnesses (
  id SERIAL PRIMARY KEY,
  document_type VARCHAR(50) NOT NULL, -- 'sale', 'agreement', 'settlement', etc.
  document_id INT NOT NULL,
  witness_id INT REFERENCES witnesses(id) ON DELETE CASCADE,
  witness_type VARCHAR(50), -- 'seller_witness', 'buyer_witness', etc.
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Settlement documents table
CREATE TABLE IF NOT EXISTS settlement_documents (
  id SERIAL PRIMARY KEY,
  document_number VARCHAR(100),
  document_date DATE,
  document_type_id INT REFERENCES document_types(id),
  submission_type_id INT REFERENCES submission_types(id),
  book_number_id INT REFERENCES book_numbers(id),
  settler_id INT REFERENCES users(id),
  beneficiary_id INT REFERENCES users(id),
  property_id INT REFERENCES properties(id),
  typist_id INT REFERENCES typists(id),
  office_id INT REFERENCES offices(id),
  sub_registrar_office_id INT REFERENCES sub_registrar_offices(id),
  settlement_value DECIMAL(15, 2),
  registration_fee DECIMAL(10, 2),
  stamp_duty DECIMAL(10, 2),
  settlement_reason TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Partition release documents table
CREATE TABLE IF NOT EXISTS partition_release_documents (
  id SERIAL PRIMARY KEY,
  document_number VARCHAR(100),
  document_date DATE,
  document_type_id INT REFERENCES document_types(id),
  submission_type_id INT REFERENCES submission_types(id),
  book_number_id INT REFERENCES book_numbers(id),
  releaser_id INT REFERENCES users(id),
  releasee_id INT REFERENCES users(id),
  property_id INT REFERENCES properties(id),
  typist_id INT REFERENCES typists(id),
  office_id INT REFERENCES offices(id),
  sub_registrar_office_id INT REFERENCES sub_registrar_offices(id),
  release_value DECIMAL(15, 2),
  registration_fee DECIMAL(10, 2),
  stamp_duty DECIMAL(10, 2),
  release_reason TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Mortgage loan documents table
CREATE TABLE IF NOT EXISTS mortgage_loan_documents (
  id SERIAL PRIMARY KEY,
  document_number VARCHAR(100),
  document_date DATE,
  document_type_id INT REFERENCES document_types(id),
  submission_type_id INT REFERENCES submission_types(id),
  book_number_id INT REFERENCES book_numbers(id),
  borrower_id INT REFERENCES users(id),
  lender_id INT REFERENCES users(id),
  property_id INT REFERENCES properties(id),
  typist_id INT REFERENCES typists(id),
  office_id INT REFERENCES offices(id),
  sub_registrar_office_id INT REFERENCES sub_registrar_offices(id),
  loan_amount DECIMAL(15, 2),
  interest_rate DECIMAL(5, 2),
  loan_period INT,
  loan_period_unit VARCHAR(20),
  registration_fee DECIMAL(10, 2),
  stamp_duty DECIMAL(10, 2),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Multiple borrowers for mortgage loans
CREATE TABLE IF NOT EXISTS mortgage_loan_borrowers (
  id SERIAL PRIMARY KEY,
  mortgage_loan_id INT REFERENCES mortgage_loan_documents(id) ON DELETE CASCADE,
  borrower_id INT REFERENCES users(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Multiple lenders for mortgage loans
CREATE TABLE IF NOT EXISTS mortgage_loan_lenders (
  id SERIAL PRIMARY KEY,
  mortgage_loan_id INT REFERENCES mortgage_loan_documents(id) ON DELETE CASCADE,
  lender_id INT REFERENCES users(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Mortgage loan receipts table
CREATE TABLE IF NOT EXISTS mortgage_loan_receipts (
  id SERIAL PRIMARY KEY,
  receipt_number VARCHAR(100),
  receipt_date DATE,
  mortgage_loan_id INT REFERENCES mortgage_loan_documents(id) ON DELETE CASCADE,
  payment_amount DECIMAL(15, 2),
  payment_method_id INT REFERENCES payment_methods(id),
  payment_reference VARCHAR(100),
  remarks TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Multiple properties for sale agreements
CREATE TABLE IF NOT EXISTS sale_agreement_properties (
  id SERIAL PRIMARY KEY,
  sale_agreement_id INT REFERENCES sale_agreements(id) ON DELETE CASCADE,
  property_id INT REFERENCES properties(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Insert some initial data for lookup tables
INSERT INTO document_types (name) VALUES 
  ('Sale Deed'), 
  ('Sale Agreement'), 
  ('Settlement Deed'), 
  ('Partition Deed'), 
  ('Mortgage Deed');

INSERT INTO submission_types (name) VALUES 
  ('Original'), 
  ('Duplicate'), 
  ('Certified Copy');

INSERT INTO book_numbers (number) VALUES 
  ('Book 1'), 
  ('Book 2'), 
  ('Book 3'), 
  ('Book 4');

INSERT INTO payment_methods (name) VALUES 
  ('Cash'), 
  ('Cheque'), 
  ('Bank Transfer'), 
  ('Demand Draft');

INSERT INTO certificate_types (name) VALUES 
  ('Encumbrance Certificate'), 
  ('Legal Heir Certificate'), 
  ('Income Certificate');

INSERT INTO land_types (name) VALUES 
  ('Agricultural'), 
  ('Residential'), 
  ('Commercial'), 
  ('Industrial');

INSERT INTO value_types (name) VALUES 
  ('Market Value'), 
  ('Guideline Value'), 
  ('Registered Value');
