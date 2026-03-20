-- Insert the Metro Lines
INSERT INTO lines (name, color) VALUES 
('North-South', 'Blue'),
('East-West', 'Green'),
('Joka-Esplanade', 'Purple'),
('New Garia-Airport', 'Orange'),
('Noapara-Barasat', 'Yellow'),
('Baranagar-Barrackpore', 'Pink');

-- Insert key stations
INSERT INTO stations (name, is_interchange) VALUES 
('Dakshineswar', false), ('Baranagar', true), ('Noapara', true), ('Dum Dum', false), ('Shyambazar', false), ('MG Road', false), ('Central', false), ('Chandni Chowk', false),
('Esplanade', true), ('Kavi Subhash', true), ('Salt Lake Sector V', true), ('Majerhat', true),
('Howrah Maidan', false), ('Howrah', false), ('Mahakaran', false), ('Sealdah', false), ('Phoolbagan', false), ('Karunamoyee', false),
('Joka', false), ('Taratala', false), ('Victoria', false),
('Satyajit Ray', false), ('Hemanta Mukhopadhyay', false), ('VIP Bazar', false), ('New Town', false),
('Dum Dum Cantt', false), ('Jessore Road', false), ('Barasat', false),
('Kamarhati', false), ('Panihati', false), ('Barrackpore', false);

-- (You would also paste your station_routes INSERT commands here)