-- Insert predefined Routes
INSERT IGNORE INTO routes (id, source, destination, distance) VALUES 
(1, 'New York', 'Boston', 350.5),
(2, 'Los Angeles', 'San Francisco', 600.0),
(3, 'New York', 'Washington DC', 370.0),
(4, 'Chicago', 'Detroit', 450.0);

-- Insert predefined Buses
INSERT IGNORE INTO buses (id, bus_number, operator_name, total_seats, type) VALUES 
(1, 'NYB-101', 'Express Transit', 40, 'AC SEATER'),
(2, 'LAS-202', 'WestCoast Travels', 30, 'AC SLEEPER'),
(3, 'NYW-404', 'Capital Express', 40, 'AC SEATER'),
(4, 'CHD-303', 'Midwest Lines', 40, 'NON_AC SEATER');

-- Insert Bus Routes (Schedules)
-- We use future dates so they will show up in searches
INSERT IGNORE INTO bus_routes (id, bus_id, route_id, departure_time, arrival_time, fare) VALUES 
(1, 1, 1, '2026-05-15 08:00:00', '2026-05-15 12:30:00', 45.00),
(2, 2, 2, '2026-05-16 22:00:00', '2026-05-17 06:00:00', 85.50),
(3, 3, 3, '2026-05-15 09:00:00', '2026-05-15 14:00:00', 50.00),
(4, 4, 4, '2026-05-17 09:00:00', '2026-05-17 15:00:00', 30.00);
