const http = require('http');
const fs = require('fs');
const path = require('path');
const querystring = require('querystring');

const PORT = 3002;
const DATA_FILE = path.join(__dirname, 'students.json');

// Helper function to read students from file
function getStudents() {
    try {
        if (fs.existsSync(DATA_FILE)) {
            const data = fs.readFileSync(DATA_FILE, 'utf8');
            if (!data) return [];
            return JSON.parse(data);
        }
    } catch (error) {
        console.error("Error reading file:", error);
    }
    return [];
}

// Helper function to save students to file
function saveStudents(students) {
    try {
        fs.writeFileSync(DATA_FILE, JSON.stringify(students, null, 4));
    } catch (error) {
        console.error("Error writing file:", error);
    }
}

// Reusable CSS for all pages for consistency and premium aesthetics
const commonCSS = `
    @import url('https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;600&display=swap');
    
    * { margin: 0; padding: 0; box-sizing: border-box; font-family: 'Poppins', sans-serif; }
    
    body { 
        background: linear-gradient(rgba(13, 50, 77, 0.7), rgba(127, 90, 131, 0.7)), url('https://images.unsplash.com/photo-1541339907198-e08756dedf3f?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&q=80') center/cover fixed; 
        min-height: 100vh; 
        display: flex; 
        justify-content: center; 
        align-items: center; 
        padding: 40px 20px;
    }
    
    .glass-card { 
        background: rgba(255, 255, 255, 0.95); 
        padding: 40px; 
        border-radius: 20px; 
        box-shadow: 0 15px 35px rgba(0,0,0,0.2); 
        width: 100%; 
        max-width: 500px; 
        text-align: center;
        backdrop-filter: blur(10px);
        border: 1px solid rgba(255, 255, 255, 0.2);
        animation: fadeIn 0.8s ease-out;
    }
    
    .glass-card.wide { max-width: 900px; }
    
    @keyframes fadeIn {
        from { opacity: 0; transform: translateY(20px); }
        to { opacity: 1; transform: translateY(0); }
    }
    
    .logo { height: 70px; margin-bottom: 15px; object-fit: contain; }
    
    h2 { color: #0d324d; font-weight: 600; margin-bottom: 25px; font-size: 24px; }
    h3 { color: #555; font-weight: 400; font-size: 16px; margin-bottom: 30px; }
    
    .input-group { margin-bottom: 20px; text-align: left; }
    .input-group label { display: block; font-size: 14px; color: #333; margin-bottom: 8px; font-weight: 600; }
    .input-group input { 
        width: 100%; padding: 12px 15px; border: 2px solid #e1e5ee; border-radius: 8px; 
        font-size: 14px; transition: all 0.3s; background: #f8f9fa;
    }
    .input-group input:focus { border-color: #0d324d; background: white; outline: none; box-shadow: 0 0 0 3px rgba(13, 50, 77, 0.1); }
    
    .btn { 
        background: linear-gradient(135deg, #0d324d 0%, #1c5d8c 100%); 
        color: white; border: none; padding: 14px 20px; cursor: pointer; 
        border-radius: 8px; font-size: 16px; font-weight: 600; width: 100%; 
        transition: transform 0.2s, box-shadow 0.2s; 
        display: inline-block; text-decoration: none;
    }
    .btn:hover { transform: translateY(-2px); box-shadow: 0 8px 15px rgba(13, 50, 77, 0.3); }
    .btn.secondary { background: linear-gradient(135deg, #6c757d 0%, #495057 100%); margin-top: 15px; }
    
    /* Table Styles */
    .table-container { overflow-x: auto; margin-top: 20px; border-radius: 10px; box-shadow: 0 0 20px rgba(0,0,0,0.05); }
    table { width: 100%; border-collapse: collapse; background: white; }
    th, td { padding: 15px; text-align: left; border-bottom: 1px solid #eee; }
    th { background-color: #0d324d; color: white; font-weight: 600; font-size: 15px; white-space: nowrap; }
    tr:last-child td { border-bottom: none; }
    tr:nth-child(even) { background-color: #f8f9fa; }
    tr:hover { background-color: #f1f3f5; }
    td { color: #444; font-size: 14px; }
    
    .empty-state { padding: 40px; color: #888; font-style: italic; }
    
    .success-icon { font-size: 50px; color: #28a745; margin-bottom: 15px; }
`;

