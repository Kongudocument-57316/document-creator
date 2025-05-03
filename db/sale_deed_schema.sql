-- Schema for Sale Deed Documents

-- Sale Deed Documents table
CREATE TABLE IF NOT EXISTS sale_deed_documents (
  id SERIAL PRIMARY KEY,
  document_name VARCHAR(255) NOT NULL,
  document_number VARCHAR(100),
  document_date DATE,
  sale_amount DECIMAL(15, 2),
  sale_amount_words TEXT,
  previous_document_date DATE,
  document_year VARCHAR(10),
  document_content TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  
  -- Foreign keys
  sub_registrar_office_id INT REFERENCES sub_registrar_offices(id),
  book_number_id INT REFERENCES book_numbers(id),
  document_type_id INT REFERENCES document_types(id),
  submission_type_id INT REFERENCES submission_types(id),
  typist_id INT REFERENCES typists(id),
  typist_phone VARCHAR(20),
  office_id INT REFERENCES offices(id)
);

-- Junction table for sale deed documents and land types
CREATE TABLE IF NOT EXISTS sale_deed_land_types (
  id SERIAL PRIMARY KEY,
  sale_deed_id INT REFERENCES sale_deed_documents(id) ON DELETE CASCADE,
  land_type_id INT REFERENCES land_types(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Junction table for sale deed documents and value types
CREATE TABLE IF NOT EXISTS sale_deed_value_types (
  id SERIAL PRIMARY KEY,
  sale_deed_id INT REFERENCES sale_deed_documents(id) ON DELETE CASCADE,
  value_type_id INT REFERENCES value_types(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Junction table for sale deed documents and payment methods
CREATE TABLE IF NOT EXISTS sale_deed_payment_methods (
  id SERIAL PRIMARY KEY,
  sale_deed_id INT REFERENCES sale_deed_documents(id) ON DELETE CASCADE,
  payment_method_id INT REFERENCES payment_methods(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Sale deed parties (buyers, sellers, witnesses)
CREATE TABLE IF NOT EXISTS sale_deed_parties (
  id SERIAL PRIMARY KEY,
  sale_deed_id INT REFERENCES sale_deed_documents(id) ON DELETE CASCADE,
  user_id INT REFERENCES users(id) ON DELETE CASCADE,
  party_type VARCHAR(20) NOT NULL, -- 'buyer', 'seller', 'witness'
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Sale deed properties
CREATE TABLE IF NOT EXISTS sale_deed_properties (
  id SERIAL PRIMARY KEY,
  sale_deed_id INT REFERENCES sale_deed_documents(id) ON DELETE CASCADE,
  property_id INT REFERENCES properties(id) ON DELETE CASCADE,
  property_details TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Sale deed buildings
CREATE TABLE IF NOT EXISTS sale_deed_buildings (
  id SERIAL PRIMARY KEY,
  sale_deed_id INT REFERENCES sale_deed_documents(id) ON DELETE CASCADE,
  building_id VARCHAR(100) NOT NULL,
  building_type VARCHAR(100) NOT NULL,
  facing_direction VARCHAR(50),
  total_sq_feet DECIMAL(10, 2),
  building_age INT,
  floors INT,
  rooms INT,
  description TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Sale deed payment details
CREATE TABLE IF NOT EXISTS sale_deed_payment_details (
  id SERIAL PRIMARY KEY,
  sale_deed_id INT REFERENCES sale_deed_documents(id) ON DELETE CASCADE,
  payment_method_id INT REFERENCES payment_methods(id),
  buyer_bank_name VARCHAR(255),
  buyer_bank_branch VARCHAR(255),
  buyer_account_type VARCHAR(100),
  buyer_account_number VARCHAR(100),
  seller_bank_name VARCHAR(255),
  seller_bank_branch VARCHAR(255),
  seller_account_type VARCHAR(100),
  seller_account_number VARCHAR(100),
  transaction_number VARCHAR(100),
  transaction_date DATE,
  amount DECIMAL(15, 2),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Account types table (if not already exists)
CREATE TABLE IF NOT EXISTS account_types (
  id SERIAL PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Insert initial account types if not already populated
INSERT INTO account_types (name) 
VALUES 
  ('Savings Account'),
  ('Current Account'),
  ('Fixed Deposit'),
  ('Recurring Deposit')
ON CONFLICT DO NOTHING;
