-- ========================================
-- SAMPLE DATA FOR SHIVA INFOTECH
-- Run this AFTER schema.sql
-- ========================================

-- Sample Products (IT Hardware & Equipment)
INSERT INTO public.products (name, description, price, stock, category, image_url) VALUES

-- Servers
('Dell PowerEdge R740 Server', 'Enterprise-grade 2U rack server with dual Intel Xeon Scalable processors, 64GB RAM, ideal for virtualization and high-performance computing', 250000, 5, 'Servers', 'https://placehold.co/600x400/4F46E5/FFFFFF/png?text=Dell+PowerEdge+R740'),
('HP ProLiant DL380 Gen10', 'Industry-standard 2U server with intelligent automation, security, and performance for hybrid cloud', 280000, 3, 'Servers', 'https://placehold.co/600x400/4F46E5/FFFFFF/png?text=HP+ProLiant+DL380'),
('Lenovo ThinkSystem SR650', '2U rack server with extreme performance and flexibility for data centers', 265000, 4, 'Servers', 'https://placehold.co/600x400/4F46E5/FFFFFF/png?text=Lenovo+SR650'),

-- Laptops
('HP EliteBook 840 G8', 'Business laptop with 11th Gen Intel Core i7, 16GB RAM, 512GB SSD, 14-inch FHD display', 85000, 15, 'Laptops', 'https://placehold.co/600x400/4F46E5/FFFFFF/png?text=HP+EliteBook+840'),
('Dell Latitude 7420', 'Premium business laptop with Intel Core i7, 16GB RAM, 14-inch FHD display, enterprise security', 92000, 12, 'Laptops', 'https://placehold.co/600x400/4F46E5/FFFFFF/png?text=Dell+Latitude+7420'),
('Lenovo ThinkPad X1 Carbon Gen 9', 'Ultraportable business laptop with 11th Gen Intel Core i7, 16GB RAM, 14-inch 2K display', 105000, 8, 'Laptops', 'https://placehold.co/600x400/4F46E5/FFFFFF/png?text=ThinkPad+X1'),
('Apple MacBook Pro 14-inch M1 Pro', 'Professional laptop with M1 Pro chip, 16GB RAM, 512GB SSD, Retina display', 185000, 6, 'Laptops', 'https://placehold.co/600x400/4F46E5/FFFFFF/png?text=MacBook+Pro+14'),

-- Desktops
('Lenovo ThinkCentre M720q Tiny', 'Compact desktop PC with Intel Core i5, 8GB RAM, 256GB SSD, perfect for office use', 35000, 20, 'Desktops', 'https://placehold.co/600x400/4F46E5/FFFFFF/png?text=ThinkCentre+M720q'),
('HP ProDesk 400 G7 SFF', 'Small form factor desktop with Intel Core i5, 8GB RAM, 500GB HDD, reliable business PC', 38000, 18, 'Desktops', 'https://placehold.co/600x400/4F46E5/FFFFFF/png?text=HP+ProDesk+400'),
('Dell OptiPlex 7090 Tower', 'Full tower desktop with Intel Core i7, 16GB RAM, 1TB SSD, expandable business workstation', 65000, 10, 'Desktops', 'https://placehold.co/600x400/4F46E5/FFFFFF/png?text=OptiPlex+7090'),

-- Networking Equipment
('Cisco SG350-28 Managed Switch', '28-port Gigabit managed switch with enterprise features, QoS, and advanced security', 45000, 8, 'Networking', 'https://placehold.co/600x400/4F46E5/FFFFFF/png?text=Cisco+SG350-28'),
('TP-Link TL-SG1024DE', '24-port Gigabit Easy Smart switch with VLAN and QoS support', 12000, 15, 'Networking', 'https://placehold.co/600x400/4F46E5/FFFFFF/png?text=TP-Link+Switch'),
('Ubiquiti UniFi Dream Machine Pro', 'All-in-one network solution with router, switch, security gateway, and controller', 55000, 6, 'Networking', 'https://placehold.co/600x400/4F46E5/FFFFFF/png?text=UniFi+Dream+Machine'),
('Cisco Meraki MR36 Access Point', 'Cloud-managed WiFi 6 access point with advanced security and analytics', 42000, 10, 'Networking', 'https://placehold.co/600x400/4F46E5/FFFFFF/png?text=Meraki+MR36'),

-- UPS & Power
('APC Smart-UPS 1500VA', 'Line-interactive UPS with 1500VA capacity, LCD display, automatic voltage regulation', 18000, 12, 'UPS', 'https://placehold.co/600x400/4F46E5/FFFFFF/png?text=APC+Smart-UPS'),
('Eaton 5P 1550VA Rack UPS', '1U rack-mountable UPS with pure sine wave output and LCD display', 28000, 8, 'UPS', 'https://placehold.co/600x400/4F46E5/FFFFFF/png?text=Eaton+5P'),
('CyberPower CP1500PFCLCD', 'PFC Sinewave UPS with 1500VA capacity, LCD panel, 10 outlets', 15000, 15, 'UPS', 'https://placehold.co/600x400/4F46E5/FFFFFF/png?text=CyberPower+UPS'),

-- Storage
('Synology DS920+ NAS', '4-bay NAS with Intel Celeron, 4GB RAM, perfect for small business data storage', 48000, 7, 'Storage', 'https://placehold.co/600x400/4F46E5/FFFFFF/png?text=Synology+DS920'),
('QNAP TS-453D NAS', '4-bay NAS with Intel Celeron quad-core, transcoding, virtualization support', 52000, 5, 'Storage', 'https://placehold.co/600x400/4F46E5/FFFFFF/png?text=QNAP+TS-453D'),
('Western Digital My Cloud EX2 Ultra', '2-bay personal cloud storage with 8TB total capacity', 35000, 10, 'Storage', 'https://placehold.co/600x400/4F46E5/FFFFFF/png?text=WD+My+Cloud'),