const server = http.createServer((req, res) => {
    
    // 1. GET / -> Display student form
    if (req.method === 'GET' && req.url === '/') {
        res.writeHead(200, { 'Content-Type': 'text/html' });
        res.end(`
            <!DOCTYPE html>
            <html lang="en">
            <head>
                <meta charset="UTF-8">
                <meta name="viewport" content="width=device-width, initial-scale=1.0">
                <title>ABES Student Record Portal</title>
                <style>${commonCSS}</style>
            </head>
            <body>
                <div class="glass-card">
                    <img src="https://upload.wikimedia.org/wikipedia/en/thumb/c/c5/ABES_Engineering_College_Logo.svg/1200px-ABES_Engineering_College_Logo.svg.png" alt="ABES Logo" class="logo">
                    <h2>Student Management Portal</h2>
                    
                    <form action="/add-student" method="POST">
                        <div class="input-group">
                            <label>Student Name</label>
                            <input type="text" name="name" placeholder="Enter full name" required>
                        </div>
                        <div class="input-group">
                            <label>Roll Number</label>
                            <input type="text" name="roll" placeholder="Enter university roll number" required>
                        </div>
                        <div class="input-group">
                            <label>Course / Branch</label>
                            <input type="text" name="course" placeholder="e.g. B.Tech - CSE" required>
                        </div>
                        <div class="input-group">
                            <label>Email Address</label>
                            <input type="email" name="email" placeholder="student@abes.ac.in" required>
                        </div>
                        <button type="submit" class="btn">Register Student</button>
                    </form>
                    <a href="/students" class="btn secondary">View Database</a>
                </div>
            </body>
            </html>
        `);
    } 
    
    // 2. POST /add-student -> Receive and save student data
    else if (req.method === 'POST' && req.url === '/add-student') {
        let body = '';
        
        req.on('data', chunk => {
            body += chunk.toString();
        });
        
        req.on('end', () => {
            const parsedData = querystring.parse(body);
            const students = getStudents();
            
            students.push({
                name: parsedData.name,
                roll: parsedData.roll,
                course: parsedData.course,
                email: parsedData.email
            });
            
            saveStudents(students);
            
            res.writeHead(200, { 'Content-Type': 'text/html' });
            res.end(`
                <!DOCTYPE html>
                <html lang="en">
                <head>
                    <meta charset="UTF-8">
                    <meta name="viewport" content="width=device-width, initial-scale=1.0">
                    <title>Success - ABES Portal</title>
                    <style>${commonCSS}</style>
                </head>
                <body>
                    <div class="glass-card">
                        <img src="https://upload.wikimedia.org/wikipedia/en/thumb/c/c5/ABES_Engineering_College_Logo.svg/1200px-ABES_Engineering_College_Logo.svg.png" alt="ABES Logo" class="logo">
                        <div class="success-icon">✓</div>
                        <h2>Registration Successful</h2>
                        <h3>Student record for <strong>${parsedData.name}</strong> has been securely saved to the database.</h3>
                        <a href="/students" class="btn">View All Students</a>
                        <a href="/" class="btn secondary">Add Another Student</a>
                    </div>
                </body>
                </html>
            `);
        });
    } 
    
    // 3. GET /students -> Display all student records
    else if (req.method === 'GET' && req.url === '/students') {
        const students = getStudents();
        let tableRows = '';
        
        if (students.length === 0) {
            tableRows = '<tr><td colspan="4" class="empty-state">No student records found in the database.</td></tr>';
        } else {
            students.forEach((student, index) => {
                tableRows += `
                    <tr>
                        <td><strong>${index + 1}</strong></td>
                        <td>${student.name}</td>
                        <td>${student.roll}</td>
                        <td><span style="background: #e9ecef; padding: 4px 8px; border-radius: 4px; font-size: 12px; font-weight: 600;">${student.course}</span></td>
                        <td><a href="mailto:${student.email}" style="color: #0d324d; text-decoration: none;">${student.email}</a></td>
                    </tr>
                `;
            });
        }

        res.writeHead(200, { 'Content-Type': 'text/html' });
        res.end(`
            <!DOCTYPE html>
            <html lang="en">
            <head>
                <meta charset="UTF-8">
                <meta name="viewport" content="width=device-width, initial-scale=1.0">
                <title>Student Database - ABES</title>
                <style>${commonCSS}</style>
            </head>
            <body>
                <div class="glass-card wide">
                    <img src="https://upload.wikimedia.org/wikipedia/en/thumb/c/c5/ABES_Engineering_College_Logo.svg/1200px-ABES_Engineering_College_Logo.svg.png" alt="ABES Logo" class="logo">
                    <h2>ABES Student Database</h2>
                    
                    <div class="table-container">
                        <table>
                            <thead>
                                <tr>
                                    <th>#</th>
                                    <th>Student Name</th>
                                    <th>Roll Number</th>
                                    <th>Course/Branch</th>
                                    <th>Email Address</th>
                                </tr>
                            </thead>
                            <tbody>
                                ${tableRows}
                            </tbody>
                        </table>
                    </div>
                    
                    <div style="margin-top: 30px; display: flex; gap: 15px; justify-content: center;">
                        <a href="/" class="btn" style="max-width: 200px;">+ Add New Student</a>
                    </div>
                </div>
            </body>
            </html>
        `);
    } 
    
    // 4. Handle invalid routes (404 Not Found)
    else {
        res.writeHead(404, { 'Content-Type': 'text/html' });
        res.end(`
            <!DOCTYPE html>
            <html lang="en">
            <head><style>${commonCSS}</style></head>
            <body>
                <div class="glass-card">
                    <h2 style="font-size: 48px; margin: 0; color: #dc3545;">404</h2>
                    <h3>Page Not Found</h3>
                    <a href="/" class="btn">Return to Home</a>
                </div>
            </body>
            </html>
        `);
    }
});

// Start the server
server.listen(PORT, () => {
    console.log(`Server is running at http://localhost:${PORT}`);
});