-- Printers
('HP LaserJet Pro MFP M428fdw', 'Monochrome multifunction laser printer with print, scan, copy, fax, duplex, WiFi', 32000, 12, 'Printers', 'https://placehold.co/600x400/4F46E5/FFFFFF/png?text=HP+LaserJet+M428'),
('Canon imageRUNNER 2630i', 'A3 multifunction printer with 30ppm, duplex, network printing for office use', 95000, 4, 'Printers', 'https://placehold.co/600x400/4F46E5/FFFFFF/png?text=Canon+imageRUNNER'),
('Epson EcoTank L3250 AIO', 'Ink tank color printer with WiFi, print, scan, copy, low running cost', 15000, 20, 'Printers', 'https://placehold.co/600x400/4F46E5/FFFFFF/png?text=Epson+EcoTank');


-- Sample Services
INSERT INTO public.services (name, description, price, category, duration_hours, image_url) VALUES

-- Installation Services
('Server Installation & Configuration', 'Complete server setup including OS installation, RAID configuration, network setup, and security hardening', 15000, 'Installation', 8, 'https://placehold.co/600x400/10B981/FFFFFF/png?text=Server+Installation'),
('Network Infrastructure Setup', 'Professional LAN/WAN setup with router configuration, switch installation, cable management, and testing', 10000, 'Installation', 6, 'https://placehold.co/600x400/10B981/FFFFFF/png?text=Network+Setup'),
('CCTV System Installation', 'Complete surveillance system installation with IP cameras, NVR setup, and mobile app configuration', 12000, 'Installation', 8, 'https://placehold.co/600x400/10B981/FFFFFF/png?text=CCTV+Installation'),
('Desktop Computer Setup', 'Complete desktop PC assembly, OS installation, driver setup, and software installation', 2000, 'Installation', 2, 'https://placehold.co/600x400/10B981/FFFFFF/png?text=Desktop+Setup'),
('Workstation Deployment', 'Bulk workstation deployment with OS imaging, domain joining, software installation', 3500, 'Installation', 3, 'https://placehold.co/600x400/10B981/FFFFFF/png?text=Workstation+Deploy'),

-- Maintenance Services
('IT System Maintenance (AMC)', 'Monthly preventive maintenance including system health check, updates, cleaning, and performance optimization', 5000, 'Maintenance', 4, 'https://placehold.co/600x400/F59E0B/FFFFFF/png?text=IT+Maintenance'),
('Server Health Check', 'Comprehensive server diagnostics, performance analysis, security audit, and optimization', 6000, 'Maintenance', 4, 'https://placehold.co/600x400/F59E0B/FFFFFF/png?text=Server+Health+Check'),
('Network Performance Audit', 'Complete network analysis, bandwidth testing, security assessment, and optimization recommendations', 8000, 'Maintenance', 5, 'https://placehold.co/600x400/F59E0B/FFFFFF/png?text=Network+Audit'),
('Backup System Verification', 'Backup integrity check, restore testing, configuration review, and disaster recovery planning', 4000, 'Maintenance', 3, 'https://placehold.co/600x400/F59E0B/FFFFFF/png?text=Backup+Verification'),

-- Support Services
('Data Recovery Service', 'Professional data recovery from failed hard drives, SSDs, RAID arrays, and corrupted systems', 8000, 'Support', 6, 'https://placehold.co/600x400/EF4444/FFFFFF/png?text=Data+Recovery'),
('Virus Removal & Security Cleanup', 'Complete malware removal, system disinfection, security hardening, and antivirus setup', 3000, 'Support', 3, 'https://placehold.co/600x400/EF4444/FFFFFF/png?text=Virus+Removal'),
('Remote IT Support (Monthly)', 'Unlimited remote assistance for troubleshooting, issue resolution, and technical guidance', 4500, 'Support', 0, 'https://placehold.co/600x400/EF4444/FFFFFF/png?text=Remote+Support'),
('On-Site IT Support', 'On-demand on-site technical support for hardware issues, troubleshooting, and repairs', 2500, 'Support', 2, 'https://placehold.co/600x400/EF4444/FFFFFF/png?text=Onsite+Support'),
('Email Server Setup', 'Professional email server deployment with Microsoft Exchange or open-source alternatives', 18000, 'Support', 8, 'https://placehold.co/600x400/EF4444/FFFFFF/png?text=Email+Server'),

-- Training Services
('IT Security Awareness Training', 'Comprehensive cybersecurity training for employees covering phishing, passwords, and best practices', 12000, 'Training', 6, 'https://placehold.co/600x400/8B5CF6/FFFFFF/png?text=Security+Training'),
('Microsoft Office 365 Training', 'Hands-on training for Word, Excel, PowerPoint, Outlook, Teams, and SharePoint', 8000, 'Training', 8, 'https://placehold.co/600x400/8B5CF6/FFFFFF/png?text=Office+365+Training'),
('Network Administration Workshop', 'Practical network administration training covering switches, routers, and network security', 15000, 'Training', 16, 'https://placehold.co/600x400/8B5CF6/FFFFFF/png?text=Network+Training');


-- Success message
SELECT 'Sample data inserted successfully!' as message,
       (SELECT COUNT(*) FROM products) as total_products,
       (SELECT COUNT(*) FROM services) as total_services;
